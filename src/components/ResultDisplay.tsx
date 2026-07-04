import React, { useState } from 'react';
import { Scale, Printer, AlertCircle, BookOpen, Share2, Copy, Check, Send, Mail } from 'lucide-react';
import { CalculationResult } from '../types';

interface ResultDisplayProps {
  result: CalculationResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { heirs, netEstate, originalBase, finalBase, hasAwl, hasRadd } = result;

  // Filter heirs that actually inherit
  const inheritingHeirs = heirs.filter((h) => h.status !== 'blocked' && h.status !== 'none' && h.shareDecimal > 0);
  const blockedHeirs = heirs.filter((h) => h.status === 'blocked');

  const generateShareText = () => {
    let text = `⚖️ *تقرير توزيع التركة الشرعية - تطبيق الإرث الميسّر* ⚖️\n\n`;
    text += `💵 *التركة الإجمالية:* ${result.totalEstate.toLocaleString()} ريال\n`;
    text += `🛡️ *التركة الصافية:* ${netEstate.toLocaleString()} ريال\n`;
    text += `🌀 *أصل المسألة:* ${finalBase} سهام\n\n`;
    
    text += `📊 *تقسيم الورثة:* \n`;
    inheritingHeirs.forEach((h) => {
      text += `• *${h.name}*: ${h.shareFractionText} (نسبة: ${Math.round(h.shareDecimal * 1000) / 10}%) | الحصة: ${h.shareValue.toLocaleString()} ريال\n`;
    });
    
    if (blockedHeirs.length > 0) {
      text += `\n⛔ *الورثة المحجوبون:* \n`;
      blockedHeirs.forEach((h) => {
        text += `• *${h.name}* (محجوب حجب حرمان)\n`;
      });
    }
    
    text += `\n🔗 *احسب تركتك بدقة الآن عبر تطبيقنا:* ${window.location.origin}`;
    return text;
  };

  const handleCopyText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Math for SVG Donut Chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82
  let cumulativePercent = 0;

  // Geometric theme colors for segments
  const colors = [
    '#D4AF37', // brand gold
    '#064E3B', // brand green
    '#2E7D65', // forest green medium
    '#B5942D', // gold darker
    '#4D8872', // soft green
    '#DDBB4E', // gold lighter
    '#1B2A24', // deep dark
    '#70A691', // soft sage
    '#94C4B1', // light green-beige
    '#8C7123', // olive-gold
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="print-area">
      {/* Printable Title Block (only visible in print) */}
      <div className="hidden print:block text-center space-y-2 border-b-2 border-brand-green pb-4 mb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-green">تقرير تقسيم التركة الشرعية</h1>
        <p className="text-brand-dark/70 text-sm">صادر عن تطبيق "الإرث الميسّر" لحساب المواريث</p>
        <div className="flex justify-center gap-6 text-xs text-brand-dark/50 mt-4">
          <span>تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</span>
          <span>التركة الإجمالية: {result.totalEstate.toLocaleString()} ريال</span>
          <span>التركة الصافية: {result.netEstate.toLocaleString()} ريال</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Net Estate */}
        <div className="bg-brand-green text-white rounded-2xl shadow-md p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold"></div>
          <p className="text-xs text-brand-beige/80 font-bold uppercase tracking-wider mb-1">التركة الصافية الموزعة</p>
          <p className="font-mono text-2xl font-bold text-brand-gold">{netEstate.toLocaleString()} ريال</p>
          <p className="text-[10px] text-brand-beige/60 mt-2 font-sans">
            بعد استقطاع { (result.totalEstate - netEstate).toLocaleString() } ريال ديون/وصايا
          </p>
        </div>

