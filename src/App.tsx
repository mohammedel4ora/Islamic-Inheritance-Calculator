import React, { useState } from 'react';
import Header from './components/Header';
import EstateForm from './components/EstateForm';
import HeirSelector from './components/HeirSelector';
import ResultDisplay from './components/ResultDisplay';
import EducationalFaraid from './components/EducationalFaraid';
import CommonCases from './components/CommonCases';
import SmartAdvisor from './components/SmartAdvisor';
import { calculateInheritance } from './utils/inheritanceEngine';
import { HeirInput } from './types';
import { Calculator, Book, RefreshCw, Sparkles, Scale, BookOpen } from 'lucide-react';

const initialHeirs: HeirInput = {
  husband: false,
  wivesCount: 0,
  sonsCount: 0,
  daughtersCount: 0,
  father: false,
  mother: false,
  grandfather: false,
  grandmotherMotherSide: false,
  grandmotherFatherSide: false,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  consanguineBrothersCount: 0,
  consanguineSistersCount: 0,
  uterineBrothersCount: 0,
  uterineSistersCount: 0,
  sonsSonsCount: 0,
  sonsDaughtersCount: 0,
  fullUnclesCount: 0,
  consanguineUnclesCount: 0,
};

export default function App() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [totalEstate, setTotalEstate] = useState<string>('240000');
  const [debts, setDebts] = useState<string>('0');
  const [willExpenses, setWillExpenses] = useState<string>('0');
  const [heirs, setHeirs] = useState<HeirInput>(initialHeirs);
  const [activeTab, setActiveTab] = useState<'calculator' | 'guide' | 'cases'>('calculator');

  const handleLoadCase = (loadedHeirs: HeirInput, deceasedGender: 'male' | 'female') => {
    setHeirs(loadedHeirs);
    setGender(deceasedGender);
    setActiveTab('calculator');
  };

  // Handle switching gender -> resets husband/wife counts to prevent conflicting input states
  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender);
    setHeirs((prev) => ({
      ...prev,
      husband: false,
      wivesCount: 0,
    }));
  };

  const handleReset = () => {
    setHeirs(initialHeirs);
    setTotalEstate('240000');
    setDebts('0');
    setWillExpenses('0');
  };

  // Perform calculations on the fly for absolute real-time reactivity
  const parsedEstate = parseFloat(totalEstate) || 0;
  const parsedDebts = parseFloat(debts) || 0;
  const parsedWills = parseFloat(willExpenses) || 0;

  const result = calculateInheritance(heirs, parsedEstate, parsedDebts, parsedWills);

  return (
    <div className="min-h-full flex flex-col bg-brand-beige text-brand-dark">
      {/* App Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        
        {/* Navigation Tabs (Quickly toggle between calculator, common cases and the general guide) */}
        <div className="flex border-b border-brand-border print:hidden">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-brand-green text-brand-green bg-brand-light-green/20'
                : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>حاسبة المواريث التفاعلية</span>
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'cases'
                ? 'border-brand-green text-brand-green bg-brand-light-green/20'
                : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الحالات والمسائل الشهيرة</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-brand-green text-brand-green bg-brand-light-green/20'
                : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>الدليل الفقهي والأحكام</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'calculator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              {/* Form 1: Financial Details */}
              <EstateForm
                gender={gender}
                setGender={handleGenderChange}
                totalEstate={totalEstate}
                setTotalEstate={setTotalEstate}
                debts={debts}
                setDebts={setDebts}
                willExpenses={willExpenses}
                setWillExpenses={setWillExpenses}
              />

              {/* Quick Presets Panel */}
              <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-4 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-brand-light-beige pb-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <h3 className="font-serif text-xs font-bold text-brand-dark">نماذج سريعة للتجربة الفورية</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLoadCase({
                      ...initialHeirs,
                      wivesCount: 1,
                      sonsCount: 2,
                      daughtersCount: 1,
                    }, 'male')}
                    className="p-2 text-[10px] font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer"
                  >
                    👨‍👩‍👧‍👦 عصبة محضة (زوجة وأولاد)
                  </button>
                  <button
                    onClick={() => handleLoadCase({
                      ...initialHeirs,
                      wivesCount: 1,
                      father: true,
                      mother: true,
                      daughtersCount: 2,
                    }, 'male')}
                    className="p-2 text-[10px] font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer"
                  >
                    🏛️ المسألة المنبرية (عول)
                  </button>
                  <button
                    onClick={() => handleLoadCase({
                      ...initialHeirs,
                      husband: true,
                      mother: true,
                      father: true,
                    }, 'female')}
                    className="p-2 text-[10px] font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer"
                  >
                    ⚖️ الغراوية الأولى (ثلث باقي)
                  </button>
                  <button
                    onClick={() => handleLoadCase({
                      ...initialHeirs,
                      husband: true,
                      mother: true,
                      fullBrothersCount: 1,
                      uterineBrothersCount: 2,
                    }, 'female')}
                    className="p-2 text-[10px] font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer"
                  >
                    🔗 المسألة المشتركة (التشريك)
                  </button>
                </div>
              </div>

              {/* Form 2: Heir Selector */}
              <HeirSelector
                gender={gender}
                heirs={heirs}
                setHeirs={setHeirs}
              />

              {/* Reset Action */}
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-brand-light-beige hover:bg-brand-border/60 border border-brand-border rounded-xl text-brand-dark/80 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة تعيين كافة البيانات</span>
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-6">
              {result.netEstate > 0 ? (
                <>
                  <SmartAdvisor heirsInput={heirs} result={result} />
                  <ResultDisplay result={result} />
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-light-green/30 rounded-full flex items-center justify-center mx-auto border border-brand-green/20">
                    <Scale className="w-8 h-8 text-brand-green" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="font-serif text-base font-bold text-brand-dark">ابدأ بإدخال التركة والورثة</h3>
                    <p className="text-brand-dark/60 text-xs md:text-sm mt-1 leading-relaxed">
                      الرجاء إدخال قيمة التركة المالية الإجمالية في النموذج الأيمن، وتحديد الورثة الأحياء على قيد الحياة ليقوم النظام بحساب السهام الشرعية وتقسيم الإرث فورياً.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : activeTab === 'cases' ? (
          <div>
            <CommonCases onLoadCase={handleLoadCase} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <EducationalFaraid />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border/85 py-6 text-center text-xs text-brand-dark/50 print:hidden mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            حقوق النشر والاحتساب مكفولة لعام {new Date().getFullYear()} م - نظام المواريث الرقمي
          </p>
          <div className="flex items-center gap-1.5 text-brand-dark/70">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>مبني وفق مذهب الجمهور وقواعد الحساب الفقهية المعتمدة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
