import React, { useState } from 'react';
import { BookOpen, Sparkles, HelpCircle, ArrowLeft, RefreshCw, Check, Search, Scale } from 'lucide-react';
import { HeirInput } from '../types';

interface CaseDetail {
  id: string;
  title: string;
  subtitle: string;
  deceasedGender: 'male' | 'female';
  story: string;
  heirsDescription: string;
  solution: string;
  mathExplanation: string;
  heirsInput: HeirInput;
}

const FAMOUS_CASES: CaseDetail[] = [
  {
    id: 'minbariyya',
    title: 'المسألة المنبرية',
    subtitle: 'مسألة عول شهيرة سُئل عنها الإمام علي وهو على المنبر',
    deceasedGender: 'male',
    story: 'سُئل أمير المؤمنين علي بن أبي طالب رضي الله عنه وهو يخطب على منبر الكوفة عن رجل مات وترك: زوجة وأبوين وبنتين. فأجاب فوراً وبلا تفكر: "صار ثمنها تسعاً"، ومضى في خطبته. وسميت بالمنبرية نسبة لمنبر الكوفة، وهي من أروع الأمثلة على سرعة البديهة والتمكن الرياضي والشرعي.',
    heirsDescription: 'زوجة، أب، أم، بنتان (2)',
    solution: 'نظراً لتزاحم الفروض (البنتان لهما الثلثان 16/24، والأبوان لكل منهما السدس 4/24، والزوجة لها الثمن 3/24)، فإن مجموع السهام (3+4+4+16 = 27) يزيد عن أصل المسألة (24). تعول المسألة إلى 27، ويتحول نصيب الزوجة من الثمن (3/24) إلى التسع (3/27) نسبياً.',
    mathExplanation: 'الأصل الأصلي: 24 | الأصل بعد العول: 27 | تقسيم السهام: الزوجة (3 سهام)، البنتان (16 سهماً بالتساوي)، الأب (4 سهام)، الأم (4 سهام).',
    heirsInput: {
      husband: false,
      wivesCount: 1,
      sonsCount: 0,
      daughtersCount: 2,
      father: true,
      mother: true,
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
    }
  },
  {
    id: 'gharra1',
    title: 'المسألة العمرية الأولى (الغراوية)',
    subtitle: 'قضاء أمير المؤمنين عمر بن الخطاب في ثلث الباقي',
    deceasedGender: 'male',
    story: 'توفي رجل وترك: زوجة وأماً وأباً. قضى فيها عمر بن الخطاب وعثمان وابن مسعود رضي الله عنهم بأن للزوجة الربع (فرضها)، وللأم ثلث الباقي بعد نصيب الزوجة (وليس ثلث التركة كاملة)، وللأب الباقي تعصيباً. وذلك لئلا تأخذ الأم أكثر من الأب (الذكر) في نفس الدرجة، وسُميت بالغراوية لشهرتها كالغرّ الشديد الضياء.',
    heirsDescription: 'زوجة، أم، أب',
    solution: 'تأخذ الزوجة الربع فرضاً (1/4 = 3 سهام من 12)، ويتبقى 9 سهام. تأخذ الأم ثلث الباقي (3 سهام)، ويأخذ الأب الباقي تعصيباً (6 سهام)، وبذلك ينال الأب ضعف نصيب الأم (للذكر مثل حظ الأنثيين).',
    mathExplanation: 'الأصل المعتمد: 4 | تقسيم السهام الشرعية: الزوجة (1 سهم - 25%)، الأم (1 سهم - 25% ثلث الباقي)، الأب (2 سهم - 50% تعصيباً).',
    heirsInput: {
      husband: false,
      wivesCount: 1,
      sonsCount: 0,
      daughtersCount: 0,
      father: true,
      mother: true,
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
    }
  },
  {
    id: 'gharra2',
    title: 'المسألة العمرية الثانية (الغراوية)',
    subtitle: 'تطبيق مبدأ ثلث الباقي عند وجود الزوج والأبوين',
    deceasedGender: 'female',
    story: 'توفيت امرأة وتركت: زوجاً وأماً وأباً. قضى فيها الصحابة الكرام رضي الله عنهم بنفس علة المسألة السابقة؛ حيث يرث الزوج النصف فرضاً (3 سهام من 6)، وتأخذ الأم ثلث الباقي (سهم واحد)، ويأخذ الأب الباقي تعصيباً (سهمين)، وهو ضعف نصيب الأم صوناً للقاعدة الفقهية التفاضلية.',
    heirsDescription: 'زوج، أم، أب',
    solution: 'يرث الزوج النصف فرضاً (3 سهام من 6)، ويتبقى 3 سهام. تأخذ الأم ثلث الباقي (سهم واحد وهو ما يعادل سدس التركة الإجمالية)، ويأخذ الأب الباقي تعصيباً (سهمان وهو ما يعادل ثلث التركة الإجمالية).',
    mathExplanation: 'الأصل المعتمد: 6 | تقسيم السهام الشرعية: الزوج (3 سهام - 50%)، الأم (سهم واحد - 16.7%)، الأب (سهمان - 33.3%).',
    heirsInput: {
      husband: true,
      wivesCount: 0,
      sonsCount: 0,
      daughtersCount: 0,
      father: true,
      mother: true,
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
    }
  },
  {
    id: 'mushtarakah',
    title: 'المسألة المشتركة (الحِمارية)',
    subtitle: 'قضاء عمر بن الخطاب التاريخي بالتشريك بين الأخوة',
    deceasedGender: 'female',
    story: 'توفيت امرأة وتركت: زوجاً، وأماً، وإخوة لأم (2)، وأخاً شقيقاً (أو أكثر). في العام الأول قضى عمر بعدم إعطاء الأخ الشقيق شيئاً لأنه عصبة ولم يتبقَ شيء بعد الفروض. وفي العام الذي يليه تكررت المسألة، فقال الأخ الشقيق لعمر: "يا أمير المؤمنين، هب أن أبانا كان حماراً أو حجراً ملقى في اليم، ألسنا من أم واحدة؟" فاستحسن عمر كلامه وقضى بالتشريك بينهم في الثلث.',
    heirsDescription: 'زوج، أم، إخوة لأم (2+)، أخوة أشقاء (1+)',
    solution: 'الزوج النصف (3/6)، الأم السدس (1/6)، ويبقى ثلث التركة (2/6) يُشرك فيه الأخوة لأم والأخوة الأشقاء معاً بالتساوي المطلق دون تفرقة بين الذكور والإناث أو شقيق ولأم كونه الإرث من جهة الأم.',
    mathExplanation: 'الأصل المعتمد: 6 | تقسيم السهام: الزوج (3 سهام)، الأم (سهم واحد)، الأخوة لأم والأشقاء (سهمان مشتركان بالتساوي بين الجميع).',
    heirsInput: {
      husband: true,
      wivesCount: 0,
      sonsCount: 0,
      daughtersCount: 0,
      father: false,
      mother: true,
      grandfather: false,
      grandmotherMotherSide: false,
      grandmotherFatherSide: false,
      fullBrothersCount: 1,
      fullSistersCount: 0,
      consanguineBrothersCount: 0,
      consanguineSistersCount: 0,
      uterineBrothersCount: 2,
      uterineSistersCount: 0,
      sonsSonsCount: 0,
      sonsDaughtersCount: 0,
      fullUnclesCount: 0,
      consanguineUnclesCount: 0,
    }
  },
  {
    id: 'akdariyyah',
    title: 'المسألة الأكدرية',
    subtitle: 'مسألة الجد والأخت الشاذة التي كدرت قواعد التوريث',
    deceasedGender: 'female',
    story: 'توفيت امرأة وتركت: زوجاً، وأماً، وجداً، وأختاً شقيقة. سُميت بالأكدرية لأنها كدّرت أصول ومذهب زيد بن ثابت رضي الله عنه في الجد، وهي المسألة الوحيدة التي يُفرض فيها للأخت (النصف) مع وجود الجد، ثم يُجمع فرضا الأخت والجد ويُقسم الباقي بينهما للذكر مثل حظ الأنثيين.',
    heirsDescription: 'زوج، أم، جد لأب، أخت شقيقة (1)',
    solution: 'الزوج يأخذ النصف (3/6)، الأم تأخذ الثلث (2/6)، الجد يأخذ السدس (1/6)، الأخت تأخذ النصف (3/6). تعول المسألة من 6 إلى 9. ثم يضم الجد نصيبه ونصيب الأخت (1+3=4 سهام) ويقسمانها للذكر مثل حظ الأنثيين (للجد ثلثا الـ 4 وللأخت ثلثها)، وتصحح المسألة بضرب أصلها بـ 3 لتصبح من 27.',
    mathExplanation: 'الأصل النهائي: 27 | السهام بعد التصحيح الشرعي: الزوج (9 سهام - 33.3%)، الأم (6 سهام - 22.2%)، الجد (8 سهام - 29.6%)، الأخت الشقيقة (4 سهام - 14.8%).',
    heirsInput: {
      husband: true,
      wivesCount: 0,
      sonsCount: 0,
      daughtersCount: 0,
      father: false,
      mother: true,
      grandfather: true,
      grandmotherMotherSide: false,
      grandmotherFatherSide: false,
      fullBrothersCount: 0,
      fullSistersCount: 1,
      consanguineBrothersCount: 0,
      consanguineSistersCount: 0,
      uterineBrothersCount: 0,
      uterineSistersCount: 0,
      sonsSonsCount: 0,
      sonsDaughtersCount: 0,
      fullUnclesCount: 0,
      consanguineUnclesCount: 0,
    }
  },
  {
    id: 'radd_complete',
    title: 'مسألة الرد على صنف واحد',
    subtitle: 'إعادة الفائض من التركة للورثة عند عدم وجود عاصب',
    deceasedGender: 'female',
    story: 'توفيت امرأة وتركت: زوجاً وبنتاً واحدة. في قواعد الفقه الإسلامي، إذا لم تستغرق الفروض التركة كاملة ولم يكن هناك عاصب يأخذ الباقي، يُرد الباقي على ذوي الفروض نسبياً باستثناء الزوجين. وهنا يظهر تفوق محرك الحساب في معالجة مسائل "الرد" بدقة لخدمة مستحقيها.',
    heirsDescription: 'زوج، بنت واحدة',
    solution: 'يرث الزوج الربع فرضاً ولا يرد عليه شيء (3/12). ترث البنت النصف فرضاً (6/12) ويتبقى 3 سهام فائضة تُرد عليها بالكامل لتأخذ الإجمالي (9/12) وهو ما يعادل ثلاثة أرباع التركة (75%).',
    mathExplanation: 'أصل المسألة: 4 | تقسيم الحصص الفعلية: الزوج (سهم واحد بنسبة 25%)، البنت (3 سهام بنسبة 75% بالفرض والرد).',
    heirsInput: {
      husband: true,
      wivesCount: 0,
      sonsCount: 0,
      daughtersCount: 1,
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
    }
  }
];

