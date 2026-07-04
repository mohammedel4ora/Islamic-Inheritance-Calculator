import React from 'react';
import { Sparkles, HelpCircle, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { HeirInput, CalculationResult } from '../types';

interface SmartAdvisorProps {
  heirsInput: HeirInput;
  result: CalculationResult;
}

export default function SmartAdvisor({ heirsInput, result }: SmartAdvisorProps) {
  const { heirs, hasAwl, hasRadd, originalBase, finalBase, netEstate } = result;

  // Gather active messages
  const tips: { type: 'info' | 'warning' | 'success'; title: string; text: string; icon: string }[] = [];

  // 1. Awl & Radd warnings
  if (hasAwl) {
    tips.push({
      type: 'warning',
      title: 'حدثت ظاهرة العول الشرعي في المسألة',
      text: `تزاحمت الفروض فزادت السهام الإجمالية (${originalBase}) عن أصل المسألة المعتاد (24). تم عول أصل المسألة إلى (${finalBase}) لتقليل حصص الجميع نسبياً بالعدل وصيانةً للحقوق.`,
      icon: '🌀'
    });
  }

  if (hasRadd) {
    tips.push({
      type: 'success',
      title: 'تم تطبيق قاعدة الرد الشرعية',
      text: `لم تستغرق الفروض كل التركة، ولا يوجد عاصب يأخذ الباقي. تمت إعادة الحصص الزائدة لجميع أصحاب الفروض نسبياً (باستثناء الزوجية) لضمان عدم ضياع أي جزء من التركة.`,
      icon: '⚖️'
    });
  }

  // 2. Specific heir combinations
  if (heirsInput.grandfather && (heirsInput.fullBrothersCount > 0 || heirsInput.consanguineBrothersCount > 0)) {
    tips.push({
      type: 'info',
      title: 'ميراث الجد مع الإخوة (خلاف الأئمة)',
      text: 'في هذه المسألة جد وإخوة لغير أم. يتبنى هذا المحرك مذهب الجمهور (الشافعية والمالكية والحنابلة) حيث يشارك الإخوة الجدَ في الإرث بالمقاسمة أو الأفضل له، على خلاف المذهب الحنفي الذي يحجبهم بالجد تماماً.',
      icon: '📚'
    });
  }

  if (heirsInput.wivesCount > 1) {
    tips.push({
      type: 'info',
      title: 'تعدد الزوجات والمشاركة في الفرض',
      text: `لديك (${heirsInput.wivesCount}) زوجات. يشتركن جميعاً بالتساوي في الفرض المقدر لهن شرعاً (الربع أو الثمن حسب وجود فرع وارث)، ولا ينال كل منهن فرضاً منفرداً.`,
      icon: '💍'
    });
  }

  // 3. Blocked heirs education
  const blockedList = heirs.filter(h => h.status === 'blocked');
  if (blockedList.length > 0) {
    const names = blockedList.map(h => h.name).join('، ');
    tips.push({
      type: 'warning',
      title: 'تأثير قواعد حجب الحرمان الشرعية',
      text: `تم حجب الورثة التالية أسماؤهم حجب حرمان تام لوجود وارث أقرب درجة منهم: (${names}). يمكنك مراجعة تفاصيل وسبب الحجب في جدول الأنصبة.`,
      icon: '🚫'
    });
  }

  // 4. General encouragement if everything is clean
  if (tips.length === 0 && netEstate > 0) {
    tips.push({
      type: 'success',
      title: 'المسألة مستقرة وتتوزع فروضاً وعصبة',
      text: 'تتوزع الحصص بسلاسة تامة دون عول أو رد أو نزاع فقهي. تم تقسيم التركة بالعدل الإلهي للورثة المستحقين وتطبيق مبادئ العصبة بالنفس والغير حسب الأصول.',
      icon: '✨'
    });
  }

  if (tips.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-light-beige pb-3">
        <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
        <h3 className="font-serif text-sm md:text-base font-bold text-brand-dark">
          مرشد الفرائض والمواريث الذكي
        </h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border flex gap-3 items-start transition-all duration-300 ${
              tip.type === 'warning'
                ? 'bg-amber-50/40 border-amber-200/50 text-amber-900'
                : tip.type === 'success'
                ? 'bg-brand-light-green/30 border-brand-green/20 text-brand-green'
                : 'bg-brand-light-beige/30 border-brand-border/40 text-brand-dark/80'
            }`}
          >
            <span className="text-xl shrink-0 leading-none mt-0.5">{tip.icon}</span>
            <div className="space-y-1">
              <h4 className="font-sans text-xs font-bold leading-tight">
                {tip.title}
              </h4>
              <p className="text-[11px] leading-relaxed opacity-90">
                {tip.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