        {/* Card 2: Base of Matter */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold"></div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">أصل المسألة (السهام)</p>
          <p className="font-mono text-2xl font-bold text-brand-green">
            {finalBase}
            {hasAwl && <span className="text-xs font-normal text-rose-600 mr-2">(بالعول)</span>}
            {hasRadd && <span className="text-xs font-normal text-brand-green mr-2">(بالرد)</span>}
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            الأصل قبل العول/الرد: <strong className="font-mono">{originalBase}</strong>
          </p>
        </div>

        {/* Card 3: Distribution State */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green"></div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">نوع المسألة الحسابية</p>
          <p className="font-sans text-sm font-bold text-brand-dark">
            {hasAwl ? 'مسألة عائلة (زيادة السهام)' : hasRadd ? 'مسألة مردودة (نقص السهام)' : 'مسألة عادلة (مستوية)'}
          </p>
          <div className="text-[10px] mt-1.5 leading-normal">
            {hasAwl && (
              <span className="text-rose-600 font-medium">تزاحمت الفروض فزادت السهام عن الأصل، فنقصت الأنصبة نسبياً.</span>
            )}
            {hasRadd && (
              <span className="text-brand-green font-medium">بقيت زيادة في التركة بعد الفروض، فرُدَّت على الورثة عدا الزوجين.</span>
            )}
            {!hasAwl && !hasRadd && (
              <span className="text-gray-400">توزعت التركة بالكامل على الفروض والعصبات بالتساوي مع الأصل المعتمد.</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Chart & Heirs List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Donut Chart Block */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-border shadow-xs p-5 flex flex-col items-center">
          <h3 className="font-serif text-sm font-bold text-brand-dark mb-4 text-center">المخطط الدائري لتوزيع التركة</h3>
          
          {inheritingHeirs.length > 0 ? (
            <div className="w-full flex flex-col items-center justify-center gap-6">
              {/* Animated SVG Donut */}
              <div className="relative w-48 h-48 md:w-52 md:h-52">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {inheritingHeirs.map((heir, idx) => {
                    const percentage = heir.shareDecimal;
                    const strokeLength = percentage * circumference;
                    const strokeOffset = circumference - (cumulativePercent * circumference);
                    cumulativePercent += percentage;

                    const color = colors[idx % colors.length];
                    const isHovered = hoveredSlice === idx;

                    return (
                      <circle
                        key={heir.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={isHovered ? 16 : 12}
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSlice(idx)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    );
                  })}
                  {/* Center circle */}
                  <circle cx="80" cy="80" r="54" fill="#ffffff" />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                  {hoveredSlice !== null ? (
                    <>
                      <span className="text-xs text-brand-dark font-bold truncate max-w-[120px]">{inheritingHeirs[hoveredSlice].name}</span>
                      <span className="font-mono text-base font-bold text-brand-green mt-0.5">
                        {Math.round(inheritingHeirs[hoveredSlice].shareDecimal * 1000) / 10}%
                      </span>
                      <span className="text-[10px] text-brand-gold font-bold mt-0.5">
                        {inheritingHeirs[hoveredSlice].seham} سهام
                      </span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-6 h-6 text-brand-green mb-1" />
                      <span className="text-[10px] font-bold text-brand-dark/70">توزع الأنصبة</span>
                      <span className="text-[9px] text-gray-400 font-normal">مرر للحصول على التفاصيل</span>
                    </>
                  )}
                </div>
              </div>

              {/* Legends */}
              <div className="w-full grid grid-cols-2 gap-2 text-[11px]">
                {inheritingHeirs.map((heir, idx) => {
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={heir.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors duration-200 ${
                        hoveredSlice === idx ? 'bg-brand-light-beige' : ''
                      }`}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                      <span className="text-brand-dark font-semibold truncate">{heir.name}</span>
                      <span className="font-mono text-gray-400 mr-auto text-[9px]">
                        ({Math.round(heir.shareDecimal * 1000) / 10}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm">لا يوجد ورثة مستحقون للإرث</p>
            </div>
          )}
        </div>

        {/* Detailed Heirs List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-border shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-light-beige pb-3 gap-y-2.5">
            <h3 className="font-serif text-sm md:text-base font-bold text-brand-dark border-r-4 border-brand-green pr-3">جدول توزيع الحصص والأنصبة</h3>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-3.5 py-1.5 bg-brand-light-green/60 text-brand-green font-bold hover:bg-brand-light-green/90 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة النتائج</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-brand-gold text-brand-green font-bold hover:bg-brand-gold-dark rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التقرير (PDF)</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {inheritingHeirs.map((heir) => (
              <div
                key={heir.id}
                className="p-4 bg-brand-light-beige/30 hover:bg-brand-light-beige/50 border border-brand-border/40 rounded-xl transition-all duration-200 space-y-3 border-r-4 border-r-brand-green"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full border border-brand-green/20">
                      {heir.status === 'fard' ? 'إرث بالفرض' : 'إرث بالتعصيب'}
                    </span>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-brand-dark mt-1.5">
                      {heir.name} {heir.count > 1 && <span className="text-[10px] text-gray-400 font-normal">({heir.count} أفراد)</span>}
                    </h4>
                  </div>
                  <div className="text-left font-mono">
                    <p className="text-xs md:text-sm font-bold text-brand-green">{heir.shareValue.toLocaleString()} ريال</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">النصيب الإجمالي للجهة</p>
                  </div>
                </div>

                {/* Sub details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-brand-dark/70 pt-1 border-t border-brand-border/30">
                  <div>
                    <span className="text-gray-400 block mb-0.5">نسبة الإرث:</span>
                    <span className="font-mono font-bold text-brand-dark">
                      {Math.round(heir.shareDecimal * 1000) / 10}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">الفرض الشرعي:</span>
                    <span className="font-sans font-bold text-brand-green bg-brand-light-green px-1.5 py-0.5 rounded">
                      {heir.shareFractionText}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">عدد السهام:</span>
                    <span className="font-mono font-bold text-brand-dark">
                      {heir.seham} من {finalBase}
                    </span>
                  </div>
                  {heir.count > 1 && (
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-gray-400 block mb-0.5">نصيب الفرد الواحد:</span>
                      <span className="font-mono font-bold text-brand-gold">
                        {heir.individualShareValue.toLocaleString()} ريال
                      </span>
                    </div>
                  )}
                </div>

                {/* Reason / Proof */}
                {heir.reason && (
                  <div className="text-[10px] text-brand-dark/60 bg-white/75 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed border border-brand-border/30">
                    <BookOpen className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                    <span><strong>التعليل الشرعي:</strong> {heir.reason}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Blocked Heirs */}
            {blockedHeirs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-brand-border/50">
                <h4 className="font-serif text-xs md:text-sm font-bold text-brand-dark mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>أقارب محجوبون حجب حرمان</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {blockedHeirs.map((heir) => (
                    <div key={heir.id} className="p-3 bg-rose-50/20 border border-rose-100/30 rounded-xl space-y-1">
                      <p className="font-sans text-xs font-bold text-brand-dark">{heir.name}</p>
                      <p className="text-[10px] text-rose-700 leading-normal">
                        • {heir.reason || `محجوب حجب حرمان لوجود وارث أقرب: (${heir.blockedBy?.join('، ')})`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Results Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 print:hidden animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-border shadow-xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-l from-brand-green to-brand-gold p-4 text-white flex justify-between items-center">
              <h3 className="font-serif text-sm md:text-base font-bold flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>مشاركة تقرير التركة الشرعي</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white/80 hover:text-white font-bold text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 md:p-6 space-y-6">
              <p className="text-xs text-brand-dark/70 leading-relaxed text-right">
                شارك نتائج حساب الإرث المقسم بدقة متناهية مع بقية أفراد العائلة أو المحامي عبر قنوات التواصل المفضلة لديك:
              </p>

              {/* Share Channels */}
              <div className="grid grid-cols-2 gap-3">
                {/* Copy Button */}
                <button
                  onClick={handleCopyText}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 gap-2 cursor-pointer ${
                    copySuccess
                      ? 'bg-brand-light-green/40 border-brand-green text-brand-green'
                      : 'bg-brand-light-beige/30 border-brand-border hover:bg-brand-light-beige/60 text-brand-dark/80'
                  }`}
                >
                  {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 text-brand-green" />}
                  <span className="text-xs font-bold">{copySuccess ? 'تم النسخ!' : 'نسخ التقرير'}</span>
                </button>

                {/* WhatsApp Button */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-brand-border bg-brand-light-beige/30 hover:bg-brand-light-beige/60 text-brand-dark/80 transition-all duration-200 gap-2"
                >
                  <Send className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold">واتساب (WhatsApp)</span>
                </a>

                {/* Telegram Button */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(generateShareText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-brand-border bg-brand-light-beige/30 hover:bg-brand-light-beige/60 text-brand-dark/80 transition-all duration-200 gap-2"
                >
                  <Send className="w-5 h-5 text-sky-500" />
                  <span className="text-xs font-bold">تيليجرام (Telegram)</span>
                </a>

                {/* Email Button */}
                <a
                  href={`mailto:?subject=${encodeURIComponent('تقرير تقسيم تركة شرعية')}&body=${encodeURIComponent(generateShareText())}`}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-brand-border bg-brand-light-beige/30 hover:bg-brand-light-beige/60 text-brand-dark/80 transition-all duration-200 gap-2"
                >
                  <Mail className="w-5 h-5 text-brand-green" />
                  <span className="text-xs font-bold">بريد إلكتروني</span>
                </a>
              </div>

              {/* Text Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-brand-dark/50 font-bold block">معاينة النص المُرسَل:</span>
                <div className="bg-brand-light-beige/25 border border-brand-border/40 p-3 rounded-lg max-h-36 overflow-y-auto text-[10px] font-mono text-brand-dark/80 leading-normal text-right whitespace-pre-wrap">
                  {generateShareText()}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
