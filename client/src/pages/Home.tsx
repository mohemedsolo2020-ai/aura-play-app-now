import { Navbar } from "@/components/Navbar";
import { ContentRow } from "@/components/ContentRow";
import { data } from "@/lib/data";
import { useEffect, useRef, useState, useMemo, Suspense, lazy } from "react";
import { ContentCard } from "@/components/ContentCard";
import { Link, useLocation } from "wouter";
import { Hero } from "@/components/Hero";
import { Home as HomeIcon, Film, Tv, PlaySquare, Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const AdBanner = ({ id }: { id?: string }) => {
  return null;
};

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
          <Link key={item.path} href={item.path}>
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
          </Link>
        );
      })}
    </div>
  );
};

const AnimeAutoSlider = ({ items }: { items: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (Math.abs(scrollLeft) >= maxScroll - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(Math.abs(scrollLeft) / (clientWidth * 0.8));
      setActiveIndex(index);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden pt-12 pb-12 bg-gradient-to-b from-[#050B18] to-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-8 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-primary fill-current" />
          تحديثات الأنمي الجديدة
        </h2>
      </div>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-8 gap-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => {
          const slug = data.getSlug(item.title);
          return (
            <div key={item.id} className="flex-none w-[70vw] md:w-[280px] snap-center">
              <Link href={`/details/${item.id}/${slug}`} className="block aspect-[4/5] relative group rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 cursor-pointer">
                  <img 
                    src={item.poster} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight text-right">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold justify-end">
                      <span>{item.year}</span>
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span className="text-primary">{item.rating} ★</span>
                    </div>
                  </div>
                </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Home() {
  const featured = data.getFeatured();
  const trending = data.getTrending();
  const newReleases = data.getNewReleases();
  const anime = data.getByType("anime").slice(0, 15);
  const movies = data.getByType("movie").slice(0, 15);
  const series = data.getByType("series").slice(0, 15);
  const animation = data.getByType("animation").slice(0, 15);
  const asian = data.getByType("asian_series").slice(0, 15);

  return (
    <div className="min-h-screen bg-background pb-32" dir="rtl">
      <Navbar />
      
      <div className="pt-0 space-y-0 relative z-10">
        <Hero items={featured} />
        
        <div className="mt-[-100px] relative z-20">
          <ContentRow title="الأكثر تداولاً الآن" items={trending} variant="portrait" />
          <AdBanner id="banner-home-1" />
          <AnimeAutoSlider items={anime} />
          <ContentRow title="إصدارات جديدة" items={newReleases} variant="landscape" />
          <AdBanner id="banner-home-2" />
          <div className="bg-gradient-to-b from-transparent via-primary/5 to-transparent py-12">
            <ContentRow title="رسوم متحركة" items={animation} variant="portrait" />
            <ContentRow title="مسلسلات آسيوية" items={asian} variant="portrait" />
          </div>
          <AdBanner id="banner-home-3" />
          <ContentRow title="أفلام" items={movies} variant="portrait" />
          <ContentRow title="مسلسلات" items={series} variant="portrait" />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
