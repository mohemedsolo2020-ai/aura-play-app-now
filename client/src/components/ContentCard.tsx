import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import { data, ContentItem } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: ContentItem;
  aspectRatio?: "portrait" | "landscape";
}

export function ContentCard({ content, aspectRatio = "portrait" }: ContentCardProps) {
  const slug = data.getSlug(content.title);
  return (
    <Link href={`/details/${content.id}/${slug}`} className="group block w-full h-full cursor-pointer" data-testid={`link-content-${content.id}`}>
        <div
          className={cn(
            "relative overflow-hidden rounded-md transition-all duration-300 border border-white/5 bg-secondary",
            "hover:scale-105 hover:shadow-xl hover:shadow-primary/10",
            aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-video"
          )}
        >
          <img
            src={aspectRatio === "portrait" ? content.poster : (content.backdrop || content.poster)}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 shadow-lg shadow-primary/50">
              <Play className="w-5 h-5 text-white fill-current ml-1" />
            </div>
          </div>

          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-xs font-bold text-yellow-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Star className="w-3 h-3 fill-current" />
            {content.rating}
          </div>
        </div>
        
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{content.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>{content.type === "movie" ? "فيلم" : content.type === "series" ? "مسلسل" : content.type === "anime" ? "أنمي" : content.type === "animation" ? "كرتون" : content.type === "asian_series" ? "آسيوي" : content.type}</span>
          </div>
        </div>
      </Link>
  );
}
