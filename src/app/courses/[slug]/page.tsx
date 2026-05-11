import { PlayCircle, Download, Heart, Share2, FileText, CheckCircle2, ArrowRight, BookOpen, Stethoscope, Sparkles } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

function getEmbedUrl(url: string | null) {
  if (!url) return null;
  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }
  } catch (e) {}
  return url;
}

export default async function LessonDetailsPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const lesson = await prisma.lesson.findUnique({
    where: { slug: decodedSlug },
    include: {
      subject: {
        include: {
          category: true
        }
      }
    }
  });

  if (!lesson) {
    notFound();
  }

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Premium Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link 
            href="/courses" 
            className="group flex items-center gap-2 bg-white dark:bg-dark-card px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-medical-500 transition-all text-slate-600 dark:text-slate-400 hover:text-medical-600"
          >
            <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-medical-50 dark:group-hover:bg-medical-900/30 transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-bold">العودة للدروس</span>
          </Link>
          
          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>
          
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <span className="bg-gradient-to-r from-medical-600/10 to-blue-600/10 dark:from-medical-600/20 dark:to-blue-600/20 text-medical-700 dark:text-medical-400 px-3 py-1.5 rounded-xl border border-medical-200/50 dark:border-medical-500/20 font-black text-[10px] uppercase tracking-wider">
              {lesson.subject?.category?.name || "عام"}
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-slate-300 font-bold truncate max-w-[200px] sm:max-w-md">
              {lesson.subject?.name}
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-400 dark:text-slate-500 truncate max-w-[150px] sm:max-w-xs">
              {lesson.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Video & Details) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Real Video Player */}
            <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200 dark:border-slate-800">
              {embedUrl ? (
                <iframe 
                  src={embedUrl} 
                  className="w-full h-full absolute inset-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-800">
                  <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p>الفيديو غير متوفر حالياً</p>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                    {lesson.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 text-sm px-3 py-1 rounded-lg font-bold">
                      المنصة الأكاديمية
                    </span>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      متاح للعرض
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg break-words whitespace-pre-wrap overflow-hidden">
                {lesson.description || "لا يوجد وصف مضاف لهذه المحاضرة."}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-medical-600 to-medical-400 flex items-center justify-center text-white shadow-lg shadow-medical-600/30 relative">
                  <Stethoscope className="w-8 h-8" />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-xl text-slate-900 dark:text-white italic">إدارة Aura<span className="not-italic font-light">Med</span></h4>
                  <p className="text-sm text-slate-500 font-bold">بكل رقي من المطور</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Resources Box */}
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-medical-600" />
                ملحقات المحاضرة
              </h3>
              
              {lesson.pdfUrl && (
                <a 
                  href={lesson.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-medical-500 hover:shadow-lg hover:shadow-medical-600/10 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-dark-card transition-all group mb-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">ملف الـ PDF للمحاضرة</span>
                      <span className="text-xs text-slate-500">متاح للتحميل</span>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-medical-600" />
                </a>
              )}

              {lesson.summaryUrl && (
                <a 
                  href={lesson.summaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-medical-500 hover:shadow-lg hover:shadow-medical-600/10 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-dark-card transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">ملخص المحاضرة</span>
                      <span className="text-xs text-slate-500">ملاحظات ومراجعة</span>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-medical-600" />
                </a>
              )}

              {!lesson.pdfUrl && !lesson.summaryUrl && (
                <div className="text-center p-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                  <p className="text-slate-500 text-sm">لا توجد ملفات مرفقة مع هذا الدرس حالياً.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