interface CommonCasesProps {
  onLoadCase: (heirs: HeirInput, gender: 'male' | 'female') => void;
}

export default function CommonCases({ onLoadCase }: CommonCasesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCaseId, setLoadedCaseId] = useState<string | null>(null);

  const filteredCases = FAMOUS_CASES.filter(
    (c) =>
      c.title.includes(searchTerm) ||
      c.subtitle.includes(searchTerm) ||
      c.story.includes(searchTerm) ||
      c.heirsDescription.includes(searchTerm)
  );

  const handleLoad = (c: CaseDetail) => {
    onLoadCase(c.heirsInput, c.deceasedGender);
    setLoadedCaseId(c.id);
    setTimeout(() => {
      setLoadedCaseId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-light-beige pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-green" />
            <h2 className="font-serif text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">
              نماذج المواريث الشهيرة (الحالات العملية)
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-dark/60 bg-brand-light-green/20 px-3 py-1.5 rounded-lg border border-brand-green/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>انقر على أي مسألة لتحميلها وتجربتها في الحاسبة</span>
          </div>
        </div>

        <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed">
          جمعنا لك أشهر المسائل الفقهية المتوارثة عبر تاريخ القضاء الإسلامي والتي وضعت قواعد علم الفرائض وصقلت معادلاته الرياضية. يمكنك البحث عنها، قراءة القصة التاريخية وتكييفها الحسابي، ومحاكاتها مباشرة.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
          <input
            type="text"
            placeholder="ابحث عن مسألة (مثال: المنبرية، العمرية، الرد...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-brand-light-beige/30 border border-brand-border rounded-xl text-xs md:text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid of Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-brand-border hover:border-brand-green/30 hover:shadow-xs transition-all duration-300 flex flex-col overflow-hidden relative"
            >
              {/* Top Accent Line */}
              <div className="h-1.5 bg-gradient-to-l from-brand-green to-brand-gold"></div>

              <div className="p-5 flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-brand-light-green/50 text-brand-green border border-brand-green/20 font-bold px-2 py-0.5 rounded-full">
                      {c.deceasedGender === 'male' ? 'المتوفى: ذكَر' : 'المتوفى: أنثى'}
                    </span>
                    <span className="text-[10px] bg-brand-light-beige text-brand-dark/60 font-semibold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                      {c.heirsDescription}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-brand-dark hover:text-brand-green transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-brand-dark/50 mt-1 font-medium">{c.subtitle}</p>
                </div>

                {/* History/Story Block */}
                <div className="p-3.5 bg-brand-light-beige/25 border border-brand-border/40 rounded-xl">
                  <h4 className="font-serif text-xs font-bold text-brand-green flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>القصة والتأصيل الشرعي:</span>
                  </h4>
                  <p className="text-[11px] text-brand-dark/70 leading-relaxed font-sans text-justify">
                    {c.story}
                  </p>
                </div>

                {/* Solution Summary */}
                <div className="space-y-1">
                  <h4 className="font-sans text-[11px] font-bold text-brand-dark/80">خلاصة الحكم الفقهي:</h4>
                  <p className="text-[11px] text-brand-dark/70 leading-relaxed bg-brand-light-green/10 p-2.5 rounded-lg border border-brand-green/5">
                    {c.solution}
                  </p>
                </div>

                {/* Math breakdown */}
                <div className="text-[10px] font-mono text-brand-dark/60 bg-white border border-brand-border/50 p-2 rounded-lg">
                  {c.mathExplanation}
                </div>
              </div>

              {/* Bottom Action bar */}
              <div className="bg-brand-light-beige/30 border-t border-brand-border/40 p-3.5 flex justify-end">
                <button
                  onClick={() => handleLoad(c)}
                  disabled={loadedCaseId === c.id}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    loadedCaseId === c.id
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'bg-brand-gold text-brand-green hover:bg-brand-gold-dark shadow-sm active:scale-98'
                  }`}
                >
                  {loadedCaseId === c.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم تحميل المسألة بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3.5 h-3.5" />
                      <span>تطبيق ومحاكاة في الحاسبة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-brand-border p-12 text-center space-y-2">
            <p className="text-sm text-brand-dark/50">لم يتم العثور على أي مسائل تطابق بحثك</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-brand-green font-bold hover:underline"
            >
              عرض كافة المسائل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
