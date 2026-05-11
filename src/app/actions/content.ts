"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Categories (Years/Subjects) ---
export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string || "YEAR";
  
  if (!name) return { error: "الاسم مطلوب" };
  
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

  try {
    await prisma.category.create({
      data: { name, description, slug, type },
    });
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الإضافة" };
  }
}

export async function getCategories(type?: string) {
  return await prisma.category.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: "asc" }
  });
}

// --- Lessons ---
export async function addLesson(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const pdfUrl = formData.get("pdfUrl") as string;
  const summaryUrl = formData.get("summaryUrl") as string;

  if (!title || !categoryId) return { error: "العنوان والسنة الدراسية مطلوبان" };

  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

  try {
    // Note: Since we are skipping the Subject model for simplicity, we'll link directly to a default Subject or adjust logic.
    // For now, let's create a dummy subject if one doesn't exist for the category
    let subject = await prisma.subject.findFirst({ where: { categoryId } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: "عام", slug: "general-" + categoryId, categoryId }
      });
    }

    const resourcesData = formData.get("resources") as string;
    const resources = resourcesData ? JSON.parse(resourcesData) : [];

    await prisma.lesson.create({
      data: {
        title,
        description,
        slug,
        videoUrl, // Keep for compatibility
        pdfUrl,   // Keep for compatibility
        summaryUrl, // Keep for compatibility
        isPublished: true,
        subjectId: subject.id,
        resources: {
          create: resources.map((r: any) => ({
            title: r.title,
            type: r.type,
            url: r.url
          }))
        }
      },
    });
    
    revalidatePath("/admin/lessons");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء إضافة الدرس" };
  }
}

export async function getLessons() {
  try {
    return await prisma.lesson.findMany({
      include: { 
        subject: { 
          include: { 
            category: true 
          } 
        },
        resources: true 
      },
      orderBy: { 
        createdAt: "desc" 
      }
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function deleteLesson(id: string) {
  try {
    await prisma.lesson.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.subject.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "الاسم مطلوب" };

  try {
    await prisma.category.update({
      where: { id },
      data: { name, description }
    });
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التحديث" };
  }
}

export async function updateLesson(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const pdfUrl = formData.get("pdfUrl") as string;
    const summaryUrl = formData.get("summaryUrl") as string;

    if (!title || !categoryId) return { error: "العنوان والسنة الدراسية مطلوبان" };

    let subject = await prisma.subject.findFirst({ where: { categoryId } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: "عام", slug: "general-" + categoryId, categoryId }
      });
    }

    const resourcesData = formData.get("resources") as string;
    const resources = resourcesData ? JSON.parse(resourcesData) : [];

    await prisma.lesson.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        pdfUrl,
        summaryUrl,
        subjectId: subject.id,
        resources: {
          deleteMany: {}, // Clear old resources
          create: resources.map((r: any) => ({
            title: r.title,
            type: r.type,
            url: r.url
          }))
        }
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/courses");
    revalidatePath(`/courses/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.comment.deleteMany({ where: { userId: id } });
    await prisma.favorite.deleteMany({ where: { userId: id } });
    await prisma.progress.deleteMany({ where: { userId: id } });
    
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف المستخدم" };
  }
}

export async function searchContent(query: string) {
  if (!query) return { lessons: [], categories: [], subjects: [] };

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ],
        isPublished: true
      },
      include: { subject: { include: { category: true } } },
      take: 5
    });

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      take: 5
    });

    const subjects = await prisma.subject.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: { category: true },
      take: 5
    });

    return { lessons, categories, subjects };
  } catch (error) {
    return { lessons: [], categories: [], subjects: [] };
  }
}

export async function saveGPA(userId: string, gpa: string, subjects: any[]) {
  try {
    await (prisma as any).gPACalculation.create({
      data: {
        userId,
        gpa,
        subjects: JSON.stringify(subjects)
      }
    });
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حفظ النتيجة" };
  }
}

export async function getSavedGPA(userId: string) {
  try {
    return await (prisma as any).gPACalculation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    return null;
  }
}

export async function getAllGPACalculations() {
  try {
    return await (prisma as any).gPACalculation.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    return [];
  }
}

export async function deleteGPACalculation(id: string) {
  try {
    await (prisma as any).gPACalculation.delete({
      where: { id }
    });
    revalidatePath("/admin/gpa");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
