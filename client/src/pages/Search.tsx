import { useSearch, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { data } from "@/lib/data";
import { ContentCard } from "@/components/ContentCard";
import { Search as SearchIcon, Ghost } from "lucide-react";
import { useEffect } from "react";

export default function Search() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const query = params.get("q") || "";
  
  const results = query ? data.search(query) : [];

  useEffect(() => {
    document.title = query ? `نتائج البحث عن: ${query} - Aura Hub` : "البحث - Aura Hub";
  }, [query]);

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <SearchIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-display">
                {query ? `نتائج البحث عن "${query}"` : "البحث عن المحتوى"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                تم العثور على {results.length} نتيجة
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-6 bg-secondary/30 rounded-full border border-white/5">
                <Ghost className="w-16 h-16 text-gray-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">عذراً، لم نجد أي نتائج</h2>
                <p className="text-gray-400 max-w-xs mx-auto">
                  حاول البحث بكلمات أخرى أو تحقق من كتابة اسم الفيلم أو المسلسل بشكل صحيح
                </p>
              </div>
              <Link href="/" className="bg-primary text-white px-6 py-2 rounded-md font-bold mt-4 inline-block">
                  العودة للرئيسية
                </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
