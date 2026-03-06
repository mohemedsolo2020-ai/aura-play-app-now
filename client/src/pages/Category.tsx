import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { ContentCard } from "@/components/ContentCard";
import { data } from "@/lib/data";
import { useEffect, useState, useMemo } from "react";
import { Home as HomeIcon, Film, Tv, PlaySquare, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const [location] = useLocation();
  const items = [
    { icon: HomeIcon, label: "الرئيسية", path: "/" },
    { icon: Film, label: "أفلام", path: "/movies" },
    { icon: Tv, label: "مسلسلات", path: "/series" },
    { icon: PlaySquare, label: "أنمي", path: "/anime" },
    { icon: Search, label: "بحث", path: "/search" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#050B18]/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {items.map((item) => {
        const isActive = location === item.path;
        return (
          <a key={item.path} href={item.path}>
            <div className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative",
              isActive ? "text-primary scale-110" : "text-gray-500 hover:text-gray-400"
            )}>
              {isActive && (
                <div className="absolute -top-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
              )}
              <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default function Category() {
  const { type } = useParams();
  const [displayCount, setDisplayCount] = useState(24);

  const categoryType = 
    type === "series" ? "series" : 
    type === "movies" ? "movies" : 
    type === "animation" ? "animation" : 
    type === "asian" ? "asian" : 
    "anime";
  
  const items = useMemo(() => data.getByType(categoryType), [categoryType]);
  const trending = useMemo(() => items.filter(i => i.isPopular).slice(0, 12), [items]);
  const visibleItems = useMemo(() => items.slice(0, displayCount), [items, displayCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setDisplayCount(prev => Math.min(prev + 24, items.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  return (
    <div className="min-h-screen bg-background pb-32" dir="rtl">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-white font-display flex items-center gap-3 text-right">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-primary fill-current" />
              {type === "series" ? "المسلسلات" : 
               type === "movies" ? "الأفلام" : 
               type === "animation" ? "الكرتون" : 
               type === "asian" ? "الدراما الآسيوية" : 
               "عالم الأنمي"}
            </h1>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl text-right">
              استكشف مجموعة مختارة من أفضل {type === "series" ? "المسلسلات" : "الأفلام"} المتاحة بجودة عالية وترجمة احترافية.
            </p>
          </div>
          <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
            <span className="text-primary font-bold">{items.length} محتوى متاح</span>
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="text-gray-400 text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-white/5">
            لا يوجد محتوى في هذا القسم حالياً.
          </div>
        ) : (
          <>
             {trending.length > 0 && (
               <section className="space-y-6">
                 <h2 className="text-2xl font-black text-white px-2 text-right">الأكثر تداولاً الآن</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                   {trending.map((item) => (
                     <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <ContentCard content={item} />
                     </div>
                   ))}
                 </div>
               </section>
             )}
             
             <section className="space-y-6 pt-8">
               <h2 className="text-2xl font-black text-white px-2 text-right">جميع النتائج</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                 {visibleItems.map((item) => (
                   <div key={item.id} className="animate-in fade-in zoom-in-95 duration-500">
                     <ContentCard content={item} />
                   </div>
                 ))}
               </div>
               
               {displayCount < items.length && (
                 <div className="flex justify-center pt-12">
                   <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                     <span>جاري تحميل المزيد...</span>
                   </div>
                 </div>
               )}
             </section>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
