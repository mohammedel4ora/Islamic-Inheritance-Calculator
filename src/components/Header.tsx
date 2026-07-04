import { Scale } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative bg-brand-green text-white overflow-hidden shadow-lg h-24 flex items-center">
      {/* Visual background patterns resembling Islamic geometry / dots */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }}
      ></div>
      
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Rotating golden diamond with scale icon inside */}
          <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center rotate-45 shadow-lg border border-brand-gold-dark/40">
            <div className="-rotate-45 text-brand-green">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-brand-beige flex items-center gap-2">
              الإرث الميسّر
              <span className="bg-brand-gold/20 text-brand-gold text-[10px] md:text-xs font-sans px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                الإصدار 4.0
              </span>
            </h1>
            <p className="font-sans text-[11px] md:text-xs text-brand-beige/70 mt-0.5">
              برنامج حساب المواريث والتركات والوصايا وفق الشريعة الإسلامية
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-brand-beige/90 text-xs font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
          <span>حساب فوري دقيق 100%</span>
        </div>
      </div>
      
      {/* Golden decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold"></div>
    </header>
  );
}
