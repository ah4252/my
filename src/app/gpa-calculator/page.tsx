import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import GPACalculatorClient from "./GPACalculatorClient";

export default async function GPACalculatorPage() {
  const userId = cookies().get("user_token")?.value;
  
  let initialData = null;
  if (userId) {
    const saved = await (prisma as any).gPACalculation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    if (saved) {
      initialData = {
        gpa: saved.gpa,
        subjects: JSON.parse(saved.subjects)
      };
    }
  }

  return <GPACalculatorClient userId={userId || null} initialData={initialData} />;
}
