import { Link, useLocation } from "wouter";
import { Search, Bell, User, Menu, X, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { data } from "@/lib/data";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [location, setLocation] = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = data.search(searchQuery);
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "تحميل التطبيق", href: "/download" },
    { name: "المسلسلات", href: "/series" },
    { name: "الأفلام", href: "/movies" },
    { name: "الكرتون", href: "/animation" },
    { name: "الآسيوي", href: "/asian" },
    { name: "الأنمي", href: "/anime" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      const query = searchQuery.trim();
      setSearchQuery("");
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-12 py-3",
        isScrolled || isSearchOpen ? "bg-[#050B18]/95 backdrop-blur-md shadow-lg" : "bg-transparent bg-gradient-to-b from-[#050B18]/80 to-transparent"
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-4">
        {!isSearchOpen ? (
          <>
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 overflow-hidden transition-all">
                  <img src="/logo-aura.png" alt="Aura play Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 hidden sm:block">Aura play</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex items-center gap-6 ml-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location === link.href ? "text-primary" : "text-gray-300"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                data-testid="button-open-search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white">
                  <Bell className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full text-gray-300"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن أفلام، مسلسلات، أنمي..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-4 left-0 right-0 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                  {searchResults.map((item) => (
                    <Link 
                      key={item.id} 
                      href={`/details/${item.id}/${data.getSlug(item.title)}`}
                      className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <img 
                        src={item.poster} 
                        alt={item.title} 
                        className="w-12 h-16 object-cover rounded shadow-md"
                      />
                      <div className="flex-1 text-right">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{item.year} • {item.rating}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && !isSearchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-base font-medium p-2 rounded hover:bg-white/5 text-right",
                location === link.href ? "text-primary bg-white/5" : "text-gray-300"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
