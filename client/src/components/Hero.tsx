import { Play, Info, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { ContentItem, data } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  items: ContentItem[];
}

export function Hero({ items }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const nextSlide = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setIsExiting(false);
    }, 500);
  }, [items.length]);

  const prevSlide = () => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      setIsExiting(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!items.length) return null;
  const content = items[currentIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#050B18]">
      {/* Background Image with Animation */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000 ease-in-out scale-105",
        isExiting ? "opacity-0 scale-110" : "opacity-100 scale-100"
      )}>
        <img
          src={content.backdrop || content.poster}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/40 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-black/40 md:hidden block" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24">
        <div className={cn(
          "max-w-3xl space-y-6 md:space-y-8 transition-all duration-700 delay-300",
          isExiting ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        )}>
          <div className="flex items-center gap-3 text-sm md:text-lg font-medium">
             <span className="bg-primary px-3 py-1 rounded-full text-white text-[10px] md:text-xs uppercase tracking-widest font-black shadow-lg shadow-primary/30">
              {content.type === "movie" ? "فيلم" : content.type === "series" ? "مسلسل" : content.type === "anime" ? "أنمي" : "عمل فني"}
            </span>
            <span className="text-white/90">{content.year}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              {content.rating} ★
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black leading-none text-white drop-shadow-2xl font-display text-right md:text-right">
            {content.title}
          </h1>

          <p className="text-base md:text-xl text-gray-300 line-clamp-3 max-w-2xl drop-shadow-lg leading-relaxed text-right">
            {content.description}
          </p>

          <div className="flex flex-col md:flex-row-reverse items-center gap-4 pt-4 w-full md:w-auto">
            <Link href={`/watch/${content.id}/${data.getSlug(content.title)}`} className="flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white w-full md:w-auto px-8 md:px-12 py-4 rounded-full font-black transition-all transform hover:scale-105 shadow-2xl shadow-primary/40 text-lg order-1 md:order-none">
                <Play className="w-5 h-5 fill-current" />
                شاهد الآن
              </Link>
            <Link href={`/details/${content.id}/${data.getSlug(content.title)}`} className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white w-full md:w-auto px-6 md:px-8 py-4 rounded-full font-bold transition-all border border-white/20 text-lg order-2 md:order-none">
                <Info className="w-5 h-5" />
                التفاصيل
              </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-32 left-6 md:left-16 flex gap-4 z-30">
        <button 
          onClick={prevSlide}
          className="p-4 rounded-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary transition-all text-white group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-4 rounded-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary transition-all text-white group"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 right-6 md:right-16 flex flex-col gap-3 z-30">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setCurrentIndex(idx);
                setIsExiting(false);
              }, 500);
            }}
            className={cn(
              "w-1.5 transition-all duration-500 rounded-full",
              idx === currentIndex ? "h-12 bg-primary" : "h-4 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
