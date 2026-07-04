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
  const [calcStep, setCalcStep] = useState<number>(1);

  const handleLoadCase = (loadedHeirs: HeirInput, deceasedGender: 'male' | 'female') => {
    setHeirs(loadedHeirs);
    setGender(deceasedGender);
    setActiveTab('calculator');
    setCalcStep(5); // Jump directly to results for presets
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
    setCalcStep(1); // Reset to step 1
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
        <div className="flex border-b border-brand-border overflow-x-auto whitespace-nowrap scrollbar-none print:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
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
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
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
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
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
          <div className="space-y-6">
            {/* Elegant Master Stepper */}
            <div className="bg-white rounded-2xl border border-brand-border p-4 md:p-6 shadow-3xs print:hidden">
              <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-none -mx-2 px-2">
                {[
                  { step: 1, label: 'البيانات المالية', icon: '💰' },
                  { step: 2, label: 'الزوجية والأولاد', icon: '💍' },
                  { step: 3, label: 'الأصول والأحفاد', icon: '👵' },
                  { step: 4, label: 'الحواشي والأعمام', icon: '👬' },
                  { step: 5, label: 'جدول الأنصبة', icon: '⚖️' },
                ].map((s) => (
                  <React.Fragment key={s.step}>
                    {s.step > 1 && (
                      <div className={`hidden md:block h-0.5 flex-1 mx-4 transition-all duration-300 ${
                        calcStep >= s.step ? 'bg-brand-green' : 'bg-brand-border/60'
                      }`} />
                    )}
                    <button
                      onClick={() => setCalcStep(s.step)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                        calcStep === s.step
                          ? 'bg-brand-green text-white font-bold shadow-xs'
                          : calcStep > s.step
                          ? 'text-brand-green bg-brand-light-green/25 font-semibold'
                          : 'text-brand-dark/50 hover:text-brand-dark/80 font-medium'
                      }`}
                    >
                      <span className="text-sm md:text-base">{s.icon}</span>
                      <span className="text-xs md:text-sm">{s.label}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Screen Switcher */}
            <div className="grid grid-cols-1 gap-6 items-start">
              
              {/* Main Content Area */}
              <div className="space-y-6">
                {calcStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7">
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
                    </div>
                    <div className="lg:col-span-5 space-y-6">
                      {/* Quick Presets Panel */}
                      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-brand-light-beige pb-3">
                          <Sparkles className="w-5 h-5 text-brand-gold" />
                          <h3 className="font-serif text-sm font-bold text-brand-dark">نماذج سريعة للتجربة الفورية</h3>
                        </div>
                        <p className="text-xs text-brand-dark/60 leading-relaxed">
                          يمكنك اختيار إحدى المسائل الفقهية الشهيرة أو النماذج الجاهزة لتعبئة البيانات والقفز للنتائج مباشرة لتجربة حية.
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          <button
                            onClick={() => handleLoadCase({
                              ...initialHeirs,
                              wivesCount: 1,
                              sonsCount: 2,
                              daughtersCount: 1,
                            }, 'male')}
                            className="p-3 text-xs font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer flex items-center gap-2"
                          >
                            <span>👨‍👩‍👧‍👦</span>
                            <span>عصبة محضة (زوجة وأولاد)</span>
                          </button>
                          <button
                            onClick={() => handleLoadCase({
                              ...initialHeirs,
                              wivesCount: 1,
                              father: true,
                              mother: true,
                              daughtersCount: 2,
                            }, 'male')}
                            className="p-3 text-xs font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer flex items-center gap-2"
                          >
                            <span>🏛️</span>
                            <span>المسألة المنبرية (عول)</span>
                          </button>
                          <button
                            onClick={() => handleLoadCase({
                              ...initialHeirs,
                              husband: true,
                              mother: true,
                              father: true,
                            }, 'female')}
                            className="p-3 text-xs font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer flex items-center gap-2"
                          >
                            <span>⚖️</span>
                            <span>الغراوية الأولى (ثلث باقي)</span>
                          </button>
                          <button
                            onClick={() => handleLoadCase({
                              ...initialHeirs,
                              husband: true,
                              mother: true,
                              fullBrothersCount: 1,
                              uterineBrothersCount: 2,
                            }, 'female')}
                            className="p-3 text-xs font-bold bg-brand-light-beige/40 hover:bg-brand-light-green/40 hover:text-brand-green border border-brand-border/60 hover:border-brand-green/30 rounded-xl transition-all text-right cursor-pointer flex items-center gap-2"
                          >
                            <span>🔗</span>
                            <span>المسألة المشتركة (التشريك)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {calcStep === 2 && (
                  <div className="max-w-2xl mx-auto w-full">
                    <HeirSelector
                      gender={gender}
                      heirs={heirs}
                      setHeirs={setHeirs}
                      step={2}
                    />
                  </div>
                )}

                {calcStep === 3 && (
                  <div className="max-w-2xl mx-auto w-full">
                    <HeirSelector
                      gender={gender}
                      heirs={heirs}
                      setHeirs={setHeirs}
                      step={3}
                    />
                  </div>
                )}

                {calcStep === 4 && (
                  <div className="max-w-2xl mx-auto w-full">
                    <HeirSelector
                      gender={gender}
                      heirs={heirs}
                      setHeirs={setHeirs}
                      step={4}
                    />
                  </div>
                )}

                {calcStep === 5 && (
                  <div className="space-y-6">
                    {result.netEstate > 0 ? (
                      <>
                        <SmartAdvisor heirsInput={heirs} result={result} />
                        <ResultDisplay result={result} />
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-8 text-center space-y-4 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-brand-light-green/30 rounded-full flex items-center justify-center mx-auto border border-brand-green/20">
                          <Scale className="w-8 h-8 text-brand-green" />
                        </div>
                        <div className="max-w-md mx-auto">
                          <h3 className="font-serif text-base font-bold text-brand-dark">التركة غير كافية أو لم تُدخل بعد</h3>
                          <p className="text-brand-dark/60 text-xs md:text-sm mt-1 leading-relaxed">
                            الرجاء العودة إلى الخطوة الأولى لإدخال قيمة التركة المالية الإجمالية، وتحديد الورثة لتظهر لك النتائج والتقسيم الشرعي.
                          </p>
                          <button
                            onClick={() => setCalcStep(1)}
                            className="mt-4 px-5 py-2.5 bg-brand-green text-white text-xs font-bold rounded-xl hover:bg-brand-green/95 transition-all shadow-md cursor-pointer"
                          >
                            الذهاب للخطوة الأولى 💰
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons for Wizard steps (Previous / Next) */}
                <div className="flex items-center justify-between max-w-2xl mx-auto pt-4 border-t border-brand-border/60 print:hidden">
                  <button
                    onClick={() => setCalcStep((prev) => Math.max(1, prev - 1))}
                    disabled={calcStep === 1}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      calcStep === 1
                        ? 'opacity-40 cursor-not-allowed text-brand-dark/40 bg-brand-border/30'
                        : 'bg-white hover:bg-brand-light-beige border border-brand-border text-brand-dark cursor-pointer shadow-3xs'
                    }`}
                  >
                    <span>&larr;</span>
                    <span>الخطوة السابقة</span>
                  </button>

                  {calcStep < 5 ? (
                    <button
                      onClick={() => setCalcStep((prev) => Math.min(5, prev + 1))}
                      className="px-6 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>الخطوة التالية</span>
                      <span>&rarr;</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 bg-brand-light-beige hover:bg-brand-border/60 border border-brand-border rounded-xl text-brand-dark/80 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>حساب مسألة جديدة</span>
                    </button>
                  )}
                </div>

              </div>

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
