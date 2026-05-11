"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, CheckCircle2, Inbox, ExternalLink, X, Zap, Trash2 } from "lucide-react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/app/actions/content";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) return "الآن";
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
  
  return new Date(date).toLocaleDateString("ar-EG");
}

export default function NotificationBell({ userId }: { userId: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // More frequent polling for "real-time" feel
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    if (!userId) return;
    try {
      const data = await getNotifications(userId);
      setNotifications(data as any);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (e) {
      console.error("Error fetching notifications", e);
    }
  }

  async function handleMarkRead(id: string) {
    await markNotificationAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.isRead).length);
  }

  async function handleMarkAllRead() {
    if (!userId) return;
    await markAllNotificationsAsRead(userId);
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
      >
        <Bell className={`w-5 h-5 transition-colors ${isOpen ? "text-medical-600" : "text-slate-500 group-hover:text-medical-600"}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg animate-bounce">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
            className="absolute left-1/2 mt-4 w-[350px] sm:w-[420px] bg-white dark:bg-[#111827] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-medical-100 dark:bg-medical-900/40 rounded-2xl flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-medical-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">مركز التنبيهات</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AuraMed Elite Notifications</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-black text-medical-600 hover:text-medical-700 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/40 px-3 py-1.5 rounded-xl transition-all"
                >
                  تحديد الكل
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-20 px-10 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">لا توجد تنبيهات جديدة حالياً</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-6 transition-all relative group cursor-pointer ${
                        !notif.isRead ? "bg-medical-50/30 dark:bg-medical-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}
                      onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                    >
                      <div className="flex gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          notif.type === 'NEW_LESSON' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                        }`}>
                          {notif.type === 'NEW_LESSON' ? <Zap className="w-6 h-6 fill-current" /> : <Bell className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h4 className={`text-[15px] font-black leading-tight ${!notif.isRead ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <span className="w-2.5 h-2.5 bg-medical-500 rounded-full shrink-0 mt-1 shadow-[0_0_12px_rgba(14,165,233,0.6)] animate-pulse" />
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                            {notif.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                            
                            <div className="flex items-center gap-3">
                              {notif.link && (
                                <Link
                                  href={notif.link}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkRead(notif.id);
                                    setIsOpen(false);
                                  }}
                                  className="text-[11px] font-black text-medical-600 dark:text-medical-400 flex items-center gap-1.5 hover:underline bg-medical-50 dark:bg-medical-900/30 px-3 py-1.5 rounded-lg"
                                >
                                  عرض المحتوى
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notif.id);
                                }}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-slate-400 hover:text-red-500"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link 
                href="/profile?tab=notifications" 
                className="text-xs font-black text-slate-500 hover:text-medical-600 dark:text-slate-400 dark:hover:text-medical-400 transition-colors uppercase tracking-[0.2em]"
                onClick={() => setIsOpen(false)}
              >
                عرض سجل التنبيهات الكامل
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
