"use client";

import { addLesson } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import { getCategories } from "@/app/actions/content";

export default function AdminLessonsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // In a real app we'd fetch this Server-Side, but doing it here for speed
    getCategories().then(setCategories);
  }, []);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    const res = await addLesson(formData);
    if (res.error) setMessage(res.error);
    else setMessage("تمت إضافة الدرس بنجاح وسيظهر فوراً في الموقع!");
    setLoading(false);
  }

  return (
    <div className="max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">إدارة الدروس والمحاضرات</h1>
      
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-medical-600" />
          إضافة درس جديد
        </h2>
        
        {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">{message}</div>}

        <form action={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان الدرس</label>
              <input name="title" required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السنة الدراسية التابع لها</label>
              <select name="categoryId" required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">وصف الدرس</label>
            <textarea name="description" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent min-h-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">رابط الفيديو (اختياري)</label>
              <input name="videoUrl" type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رابط ملف PDF (اختياري)</label>
              <input name="pdfUrl" type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">رابط الملخص (اختياري)</label>
            <input name="summaryUrl" type="url" placeholder="https://..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" dir="ltr" />
          </div>
          
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 mt-4">
            <Save className="w-5 h-5" />
            {loading ? "جاري النشر..." : "نشر الدرس"}
          </button>
        </form>
      </div>
    </div>
  );
}
