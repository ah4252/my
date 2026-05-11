"use client";

import { useEffect, useState } from "react";
import { savePushSubscription } from "@/app/actions/content";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushInitializer({ userId }: { userId: string | null }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!userId) return;

    if ("serviceWorker" in navigator && "PushManager" in window) {
      checkPermission();
    }
  }, [userId]);

  const checkPermission = async () => {
    if (Notification.permission === "default") {
      // Small delay to not annoy the user immediately
      setTimeout(() => setShowPrompt(true), 3000);
    } else if (Notification.permission === "granted") {
      registerAndSubscribe();
    }
  };

  const registerAndSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) return;

        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        
        await saveToDB(newSubscription);
      } else {
        await saveToDB(subscription);
      }
    } catch (error) {
      console.error("Push registration failed:", error);
    }
  };

  const saveToDB = async (sub: PushSubscription) => {
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey("p256dh")!) as any));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey("auth")!) as any));
    
    await savePushSubscription(userId!, {
      endpoint: sub.endpoint,
      keys: { p256dh, auth }
    });
  };

  const handleAccept = () => {
    setShowPrompt(false);
    registerAndSubscribe();
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:w-[400px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 rounded-[2rem] shadow-2xl z-[100] border border-white/10 dark:border-slate-200"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-medical-500 rounded-2xl flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3">
              <h3 className="font-black text-lg">تفعيل تنبيهات النخبة؟ 🔔</h3>
              <p className="text-xs text-slate-300 dark:text-slate-500 font-bold leading-relaxed">
                اشترك لتصلك إشعارات الدروس الجديدة وأخبار المنصة فوراً على هاتفك وحاسوبك.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleAccept}
                  className="flex-1 py-3 bg-medical-500 hover:bg-medical-600 text-white rounded-xl font-black text-sm transition-all"
                >
                  تفعيل الآن
                </button>
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="px-6 py-3 bg-white/10 dark:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  لاحقاً
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
