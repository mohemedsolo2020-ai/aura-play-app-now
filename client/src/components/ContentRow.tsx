import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentItem } from "@/lib/data";
import { ContentCard } from "./ContentCard";

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  variant?: "portrait" | "landscape";
}

export function ContentRow({ title, items, variant = "portrait" }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!items.length) return null;

  return (
    <div className="py-2 space-y-2 group" dir="rtl">
      <div className="px-4 md:px-12 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white font-display group-hover:text-primary transition-colors">
          {title}
        </h2>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => scroll("left")}
            className="p-1 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-1 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-4 md:px-12 scrollbar-hide pb-4 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`flex-none snap-start ${
              variant === "portrait" ? "w-[140px] md:w-[180px]" : "w-[240px] md:w-[320px]"
            }`}
          >
            <ContentCard content={item} aspectRatio={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
