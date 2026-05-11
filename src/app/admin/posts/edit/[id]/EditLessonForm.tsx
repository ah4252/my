"use client";

import { updateLesson } from "@/app/actions/content";
import { useState } from "react";
import { Save, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditLessonForm({ lesson, categories }: { lesson: any, categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleEdit(formData: FormData) {
    setLoading(true);
    const res = await updateLesson(lesson.id, formData);
    if (res?.error) {
      setMessage(res.error);
    } else {
      setMessage("تم حفظ التعديلات بنجاح!");
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/posts" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">تعديل الدرس: {lesson.title}</h1>
      </div>
      
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {message && (
          <div className={`mb-4 p-4 rounded-xl font-bold ${message.includes("بنجاح") ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {message}
          </div>
        )}

        <form action={handleEdit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان الدرس</label>
              <input name="title" defaultValue={lesson.title} required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السنة الدراسية التابع لها</label>
              <select name="categoryId" defaultValue={lesson.subject?.categoryId} required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all">
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">وصف الدرس</label>
            <textarea name="description" defaultValue={lesson.description || ""} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all min-h-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">رابط الفيديو (اختياري)</label>
              <input name="videoUrl" defaultValue={lesson.videoUrl || ""} type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رابط ملف PDF (اختياري)</label>
              <input name="pdfUrl" defaultValue={lesson.pdfUrl || ""} type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">رابط الملخص (اختياري)</label>
            <input name="summaryUrl" defaultValue={lesson.summaryUrl || ""} type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all" dir="ltr" />
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
              <Save className="w-5 h-5" />
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
