"use client";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} 
    />
  );
}

export function NotificationSkeleton() {
  return (
    <div className="p-5 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-12 h-3" />
            </div>
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
