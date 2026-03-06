import { useParams, Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { data, Episode } from "@/lib/data";
import { Play, Calendar, Star, Clock, Info } from "lucide-react";
import { ContentRow } from "@/components/ContentRow";
import { useState, useEffect, useRef } from "react";

const AdBanner = ({ id }: { id?: string }) => {
  return null;
};

export default function Details() {
  const { id } = useParams();
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const isShared = params.get("shared") === "true";

  const episodesSectionRef = useRef<HTMLDivElement>(null);
  const AD_LARGE = '008f606e1bca1528ff17445d22511927';
  const AD_SMALL = 'c7917097d0832e67f3c4c69948fe971b';
  const content = data.getById(id || "");
  const related = content ? data.getByType(content.type).slice(0, 10) : [];
  const [selectedSeason, setSelectedSeason] = useState(1);

  const scrollToEpisodes = (e: React.MouseEvent) => {
    if (content && content.type !== "movie") {
      e.preventDefault();
      episodesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (content) {
      const title = `${content.title} - Aura Hub`;
      document.title = title;
      
      const slug = data.getSlug(content.title);
      const url = `https://www.auraplay.site/details/${content.id}/${slug}`;
      const description = content.description.slice(0, 160);

      // SEO Meta Tags update helper
      const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      updateMeta("description", description);
      updateMeta("robots", "index, follow, max-image-preview:large");
      
      // Update basic title and description for "View Source" simulation
      const titleTag = document.querySelector('title');
      if (titleTag) titleTag.innerText = title;

      // OpenGraph
      updateMeta("og:title", title, "property");
      updateMeta("og:description", description, "property");
      updateMeta("og:url", window.location.href, "property");
      updateMeta("og:type", "video.movie", "property");
      updateMeta("og:image", content.poster, "property");
      updateMeta("og:image:secure_url", content.poster, "property");
      updateMeta("og:image:width", "600", "property");
      updateMeta("og:image:height", "900", "property");
      updateMeta("og:site_name", "Aura play", "property");
      updateMeta("og:locale", "ar_AR", "property");

      // Twitter
      updateMeta("twitter:card", "summary_large_image");
      updateMeta("twitter:site", "@replit");
      updateMeta("twitter:title", title);
      updateMeta("twitter:description", description);
      updateMeta("twitter:image", content.poster);

      // Structured Data (JSON-LD)
      const schemaId = 'schema-details-json';
      let script = document.getElementById(schemaId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Movie",
        "name": content.title,
        "description": content.description,
        "image": content.poster,
        "datePublished": content.year,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": content.rating,
          "bestRating": "10",
          "worstRating": "1",
          "ratingCount": "100"
        }
      };
      script.text = JSON.stringify(schemaData);
    }
  }, [content]);

  if (!content) return <div className="text-white text-center pt-40">المحتوى غير موجود</div>;

  // Group episodes by season using seasonsSummary if available
  const seasonsSummary = content.seasonsSummary || [];
  const episodes = content.episodes || [];
  
  let seasons: number[] = [];
  let currentEpisodes: Episode[] = [];

  if (seasonsSummary.length > 0) {
    seasons = seasonsSummary.map(s => s.season).sort((a, b) => a - b);
    const summary = seasonsSummary.find(s => s.season === selectedSeason);
    if (summary) {
      currentEpisodes = Array.from({ length: summary.episodesCount }, (_, i) => ({
        number: i + 1,
        title: `الحلقة ${i + 1}`,
        season: selectedSeason,
        isNew: false,
        servers: []
      }));
    }
  } else {
    const episodesBySeason = episodes.reduce((acc, ep) => {
      const season = ep.season || 1;
      if (!acc[season]) acc[season] = [];
      acc[season].push(ep);
      return acc;
    }, {} as Record<number, Episode[]>);

    seasons = Object.keys(episodesBySeason).map(Number).sort((a, b) => a - b);
    currentEpisodes = episodesBySeason[selectedSeason] || [];
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navbar removed as requested */}

      {/* Hero Section */}
      <div className={`relative ${isShared ? 'h-[40vh] md:h-[50vh]' : 'h-[60vh] md:h-[70vh]'}`}>
        <div className="absolute inset-0">
          <img
            src={content.backdrop || content.poster}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        </div>

        <div className="absolute inset-0 flex items-end px-4 md:px-12 pb-8 md:pb-12">
          <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-right">
            {/* Poster - hidden on mobile, visible on desktop */}
            <img 
              src={content.poster} 
              alt={content.title}
              className="hidden md:block w-48 rounded-lg shadow-2xl border border-white/10"
            />
            
            <div className="flex-1 space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white font-display">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
                <span className="bg-primary px-2 py-0.5 rounded text-white text-[10px] md:text-xs font-bold uppercase">
                  {content.type === "movie" ? "فيلم" : content.type === "series" ? "مسلسل" : content.type === "anime" ? "أنمي" : content.type === "animation" ? "كرتون" : content.type === "asian_series" ? "آسيوي" : "محتوى"}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-white">{content.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{content.year}</span>
                </div>
                <span className="hidden sm:inline">{content.category}</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <button 
                    onClick={(e) => {
                      if (isShared) {
                        e.preventDefault();
                        const appPackage = "com.ani.xo";
                        const intentUrl = `intent://watch/${content.id}#Intent;scheme=auraplay;package=${appPackage};S.browser_fallback_url=${encodeURIComponent(window.location.origin + "/download")};end`;
                        window.location.href = intentUrl;
                      } else {
                        scrollToEpisodes(e as any);
                      }
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-md font-bold transition-all shadow-lg shadow-primary/25 text-sm md:text-base"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    شاهد الآن
                  </button>
                {content.trailerUrl && (
                  <a 
                    href={content.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-md font-bold transition-all border border-white/10 text-sm md:text-base"
                  >
                    العرض الدعائي
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Description & Episodes */}
        <div className="lg:col-span-2 space-y-8">
          {!isShared && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                القصة
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {content.description}
              </p>
            </section>
          )}

          <AdBanner id={AD_LARGE} />

          {(episodes.length > 0 || seasons.length > 0) && (
            <section ref={episodesSectionRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">الحلقات</h2>
                {seasons.length > 1 && (
                  <select 
                    className="bg-secondary text-white border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-primary"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  >
                    {seasons.map(s => (
                      <option key={s} value={s}>الموسم {s}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="grid gap-3">
                {currentEpisodes.length > 0 ? (
                  currentEpisodes.map((ep) => {
                    const slug = data.getSlug(content.title);
                    return (
                      <button 
                        key={ep.number} 
                        onClick={() => {
                          if (isShared) {
                            const appPackage = "com.ani.xo";
                            const intentUrl = `intent://watch/${content.id}?ep=${ep.number}&season=${selectedSeason}#Intent;scheme=auraplay;package=${appPackage};S.browser_fallback_url=${encodeURIComponent(window.location.origin + "/download")};end`;
                            window.location.href = intentUrl;
                          } else {
                            window.location.href = `/watch/${content.id}/${slug}?ep=${ep.number}&season=${selectedSeason}`;
                          }
                        }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-white/5 hover:border-primary/50 transition-all group w-full text-right"
                      >
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-gray-400">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium group-hover:text-primary transition-colors">
                              {ep.title || `الحلقة ${ep.number}`}
                            </h4>
                            <p className="text-xs text-gray-500">الموسم {ep.season} • الحلقة {ep.number}</p>
                          </div>
                          {ep.isNew && (
                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase">جديد</span>
                          )}
                        </button>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-center py-4 bg-secondary/20 rounded-lg border border-dashed border-white/5">
                    لا توجد حلقات متاحة حالياً
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Removed as requested */}
      </div>
    </div>
  );
}
