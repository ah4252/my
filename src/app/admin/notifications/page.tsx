"use client";

import { useState } from "react";
import { Bell, Send, Info, ExternalLink, Zap, ShieldCheck } from "lucide-react";
import { sendBroadcastNotification } from "@/app/actions/content";
import { motion } from "framer-motion";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const res = await sendBroadcastNotification(formData);

    if (res?.success) {
      setStatus({ type: 'success', msg: "تم إرسال التنبيه لجميع المستخدمين بنجاح! 🎉" });
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus({ type: 'error', msg: res?.error || "حدث خطأ أثناء الإرسال" });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-medical-100 dark:bg-medical-900/30 text-medical-600 rounded-xl">
            <Bell className="w-8 h-8" />
          </div>
          إرسال تنبيهات عامة
        </h1>
        <p className="text-slate-500 font-bold">هذه الرسالة ستظهر لجميع الطلاب المسجلين في المنصة فوراً.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl font-bold text-sm ${
                  status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                {status.msg}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">عنوان التنبيه</label>
              <input 
                name="title"
                type="text" 
                required
                placeholder="مثال: تحديث هام بخصوص الامتحانات"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-medical-500 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">نص الرسالة</label>
              <textarea 
                name="message"
                required
                rows={4}
                placeholder="اكتب هنا ما تود إبلاغ الطلاب به..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-medical-500 outline-none transition-all font-bold resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">رابط التوجيه (اختياري)</label>
              <div className="relative">
                <input 
                  name="link"
                  type="text" 
                  placeholder="/courses/lesson-slug"
                  className="w-full p-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-medical-500 outline-none transition-all font-bold"
                />
                <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">يمكنك وضع رابط لدرس معين أو صفحة داخلية ليتم توجيه الطالب إليها عند النقر.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-medical-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  إرسال التنبيه الآن
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-black">
              <Info className="w-5 h-5" />
              تذكر دائماً
            </div>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-3 font-medium leading-relaxed">
              <li className="flex gap-2">🔹 سيظهر هذا التنبيه في جرس الإشعارات لكل مستخدم.</li>
              <li className="flex gap-2">🔹 استخدم هذه الميزة للتحديثات الهامة فقط لتجنب إزعاج الطلاب.</li>
              <li className="flex gap-2">🔹 يمكنك إضافة رموز تعبيرية (Emojis) لجعل الرسالة أكثر تفاعلاً.</li>
            </ul>
          </div>

          <div className="bg-medical-600 rounded-[2rem] p-6 text-white space-y-4 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap className="w-24 h-24" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 font-black text-sky-200 mb-2">
                 <ShieldCheck className="w-5 h-5" />
                 حالة النظام
               </div>
               <div className="space-y-1">
                 <div className="text-3xl font-black italic flex items-center gap-2">
                   ACTIVE
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                 </div>
                 <p className="text-[10px] text-sky-100 font-bold uppercase tracking-widest">Web Push & In-App Engine</p>
               </div>
               <div className="mt-4 pt-4 border-t border-white/10 text-xs text-sky-100 font-medium">
                 تم تفعيل نظام الإشعارات الفورية (Web Push) بنجاح. سيصل التنبيه للهواتف والحواسيب حتى لو كان المتصفح مغلقاً.
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
