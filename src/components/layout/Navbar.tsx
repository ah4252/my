"use client";

import Link from "next/link";
import { BookOpen, Search as SearchIcon, User, Menu, Stethoscope, Lock, X, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logoutAdmin, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import SearchModal from "./SearchModal";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ isAdmin = false, isUser = false, userName = null, userImage = null }: { isAdmin?: boolean, isUser?: boolean, userName?: string | null, userImage?: string | null }) {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment clicks
    setClicks(prev => prev + 1);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    
    clickTimeout.current = setTimeout(() => {
      setClicks(0); // reset if they stop clicking
    }, 1000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      setShowModal(true);
      setClicks(0);
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
    }
  }, [clicks]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const { loginAdmin } = await import("@/app/actions/auth");
    const res = await loginAdmin(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setShowModal(false);
      setPassword("");
      router.refresh();
      router.push("/admin");
    }
    setLoading(false);
  };

  const handleLogoutUser = async () => {
    await logoutUser();
    router.refresh();
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Premium Logo */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 select-none cursor-pointer group"
          >
            {/* Premium SVG Emblem */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                {/* Outer golden ring */}
                <circle cx="50" cy="50" r="48" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none"/>
                {/* Inner dark circle */}
                <circle cx="50" cy="50" r="43" fill="#0f172a" fillOpacity="0.95"/>
                {/* Medical cross subtle bg */}
                <rect x="44" y="24" width="12" height="52" rx="4" fill="url(#blueGrad)" fillOpacity="0.15"/>
                <rect x="24" y="44" width="52" height="12" rx="4" fill="url(#blueGrad)" fillOpacity="0.15"/>
                {/* Stethoscope path */}
                <path d="M35 30 C35 30 28 30 28 40 L28 55 C28 64 36 70 44 70 C52 70 58 64 58 55 L58 52" stroke="url(#blueGrad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
                {/* Stethoscope head */}
                <circle cx="65" cy="46" r="8" stroke="url(#goldGrad)" strokeWidth="3" fill="#0f172a"/>
                <circle cx="65" cy="46" r="3.5" fill="url(#goldGrad)"/>
                {/* A letter hint */}
                <path d="M42 62 L50 45 L58 62" stroke="url(#blueGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
                <path d="M45 57 L55 57" stroke="url(#blueGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
                {/* Gradient defs */}
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f59e0b"/>
                    <stop offset="50%" stopColor="#fcd34d"/>
                    <stop offset="100%" stopColor="#d97706"/>
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8"/>
                    <stop offset="100%" stopColor="#0ea5e9"/>
                  </linearGradient>
                </defs>
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"/>
            </div>

            {/* Text part */}
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600 italic">Aura</span>
                <span className="text-slate-800 dark:text-white not-italic font-light">Med</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-amber-500 uppercase mt-0.5">Elite</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-bold">
            <Link href="/" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              الرئيسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/courses" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              السنوات الدراسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/subjects" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              التخصصات
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/gpa-calculator" 
              className="px-6 py-2.5 bg-gradient-to-r from-medical-600 to-medical-400 text-white rounded-[1.2rem] hover:shadow-lg hover:shadow-medical-600/30 hover:scale-105 active:scale-95 transition-all font-black text-sm shadow-md shadow-medical-600/10"
            >
              حاسبة المعدل
            </Link>
            {isAdmin && (
              <Link href="/admin" className="group text-medical-600 dark:text-medical-400 font-bold flex items-center gap-1.5 bg-medical-50 dark:bg-medical-900/30 px-4 py-2 rounded-xl hover:bg-medical-100 dark:hover:bg-medical-900/50 transition-all border border-medical-100 dark:border-medical-500/20 shadow-sm">
                <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-slate-100 dark:bg-dark-card rounded-full transition-colors"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            
            {isUser ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="hidden md:flex flex-col items-end mr-1 group-hover:text-medical-600 transition-colors">
                    <span className="text-xs text-slate-500">أهلاً بك</span>
                    <span className="text-sm font-bold">{userName}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center border-2 border-transparent group-hover:border-medical-500 transition-all overflow-hidden">
                    {userImage ? (
                      <img src={userImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                    )}
                  </div>
                </Link>
                <button 
                  onClick={handleLogoutUser}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-5 py-2 rounded-full transition-all shadow-md shadow-medical-600/20">
                <User className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
            )}

            <button className="md:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Secret Admin Login Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="relative mb-6">
                   <div className="w-20 h-20 bg-gradient-to-tr from-medical-600 to-medical-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-medical-600/30 rotate-12">
                      <Lock className="w-10 h-10" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-white dark:border-dark-card">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">المنطقة المحظورة</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">تشفير عالي المستوى - يرجى إدخال رمز الدخول</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-black mb-6 text-center border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="relative">
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     autoFocus
                     placeholder="••••••••"
                     className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-medical-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-center font-mono text-2xl tracking-[0.5em] transition-all"
                     dir="ltr"
                   />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-medical-600 dark:hover:bg-medical-500 dark:hover:text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "تأكيد الهوية والدخول"
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black italic">Security Protocol Alpha-7</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSearch && (
          <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
