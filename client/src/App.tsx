import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Details from "@/pages/Details";
import Watch from "@/pages/Watch";
import Download from "@/pages/Download";
import Category from "@/pages/Category";
import Search from "@/pages/Search";
import { useEffect } from "react";

function DeepLinkHandler() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Handle URL parameters for deep linking
    // Example: ?movie_id=123 or ?id=123
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("movie_id") || params.get("id");
    const type = params.get("type") || "details";

    if (movieId) {
      // Small delay to ensure router is ready
      const timer = setTimeout(() => {
        setLocation(`/${type}/${movieId}`);
        
        // Clean up the URL by removing search params without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [setLocation]);

  return null;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function FloatingDownloadButton() {
  return (
    <Link 
      href="/download" 
      className="fixed bottom-24 right-6 z-[100] group flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
      data-testid="link-floating-download"
    >
      <div className="relative">
        <div className="absolute -inset-2 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-300 animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 bg-[#050B18]">
          <img 
            src="/logo-aura.png" 
            alt="Aura play" 
            className="w-full h-full object-contain p-2"
          />
        </div>
      </div>
      <span className="bg-[#050B18]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white shadow-xl whitespace-nowrap group-hover:bg-primary group-hover:border-primary transition-all duration-300">
        تحميل تطبيق Aura play
      </span>
    </Link>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/download" component={Download} />
      <Route path="/details/:id/:slug?" component={Details} />
      <Route path="/watch/:id/:slug?" component={Watch} />
      <Route path="/search" component={Search} />
      <Route path="/:type" component={Category} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  useEffect(() => {
    // Logic to disable all ads
    const selectors = [
      'iframe[src*="3nbf4.com"]',
      'div[id*="3nbf4.com"]',
      'script[src*="quge5.com"]',
      'ins.adsbygoogle',
      'div[id^="container-"]',
      'iframe[id^="aswift_"]',
      '.ad-container',
      '#ad-slot',
      '[class*="ad-banner"]',
      '[id*="ad-banner"]'
    ];
    
    const removeAds = () => {
      document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
    };

    removeAds();
    // Periodically check for dynamically injected ads
    const interval = setInterval(removeAds, 2000);

    return () => clearInterval(interval);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <DeepLinkHandler />
        <ScrollToTop />
        <FloatingDownloadButton />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
