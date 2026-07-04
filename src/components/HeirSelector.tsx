import React, { useState } from 'react';
import { Users, Plus, Minus, CheckCircle2, Sparkles, Network } from 'lucide-react';
import { HeirInput } from '../types';

interface HeirSelectorProps {
  gender: 'male' | 'female';
  heirs: HeirInput;
  setHeirs: (updater: (prev: HeirInput) => HeirInput) => void;
  step?: number;
}

export default function HeirSelector({ gender, heirs, setHeirs, step }: HeirSelectorProps) {
  const [subTab, setSubTab] = useState<'primary' | 'extended'>('primary');
  
  const updateKey = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) => {
    setHeirs((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const increment = (key: keyof HeirInput, max = 99) => {
    setHeirs((prev) => {
      const current = prev[key];
      if (typeof current === 'number') {
        return { ...prev, [key]: Math.min(max, current + 1) };
      }
      return prev;
    });
  };

  const decrement = (key: keyof HeirInput, min = 0) => {
    setHeirs((prev) => {
      const current = prev[key];
      if (typeof current === 'number') {
        return { ...prev, [key]: Math.max(min, current - 1) };
      }
      return prev;
    });
  };

  // Helper component for count inputs
  const CountInput = ({ label, icon, itemKey, max = 20, min = 0 }: { label: string; icon: string; itemKey: keyof HeirInput; max?: number; min?: number }) => {
    const val = heirs[itemKey] as number;
    const isActive = val > 0;
    return (
      <div className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
        isActive 
          ? 'bg-brand-light-green/50 border-brand-green/30 shadow-2xs' 
          : 'bg-brand-light-beige/30 border-brand-border/40 hover:bg-brand-light-beige/60'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <span className="text-brand-dark text-xs md:text-sm font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => decrement(itemKey, min)}
            className="w-7 h-7 rounded-lg bg-white border border-brand-border/80 flex items-center justify-center text-brand-dark/70 hover:border-brand-green hover:text-brand-green active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold text-brand-dark text-sm md:text-base w-5 text-center">{val}</span>
          <button
            type="button"
            onClick={() => increment(itemKey, max)}
            className="w-7 h-7 rounded-lg bg-white border border-brand-border/80 flex items-center justify-center text-brand-dark/70 hover:border-brand-green hover:text-brand-green active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // Helper component for boolean checkboxes/toggles
  const ToggleInput = ({ label, icon, itemKey }: { label: string; icon: string; itemKey: keyof HeirInput }) => {
    const val = heirs[itemKey] as boolean;
    return (
      <button
        type="button"
        onClick={() => updateKey(itemKey, !val)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-right cursor-pointer ${
          val
            ? 'bg-brand-light-green/60 border-brand-green/40 text-brand-dark shadow-2xs font-bold'
            : 'bg-brand-light-beige/30 border-brand-border/40 text-brand-dark/70 hover:bg-brand-light-beige/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <span className="text-xs md:text-sm font-semibold">{label}</span>
        </div>
        <div className="relative flex items-center justify-center">
          {val ? (
            <CheckCircle2 className="w-5 h-5 text-brand-green fill-brand-light-green" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-brand-border/80 bg-white"></div>
          )}
        </div>
      </button>
    );
  };

  const activePrimaryCount =
    ((gender === 'female' && heirs.husband) ? 1 : 0) +
    ((gender === 'male' && heirs.wivesCount > 0) ? heirs.wivesCount : 0) +
    heirs.sonsCount +
    heirs.daughtersCount +
    (heirs.father ? 1 : 0) +
    (heirs.mother ? 1 : 0);

  const activeExtendedCount = 
    heirs.sonsSonsCount +
    heirs.sonsDaughtersCount +
    (heirs.grandfather ? 1 : 0) +
    (heirs.grandmotherMotherSide ? 1 : 0) +
    (heirs.grandmotherFatherSide ? 1 : 0) +
    heirs.fullBrothersCount +
    heirs.fullSistersCount +
    heirs.consanguineBrothersCount +
    heirs.consanguineSistersCount +
    heirs.uterineBrothersCount +
    heirs.uterineSistersCount +
    heirs.fullUnclesCount +
    heirs.consanguineUnclesCount;

  if (step === 2) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-5 animate-fade-in">
        <div className="flex justify-between items-center border-b border-brand-light-beige pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-green" />
            <h2 className="font-serif text-base md:text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">
              الخطوة 2: الزوجية والفروع المباشرة
            </h2>
          </div>
          <span className="text-xs text-brand-gold font-bold">الخطوة 2 من 5</span>
        </div>

        <p className="text-xs text-brand-dark/60 leading-relaxed -mt-1">
          الزوج أو الزوجات والأولاد المباشرون هم ركيزة المسألة الإرثية ولهم تأثير حجب مباشر على بقية الورثة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {gender === 'female' ? (
            <ToggleInput label="الزوج" icon="💍" itemKey="husband" />
          ) : (
            <CountInput label="الزوجات" icon="💍" itemKey="wivesCount" max={4} />
          )}
          <CountInput label="الأبناء (الذكور)" icon="👦" itemKey="sonsCount" />
          <CountInput label="البنات (الإناث)" icon="👧" itemKey="daughtersCount" />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-5 animate-fade-in">
        <div className="flex justify-between items-center border-b border-brand-light-beige pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-green" />
            <h2 className="font-serif text-base md:text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">
              الخطوة 3: الأصول والأحفاد
            </h2>
          </div>
          <span className="text-xs text-brand-gold font-bold">الخطوة 3 من 5</span>
        </div>

        <p className="text-xs text-brand-dark/60 leading-relaxed -mt-1">
          الأبوين والأجداد من الجهتين، وكذلك فروع الأبناء (أبناء وبنات الابن) الذين يرثون في حال غياب الفرع الوارث المباشر.
        </p>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-brand-green/80">الأصول المباشرة (الأبوين)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleInput label="الأب" icon="👴" itemKey="father" />
              <ToggleInput label="الأم" icon="👵" itemKey="mother" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-brand-green/80">الأجداد والجدات</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ToggleInput label="الجد لأب (أب الأب)" icon="🧓" itemKey="grandfather" />
              <ToggleInput label="الجدة لأم (أم الأم)" icon="👵" itemKey="grandmotherMotherSide" />
              <ToggleInput label="الجدة لأب (أم الأب)" icon="👵" itemKey="grandmotherFatherSide" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-brand-green/80">فروع الابن (الأحفاد)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أبناء الابن (الذكور)" icon="👶" itemKey="sonsSonsCount" />
              <CountInput label="بنات الابن (الإناث)" icon="🍼" itemKey="sonsDaughtersCount" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-5 animate-fade-in">
        <div className="flex justify-between items-center border-b border-brand-light-beige pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-green" />
            <h2 className="font-serif text-base md:text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">
              الخطوة 4: الحواشي والأعمام
            </h2>
          </div>
          <span className="text-xs text-brand-gold font-bold">الخطوة 4 من 5</span>
        </div>

        <p className="text-xs text-brand-dark/60 leading-relaxed -mt-1">
          الإخوة والأخوات بمختلف درجات قرابتهم (أشقاء، لأب، لأم)، بالإضافة إلى الأعمام الأشقاء أو لأب.
        </p>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-brand-green/80">الإخوة والأخوات الأشقاء ولأب</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أخوة أشقاء" icon="👬" itemKey="fullBrothersCount" />
              <CountInput label="أخوات شقيقات" icon="👭" itemKey="fullSistersCount" />
              <CountInput label="أخوة لأب" icon="👨‍👦" itemKey="consanguineBrothersCount" />
              <CountInput label="أخوات لأب" icon="👩‍👦" itemKey="consanguineSistersCount" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-brand-green/80">الإخوة للأم</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أخوة لأم (ذكور)" icon="🧑‍🤝‍🧑" itemKey="uterineBrothersCount" />
              <CountInput label="أخوات لأم (إناث)" icon="🧑‍🤝‍🧑" itemKey="uterineSistersCount" />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-brand-green/80">الأعمام وعصبات الحواشي</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أعمام أشقاء" icon="👨‍🦳" itemKey="fullUnclesCount" />
              <CountInput label="أعمام لأب" icon="👨‍🦳" itemKey="consanguineUnclesCount" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-brand-light-beige pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-green" />
          <h2 className="font-serif text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">تحديد الورثة الأحياء</h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">الخطوة 2 من 3</span>
      </div>

      <p className="text-xs text-brand-dark/60 leading-relaxed -mt-3">
        اختر الورثة الذين كانوا على قيد الحياة لحظة وفاة المورِّث، وحدد أعدادهم بدقة للحصول على أنصبة شرعية متطابقة مع أصول الفقه وعلم الفرائض.
      </p>

      {/* Sub-tabs Selector */}
      <div className="flex p-1 bg-brand-light-beige/30 rounded-xl border border-brand-border/60">
        <button
          type="button"
          onClick={() => setSubTab('primary')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'primary'
              ? 'bg-brand-green text-white shadow-xs'
              : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light-beige/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الورثة الأساسيون (الأكثر شيوعاً)</span>
          {activePrimaryCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${subTab === 'primary' ? 'bg-white text-brand-green' : 'bg-brand-green text-white'}`}>
              {activePrimaryCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSubTab('extended')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'extended'
              ? 'bg-brand-green text-white shadow-xs'
              : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light-beige/40'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>الورثة الممتدون (الأجداد والحواشي)</span>
          {activeExtendedCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${subTab === 'extended' ? 'bg-white text-brand-green' : 'bg-brand-green text-white'}`}>
              {activeExtendedCount}
            </span>
          )}
        </button>
      </div>

      {subTab === 'primary' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Category 1: Spouses & Descendants */}
          <div className="space-y-3">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              الزوجية والفروع (الأولاد المباشرون)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Spouses */}
              {gender === 'female' ? (
                <ToggleInput label="الزوج" icon="💍" itemKey="husband" />
              ) : (
                <CountInput label="الزوجات" icon="💍" itemKey="wivesCount" max={4} />
              )}

              {/* Sons & Daughters */}
              <CountInput label="الأبناء (الذكور)" icon="👦" itemKey="sonsCount" />
              <CountInput label="البنات (الإناث)" icon="👧" itemKey="daughtersCount" />
            </div>
          </div>

          {/* Category 2: Parents */}
          <div className="space-y-3 pt-1">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              الأبوين (الأصول المباشرة)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleInput label="الأب" icon="👴" itemKey="father" />
              <ToggleInput label="الأم" icon="👵" itemKey="mother" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Category 1: Grandchildren through Son */}
          <div className="space-y-3">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              فروع الابن (الأحفاد)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أبناء الابن (الذكور)" icon="👶" itemKey="sonsSonsCount" />
              <CountInput label="بنات الابن (الإناث)" icon="🍼" itemKey="sonsDaughtersCount" />
            </div>
          </div>

          {/* Category 2: Grandparents */}
          <div className="space-y-3 pt-1">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              الأجداد والجدات (الأصول غير المباشرة)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleInput label="الجد لأب (أب الأب)" icon="🧓" itemKey="grandfather" />
              <ToggleInput label="الجدة لأم (أم الأم)" icon="👵" itemKey="grandmotherMotherSide" />
              <ToggleInput label="الجدة لأب (أم الأب)" icon="👵" itemKey="grandmotherFatherSide" />
            </div>
          </div>

          {/* Category 3: Siblings */}
          <div className="space-y-3 pt-1">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              الأخوة والأخوات (الحواشي المقربة)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Full Siblings */}
              <CountInput label="أخوة أشقاء" icon="👬" itemKey="fullBrothersCount" />
              <CountInput label="أخوات شقيقات" icon="👭" itemKey="fullSistersCount" />

              {/* Consanguine Siblings */}
              <CountInput label="أخوة لأب" icon="👨‍👦" itemKey="consanguineBrothersCount" />
              <CountInput label="أخوات لأب" icon="👩‍👦" itemKey="consanguineSistersCount" />

              {/* Uterine Siblings */}
              <CountInput label="أخوة لأم (ذكور)" icon="🧑‍🤝‍🧑" itemKey="uterineBrothersCount" />
              <CountInput label="أخوات لأم (إناث)" icon="🧑‍🤝‍🧑" itemKey="uterineSistersCount" />
            </div>
          </div>

          {/* Category 4: Uncles */}
          <div className="space-y-3 pt-1">
            <h3 className="font-serif text-xs md:text-sm font-bold text-brand-green border-r-2 border-brand-gold pr-2">
              الأعمام (عصبات الحواشي)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountInput label="أعمام أشقاء" icon="👨‍🦳" itemKey="fullUnclesCount" />
              <CountInput label="أعمام لأب" icon="👨‍🦳" itemKey="consanguineUnclesCount" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
