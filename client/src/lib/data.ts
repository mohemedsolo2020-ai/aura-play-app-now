import { useState, useEffect } from "react";

export interface Episode {
  number: number;
  title: string;
  season: number;
  isNew: boolean;
  servers: { name: string; url: string }[];
}

export const generateVideoUrl = (content: ContentItem, episode?: Episode, serverIndex: number = 0): string => {
  const tmdbId = content.tmdbId;
  const s = episode?.season || 1;
  const e = episode?.number || 1;

  const defaultServers = [
    { name: "VidSrc", url: content.type === "movie" ? `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}&ds_lang=ar` : `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}&ds_lang=ar` },
    { name: "VidFast", url: content.type === "movie" ? `https://vidfast.to/embed/movie/${tmdbId}` : `https://vidfast.to/embed/tv/${tmdbId}/${s}/${e}` },
  ];

  // Check manual servers first
  const manualServers = episode?.servers || content.servers || [];
  if (manualServers.length > 0) {
    if (serverIndex < manualServers.length) {
      return manualServers[serverIndex].url;
    }
  }

  // Use default servers
  const targetServer = defaultServers[serverIndex] || defaultServers[0];
  return targetServer.url;
};

export const getAvailableServers = (content: ContentItem, episode?: Episode) => {
  const manualServers = episode?.servers || content.servers || [];
  if (manualServers.length > 0) return manualServers;

  return [
    { name: "VidSrc", id: "vidsrc-new" },
    { name: "VidFast", id: "vidfast" }
  ];
};

export interface SeasonSummary {
  season: number;
  episodesCount: number;
}

export interface ContentItem {
  id: string;
  tmdbId: number;
  title: string;
  poster: string;
  backdrop: string;
  description: string;
  year: string;
  rating: string;
  category: string;
  type: "anime" | "movie" | "series" | "asian_series" | "animation";
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isTrending?: boolean;
  trailerUrl: string | null;
  seasonsSummary?: SeasonSummary[];
  episodes: Episode[] | null;
  servers: { name: string; url: string }[] | null;
  createdAt?: string;
  ageRating?: string;
  network?: string;
}

const normalizeData = (data: any[], type: ContentItem["type"]): ContentItem[] => {
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    const rawId = String(item.id);
    const cleanId = rawId.replace("tmdb-anime-", "").replace("tmdb-series-", "").replace("tmdb-movie-", "");
    return {
      id: cleanId,
      tmdbId: Number(item.tmdbId || cleanId.replace(/[^\d]/g, "")),
      title: item.title,
      poster: item.poster,
      backdrop: item.backdrop,
      description: item.descriptionAr || item.description || "",
      year: String(item.year),
      rating: String(item.rating),
      category: item.category || item.genre || "",
      type: type,
      isNew: !!item.isNew,
      isPopular: !!item.isPopular,
      isFeatured: !!item.isFeatured,
      isTrending: !!item.isTrending,
      trailerUrl: item.trailerUrl || null,
      seasonsSummary: item.seasonsSummary || null,
      episodes: item.episodes || null,
      servers: item.servers || null,
      createdAt: item.createdAt,
      ageRating: item.ageRating,
      network: item.network
    };
  });
};

import animeData from "../data/anime.json";
import moviesData from "../data/movies.json";
import animationData from "../data/animation.json";
import asianData from "../data/asian.json";

const LOCAL_DATA = {
  anime: animeData,
  movie: moviesData,
  series: [], // series.json is missing, using empty array as fallback
  animation: animationData,
  asian_series: asianData
};

let CACHED_ALL_CONTENT: ContentItem[] = [];

// Initialize CACHED_ALL_CONTENT with local data immediately
Object.entries(LOCAL_DATA).forEach(([type, items]) => {
  CACHED_ALL_CONTENT = [...CACHED_ALL_CONTENT, ...normalizeData(items, type as ContentItem["type"])];
});

const DATA_URLS = {
  anime: "https://raw.githubusercontent.com/aura-app-cloud/aura-app-link/refs/heads/main/anime.json",
  movie: "https://raw.githubusercontent.com/aura-app-cloud/aura-app-link/refs/heads/main/movies.json",
  series: "https://raw.githubusercontent.com/aura-app-cloud/aura-app-link/refs/heads/main/series.json",
  animation: "https://raw.githubusercontent.com/aura-app-cloud/aura-app-link/refs/heads/main/animation.json",
  asian_series: "https://raw.githubusercontent.com/aura-app-cloud/aura-app-link/refs/heads/main/asian.json"
};

const fetchAllData = async (): Promise<ContentItem[]> => {
  try {
    const results = await Promise.all(
      Object.entries(DATA_URLS).map(async ([type, url]) => {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed to fetch ${type}`);
        const json = await resp.json();
        return normalizeData(json, type as ContentItem["type"]);
      })
    );
    CACHED_ALL_CONTENT = results.flat();
    return CACHED_ALL_CONTENT;
  } catch (error) {
    console.error("Error fetching data, using local fallback:", error);
    return CACHED_ALL_CONTENT; // Return what we have from local
  }
};

// Initial fetch
fetchAllData();

export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>(CACHED_ALL_CONTENT);
  const [loading, setLoading] = useState(CACHED_ALL_CONTENT.length === 0);

  useEffect(() => {
    if (CACHED_ALL_CONTENT.length === 0) {
      fetchAllData().then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, []);

  return { content, loading };
};

export const data = {
  getAll: () => CACHED_ALL_CONTENT,
  getByType: (type: string) => {
    const typeMap: Record<string, string> = {
      movies: "movie",
      series: "series",
      anime: "anime",
      animation: "animation",
      asian: "asian_series"
    };
    const targetType = typeMap[type] || type;
    return CACHED_ALL_CONTENT.filter(item => item.type === targetType);
  },
  getFeatured: () => CACHED_ALL_CONTENT.filter(item => item.isFeatured).slice(0, 10),
  getTrending: () => CACHED_ALL_CONTENT.filter(item => item.isPopular).slice(0, 20),
  getNewReleases: () => CACHED_ALL_CONTENT.filter(item => item.isNew).slice(0, 20),
  getById: (id: string) => CACHED_ALL_CONTENT.find(item => item.id === id),
  search: (query: string) => {
    const lower = query.toLowerCase();
    return CACHED_ALL_CONTENT.filter(item => item.title.toLowerCase().includes(lower));
  },
  getSlug: (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  },
  generateVideoUrl,
  getAvailableServers
};
