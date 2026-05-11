"use client";

import { useEffect } from "react";
import { savePushSubscription } from "@/app/actions/content";

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
  useEffect(() => {
    if (!userId) return;

    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, [userId]);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscribeUser(registration);
      } else {
        // Update subscription in DB just in case
        const subJSON = subscription.toJSON();
        if (subJSON.endpoint && subJSON.keys?.p256dh && subJSON.keys?.auth) {
          await savePushSubscription(userId!, subJSON);
        }
      }
    } catch (error) {
      console.error("Service Worker Registration Error:", error);
    }
  }

  async function subscribeUser(registration: ServiceWorkerRegistration) {
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) return;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey.trim()),
      });

      const subJSON = subscription.toJSON();
      if (subJSON.endpoint && subJSON.keys?.p256dh && subJSON.keys?.auth) {
        await savePushSubscription(userId!, subJSON);
      }
    } catch (error) {
      console.error("Failed to subscribe user:", error);
    }
  }

  return null;
}
