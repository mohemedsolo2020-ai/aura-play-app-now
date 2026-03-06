import { Navbar } from "@/components/Navbar";
import { Download, CheckCircle2, Smartphone, Shield, Zap, Star, MessageSquare, Share2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const AdBanner = ({ id }: { id?: string }) => {
  return null;
};

export default function DownloadPage() {
  const screenshots = [
    "https://k.top4top.io/p_3713qm4on1.png",
    "https://l.top4top.io/p_3713824s92.png",
    "https://a.top4top.io/p_3713mgs283.png",
    "https://b.top4top.io/p_3713jrz7c4.png",
    "https://d.top4top.io/p_3713ij0i96.png",
    "https://c.top4top.io/p_3713l1pqj5.png"
  ];

  const features = [
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "جودة عالية", desc: "مشاهدة بسيرفرات متعددة وسريعة" },
    { icon: <Download className="w-6 h-6 text-primary" />, title: "تحميل مباشر", desc: "شاهد أفلامك المفضلة بدون إنترنت" },
    { icon: <Star className="w-6 h-6 text-primary" />, title: "قائمة المفضلة", desc: "احفظ أعمالك للرجوع إليها لاحقاً" },
    { icon: <Shield className="w-6 h-6 text-primary" />, title: "سجل المشاهدة", desc: "حفظ تلقائي لتقدمك في المشاهدة" },
    { icon: <MessageSquare className="w-6 h-6 text-primary" />, title: "تفاعل وتعليق", desc: "شارك آراءك مع مجتمع Aura Play" },
    { icon: <User className="w-6 h-6 text-primary" />, title: "ملف شخصي", desc: "مساحة خاصة لكل مستخدم" },
  ];

  return (
    <div className="min-h-screen bg-[#050B18] text-white" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">الإصدار v1.1.0 متاح الآن</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-tight">
                Aura Play <br /> 
                <span className="text-primary text-3xl md:text-5xl">تذكرتك لعالم الترفيه</span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                تطبيق ترفيهي متكامل يجمع لك كل ما تحب مشاهدته في مكان واحد. 
                استمتع بمكتبة ضخمة تضم الأفلام، المسلسلات، الأنمي، والرسوم المتحركة.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a 
                  href="https://www.mediafire.com/file/2nx13k71zd9gls3/AuraPlay_v1.1.0.apk/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 group"
                >
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  تحميل APK مجاناً
                </a>
                <div className="flex flex-col justify-center text-right px-4">
                  <span className="text-xs text-gray-500">حجم الملف</span>
                  <span className="text-sm font-bold">~25 MB</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-64 md:w-80 aspect-square"
            >
              <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
              <img 
                src="/logo-aura.png" 
                alt="Aura Play Logo" 
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:rotate-3 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">لماذا Aura Play؟</h2>
          <p className="text-gray-500">تجربة مشاهدة فريدة مصممة خصيصاً لك</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/50 transition-all text-right group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">لقطات من داخل التطبيق</h2>
          <p className="text-gray-500">واجهة عصرية وسهلة الاستخدام تليق بك</p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-12 no-scrollbar snap-x">
          {screenshots.map((src, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-64 md:w-72 aspect-[9/19] rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl snap-center"
            >
              <img src={src} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden bg-gradient-to-br from-primary to-purple-900 shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">جاهز لبدء تجربتك المميزة؟</h2>
          <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
            انضم إلى آلاف المستخدمين واستمتع بأفضل المحتويات العربية والعالمية بجودة مذهلة.
          </p>
          
          <a 
            href="https://www.mediafire.com/file/2nx13k71zd9gls3/AuraPlay_v1.1.0.apk/file"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all hover:scale-105"
          >
            حمل الآن مجاناً
          </a>
          
          <div className="mt-12 flex justify-center gap-8 opacity-60 grayscale brightness-200">
            <Smartphone className="w-8 h-8" />
            <Zap className="w-8 h-8" />
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Aura Play. جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
