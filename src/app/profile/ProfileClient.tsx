"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/auth";
import { User, Camera, Save, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfileClient({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const res = await updateProfile(formData);
    if (res?.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "تم تحديث ملفك الشخصي بنجاح!", type: "success" });
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 mb-8 transition-colors group">
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        <span>العودة للرئيسية</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-medical-600/5 border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <div className="relative inline-block group">
            <div className="w-32 h-32 rounded-full bg-medical-50 dark:bg-medical-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-medical-600 dark:text-medical-400" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 cursor-pointer hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-6">{user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/30" 
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"
            }`}
          >
            {message.type === "success" && <CheckCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <form action={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">اسم العرض</label>
            <input 
              name="name"
              defaultValue={user.name || ""}
              required
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">رابط الصورة الشخصية</label>
            <input 
              name="image"
              defaultValue={user.image || ""}
              placeholder="https://..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
              dir="ltr"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
