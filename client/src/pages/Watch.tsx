import { useParams, useSearch } from "wouter";
import { Navbar } from "@/components/Navbar";
import { data, type Episode } from "@/lib/data";
import { useState, useEffect } from "react";
import { ArrowLeft, Server, SkipForward, SkipBack, Play } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const AdBanner = ({ id }: { id?: string }) => {
  return null;
};

export default function Watch() {
  const { id } = useParams();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const AD_LARGE = '008f606e1bca1528ff17445d22511927';
  const AD_SMALL = 'c7917097d0832e67f3c4c69948fe971b';
  
  const seasonNum = Number(params.get("season")) || 1;
  const episodeNum = Number(params.get("ep")) || 1;

  const content = data.getById(id || "");
  
  // Smart fallback: if ID is not found, try to find content by slug or id comparison
  const matchedContent = content || data.getAll().find(item => 
    item.id === id || 
    data.getSlug(item.title) === id ||
    window.location.pathname.includes(item.id)
  );
  
  const seasonsSummary = matchedContent?.seasonsSummary || [];
  const episodes = matchedContent?.episodes || [];
  
  // Generate virtual episodes if seasonsSummary exists
  const allEpisodes: Episode[] = seasonsSummary.length > 0 
    ? seasonsSummary.flatMap(s => 
        Array.from({ length: s.episodesCount }, (_, i) => ({
          number: i + 1,
          title: `الحلقة ${i + 1}`,
          season: s.season,
          isNew: false,
          servers: []
        }))
      )
    : episodes;

  // Find current episode
  const currentEpisode = allEpisodes.find(
    ep => (ep.season || 1) === seasonNum && ep.number === episodeNum
  ) || (allEpisodes.length > 0 ? allEpisodes[0] : null);

  const [selectedServer, setSelectedServer] = useState(0);
  const [episodeThumbnails, setEpisodeThumbnails] = useState<Record<string, string>>({});
  const TMDB_API_KEY = "d98e20801ab814197a66bbed5cd9418b";

  useEffect(() => {
    if (matchedContent) {
      const epTitle = currentEpisode ? ` - الحلقة ${currentEpisode.number}` : "";
      const title = `${matchedContent.title}${epTitle} - Aura Hub`;
      document.title = title;
      
      const slug = data.getSlug(matchedContent.title);
      const url = `https://www.auraplay.site/watch/${matchedContent.id}/${slug}${currentEpisode ? `?ep=${currentEpisode.number}&season=${currentEpisode.season || 1}` : ""}`;
      const description = `شاهد ${matchedContent.title}${epTitle} مترجم اون لاين بجودة عالية. ${matchedContent.description.slice(0, 100)}...`;
      
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

      // Update basic title for "View Source" simulation
      const titleTag = document.querySelector('title');
      if (titleTag) titleTag.innerText = title;

      updateMeta("og:title", title, "property");
      updateMeta("og:description", description, "property");
      updateMeta("og:url", url, "property");
      updateMeta("og:image", matchedContent.poster, "property");
      updateMeta("twitter:title", title);
      updateMeta("twitter:description", description);
      updateMeta("twitter:image", matchedContent.poster);
    }
  }, [matchedContent, currentEpisode]);

  useEffect(() => {
    // Reset server when episode changes
    setSelectedServer(0);
  }, [id, seasonNum, episodeNum]);

  useEffect(() => {
    if (matchedContent && (matchedContent.type === "series" || matchedContent.type === "anime" || matchedContent.type === "asian_series" || matchedContent.type === "animation") && matchedContent.tmdbId) {
      const fetchEpisodeImages = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${matchedContent.tmdbId}/season/${seasonNum}?api_key=${TMDB_API_KEY}&language=ar`
          );
          const data = await response.json();
          if (data.episodes) {
            const thumbs: Record<string, string> = {};
            data.episodes.forEach((ep: any) => {
              if (ep.still_path) {
                thumbs[`${seasonNum}-${ep.episode_number}`] = `https://image.tmdb.org/t/p/w300${ep.still_path}`;
              }
            });
            setEpisodeThumbnails(prev => ({ ...prev, ...thumbs }));
          }
        } catch (error) {
          console.error("Error fetching episode images:", error);
        }
      };
      fetchEpisodeImages();
    }
  }, [matchedContent, seasonNum]);

  if (!matchedContent) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4" dir="rtl">
      <Navbar />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">عذراً، المحتوى غير موجود</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          لم نتمكن من العثور على ما تبحث عنه. قد يكون الرابط خاطئاً أو تم نقل المحتوى.
        </p>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-md font-bold inline-block shadow-lg shadow-primary/20">
            العودة للرئيسية
          </Link>
      </div>
    </div>
  );

  // Handle movies with direct servers (no episodes)
  const movieServers = data.getAvailableServers(matchedContent);
  const servers = currentEpisode ? data.getAvailableServers(matchedContent, currentEpisode) : movieServers;

  const videoUrl = data.generateVideoUrl(matchedContent, currentEpisode || undefined, selectedServer);
  const hasVideoSource = !!videoUrl;

  // Find next/prev episodes for navigation
  const sortedEpisodes = [...allEpisodes].sort((a, b) => {
    if ((a.season || 1) !== (b.season || 1)) return (a.season || 1) - (b.season || 1);
    return a.number - b.number;
  });
  
  const currentIndex = sortedEpisodes.findIndex(ep => 
    currentEpisode && (ep.season || 1) === (currentEpisode.season || 1) && ep.number === currentEpisode.number
  );
  
  const prevEp = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEp = currentIndex < sortedEpisodes.length - 1 && currentIndex !== -1 ? sortedEpisodes[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-1 pt-16 md:pt-20 px-0 md:px-12 max-w-[1600px] mx-auto w-full pb-12">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 mb-4 px-4 md:px-0 text-gray-400 text-xs md:text-sm">
          <Link href={`/details/${matchedContent.id}/${data.getSlug(matchedContent.title)}`} className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
              رجوع
            </Link>
          <span>/</span>
          <span className="text-white truncate max-w-[100px] md:max-w-none">{matchedContent.title}</span>
          {currentEpisode && (
            <>
              <span>/</span>
              <span className="text-primary whitespace-nowrap">الحلقة {currentEpisode.number}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Main Player Area */}
          <div className={cn("space-y-4", allEpisodes.length > 0 ? "lg:col-span-3" : "lg:col-span-4")}>
            <div className="aspect-video w-full bg-black md:rounded-xl overflow-hidden shadow-2xl md:border border-white/5 relative group">
              {hasVideoSource ? (
                <iframe
                  key={videoUrl}
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  لا يوجد مصدر متاح
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
              <div className="text-right">
                <h1 className="text-xl md:text-2xl font-bold text-white font-display mb-1">
                  {matchedContent.title}
                </h1>
                {currentEpisode && (
                  <p className="text-sm text-gray-400">
                    الموسم {currentEpisode.season || 1} • الحلقة {currentEpisode.number}: <span className="text-gray-300">{currentEpisode.title}</span>
                  </p>
                )}
              </div>

              {allEpisodes.length > 0 && (
                <div className="flex items-center gap-2 md:gap-3">
                  {prevEp ? (
                    <Link href={`/watch/${matchedContent.id}/${data.getSlug(matchedContent.title)}?ep=${prevEp.number}&season=${prevEp.season || 1}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-white/10 text-white rounded-md transition-colors text-sm">
                        السابق
                        <SkipForward className="w-4 h-4 rotate-180" />
                      </Link>
                  ) : (
                    <button disabled className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary/50 text-gray-500 rounded-md cursor-not-allowed text-sm">
                      السابق
                      <SkipForward className="w-4 h-4 rotate-180" />
                    </button>
                  )}

                  {nextEp ? (
                    <Link href={`/watch/${matchedContent.id}/${data.getSlug(matchedContent.title)}?ep=${nextEp.number}&season=${nextEp.season || 1}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors shadow-lg shadow-primary/20 text-sm">
                        <SkipBack className="w-4 h-4 rotate-180" />
                        التالي
                      </Link>
                  ) : (
                    <button disabled className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary/50 text-gray-500 rounded-md cursor-not-allowed text-sm">
                      <SkipBack className="w-4 h-4 rotate-180" />
                      التالي
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Server Selection */}
            <div className="mx-4 md:mx-0 bg-secondary/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider justify-start">
                <Server className="w-4 h-4" />
                اختر السيرفر
              </div>
              <div className="flex flex-wrap gap-2 justify-start">
                {servers?.map((server: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedServer(idx)}
                    className={cn(
                      "px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm font-medium transition-all",
                      selectedServer === idx 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "bg-secondary hover:bg-white/10 text-gray-300"
                    )}
                  >
                    {server.name || `سيرفر ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Playlist */}
          {allEpisodes.length > 0 && (
            <div className="lg:col-span-1 flex flex-col h-full lg:max-h-[calc(100vh-100px)] px-4 md:px-0">
              <h3 className="font-bold text-white mb-4 px-2 text-right">الحلقات القادمة</h3>
              <div className="flex-1 overflow-y-auto pl-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {sortedEpisodes
                  .filter(ep => (ep.season || 1) === seasonNum)
                  .map((ep) => {
                    const isActive = currentEpisode && (ep.season || 1) === (currentEpisode.season || 1) && ep.number === currentEpisode.number;
                    const slug = data.getSlug(matchedContent.title);
                    return (
                    <Link key={`${ep.season}-${ep.number}`} href={`/watch/${matchedContent.id}/${slug}?ep=${ep.number}&season=${ep.season || 1}`} className={cn(
                        "flex gap-3 p-3 rounded-lg transition-all border border-transparent flex-row-reverse text-right",
                        isActive 
                          ? "bg-primary/10 border-primary/20" 
                          : "hover:bg-white/5 hover:border-white/5"
                      )}>
                        <div className="relative w-24 aspect-video bg-black/50 rounded overflow-hidden flex-shrink-0">
                          {/* Episode thumbnail from TMDB or fallback */}
                          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                             <Play className={cn("w-6 h-6", isActive ? "text-primary" : "text-gray-600")} />
                          </div>
                          {episodeThumbnails[`${ep.season || 1}-${ep.number}`] ? (
                            <img 
                              src={episodeThumbnails[`${ep.season || 1}-${ep.number}`]} 
                              className="absolute inset-0 w-full h-full object-cover" 
                              alt={`Episode ${ep.number}`}
                            />
                          ) : (
                            matchedContent.backdrop && <img src={matchedContent.backdrop} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          )}
                          <div className="absolute bottom-1 left-1 bg-black/80 px-1 rounded text-[10px] text-white">
                            الحلقة {ep.number}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className={cn("text-sm font-medium truncate", isActive ? "text-primary" : "text-gray-200")}>
                            {ep.title || `الحلقة ${ep.number}`}
                          </h4>
                          <span className="text-xs text-gray-500">الموسم {ep.season || 1}</span>
                        </div>
                      </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
