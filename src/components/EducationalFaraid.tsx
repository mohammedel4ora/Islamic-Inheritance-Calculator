import React, { useState } from 'react';
import { Book, ChevronDown, ChevronUp, Scale, ShieldAlert, Award, Compass, Layers, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccordionItem {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

interface DisputeCase {
  id: string;
  title: string;
  badge: string;
  description: string;
  schools: {
    name: string;
    verdict: string;
    proof: string;
    example: string;
  }[];
}

export default function EducationalFaraid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeDispute, setActiveDispute] = useState<string>('grand_brothers');

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const rules: AccordionItem[] = [
    {
      title: "الحقوق المتعلقة بالتركة (ترتيب الحقوق)",
      icon: <Scale className="w-5 h-5 text-brand-green" />,
      content: [
        "1. مؤن التجهيز: تكاليف غسل الميت وتكفينه ودفنه بالمعروف.",
        "2. الديون المرسلة: الديون التي في ذمة الميت للعباد أو لله (كالزكاة والحج).",
        "3. الوصية الشرعية: تنفذ في حدود ثلث ما تبقى من التركة لغير وارث، إلا إذا أجاز الورثة الزيادة.",
        "4. إرث الورثة: تقسيم ما تبقى بعد ذلك على الورثة الشرعيين حسب الأنصبة."
      ]
    },
    {
      title: "أصحاب الفروض المقدرة في كتاب الله",
      icon: <Award className="w-5 h-5 text-brand-gold" />,
      content: [
        "أصحاب النصف (1/2): الزوج (عند عدم الولد)، البنت المنفردة، بنت الابن المنفردة، الأخت الشقيقة المنفردة، الأخت لأب المنفردة.",
        "أصحاب الربع (1/4): الزوج (عند وجود الولد)، الزوجة (عند عدم الولد).",
        "أصحاب الثمن (1/8): الزوجة أو الزوجات (عند وجود الولد).",
        "أصحاب الثلثين (2/3): البنات المتعددات، بنات الابن المتعددات، الأخوات الشقيقات المتعددات، الأخوات لأب المتعددات (بشرط عدم الحاجب والمعصب).",
        "أصحاب الثلث (1/3): الأم (عند عدم الولد وجمع الأخوة)، الأخوة لأم (إذا كانوا اثنين فأكثر).",
        "أصحاب السدس (1/6): الأب (مع الولد)، الجد (مع الولد عند عدم الأب)، الأم (مع الولد أو جمع الأخوة)، الجدة (أم الأم أو أم الأب)، بنت الابن (مع البنت الصلبية تكملة الثلثين)، الأخت لأب (مع الشقيقة تكملة الثلثين)، الأخ لأم المنفرد أو الأخت لأم."
      ]
    },
    {
      title: "باب الحجب والمنع في الميراث",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      content: [
        "• حجب حرمان: منع الوارث من الإرث بالكلية لوجود من هو أولى منه (مثل حجب الأخوة بالأب أو الابن).",
        "• حجب نقصان: تقليل نصيب الوارث من فرض أعلى إلى فرض أدنى (مثل انتقال الزوج من النصف إلى الربع بسبب وجود الولد).",
        "• خمسة ورثة لا يحجبون حجب حرمان أبداً: الزوج، الزوجة، الأب، الأم، الابن، البنت."
      ]
    },
    {
      title: "مسائل العول والرد والمسائل الخاصة",
      icon: <Book className="w-5 h-5 text-brand-green" />,
      content: [
        "• العول: زيادة في سهام الورثة ونقص في أنصبتهم، ويحدث إذا زادت الفروض عن أصل المسألة (أكبر من 1).",
        "• الرد: زيادة في أنصبة الورثة ونقص في سهام المسألة، ويحدث إذا قصرت الفروض عن أصل المسألة ولم يوجد عاصب، فيُرَدُّ الباقي على ذوي الفروض عدا الزوجين.",
        "• الغراوان (العُمريتان): هما مسألتان (زوج وأم وأب) أو (زوجة وأم وأب)، تأخذ الأم فيهما ثلث الباقي بعد نصيب أحد الزوجين حتى لا يزيد نصيبها على الأب."
      ]
    }
  ];

  const disputes: DisputeCase[] = [
    {
      id: 'grand_brothers',
      title: 'ميراث الجد مع الإخوة لغير أم',
      badge: 'الخلاف الأعظم بين الصحابة',
      description: 'إذا توفي شخص عن جد (لأب) وإخوة أشقاء أو لأب، هل يحجب الجد الإخوة كالأب تماماً، أم يتقاسمون معه تركة المتوفى؟ تباينت آراء الصحابة والمدارس الفقهية في هذه المسألة لعدم وجود نص صريح مباشر في القرآن الكريم.',
      schools: [
        {
          name: 'المذهب الحنفي ورواية عن أحمد (قول الصديق وابن عباس)',
          verdict: 'الجد يحجب جميع الإخوة والأخوات حجب حرمان مطلقاً، ولا يرثون معه شيئاً.',
          proof: 'الجد بمنزلة الأب عند فقده؛ لقوله تعالى "يا بني آدم" فسمى الجد أباً، ولأن قرابة الجد أصل متصل مباشرة بالميت، بينما قرابة الإخوة فرع جانبي، وقرابة الأصل دائمًا أقوى وتحجب الحواشي.',
          example: 'مات وترك: زوجة وجداً وأخاً شقيقاً. للزوجة الربع فرضاً، وللجد باقي التركة تعصيباً (3/4)، والأخ الشقيق محجوب تماماً ليس له شيء.'
        },
        {
          name: 'مذهب الجمهور (الشافعية والمالكية والحنابلة وصاحبا أبي حنيفة)',
          verdict: 'الإخوة يشاركون الجد في الإرث ولا يحجبهم. للجد الأفضل من: ثلث التركة كاملة، أو ثلث الباقي بعد أصحاب الفروض، أو مقاسمة الإخوة كأخ منهم.',
          proof: 'الجد والإخوة يدلون للميت بنفس الشخص وهو الأب (الجد أبو الأب، والأخ ابن الأب)، وتساويا في الدرجة والجهة فلا يصح حجب أحدهما بالآخر، بل يشتركون دفعاً للضرر عن الإخوة.',
          example: 'مات وترك: جداً وأخاً شقيقاً واحداً. يتقاسمان التركة مناصفةً بينهما (لكل منهما 50% تعصيباً بالمقاسمة المباشرة).'
        }
      ]
    },
    {
      id: 'mushtarakah',
      title: 'المسألة المشتركة (الحمارية)',
      badge: 'المرونة في القضاء العُمري',
      description: 'توفيت امرأة عن: زوج، وأم (أو جدة)، وإخوة لأم (اثنان فأكثر)، وإخوة أشقاء. هل يسقط الأشقاء لكونهم عصبة ولم يتبقَ شيء من السهام، أم يشتركون مع الأخوة لأم في فرض الثلث؟',
      schools: [
        {
          name: 'المذهب الحنفي والحنبلي (قضاء عمر بن الخطاب الأول)',
          verdict: 'يأخذ أصحاب الفروض حصصهم كاملة، ويسقط الإخوة الأشقاء تماماً ولا يرثون شيئاً.',
          proof: 'الزوج له النصف (3/6)، والأم لها السدس (1/6)، وللإخوة لأم الثلث فرضاً (2/6)، واستغرقت الفروض كامل التركة (6/6). وبما أن الأشقاء عصبة يرثون الباقي ولم يتبقَ شيء، يسقطون وفق الحديث: "ألحقوا الفرائض بأهلها".',
          example: 'ترك الميت ما قيمته 60 ألف جنيه. للزوج 30 ألفاً، للأم 10 آلاف، للإخوة لأم 20 ألفاً بالتساوي، والأشقاء صفر جنيه.'
        },
        {
          name: 'المذهب الشافعي والمالكي (قضاء عمر بن الخطاب الثاني والنهائي)',
          verdict: 'يُشرك الإخوة الأشقاء مع الإخوة لأم في فرض الثلث بالتساوي بين الجميع (للذكر مثل الأنثى).',
          proof: 'القرابة من جهة الأم هي سبب فرض الثلث، والأشقاء يشاركون إخوة الأم في الأمومة، وأبوهم الشقيق لا يزيدهم إلا قوة قرابة لا ضعفاً، وكما قالوا لعمر: "هب أن أبانا كان حماراً في اليم، ألسنا من أم واحدة؟"',
          example: 'ترك الميت 60 ألف جنيه. للزوج 30 ألفاً، للأم 10 آلاف، وللأخوة لأم والأشقاء مجتمعين 20 ألفاً تُقسم بينهم جميعاً بالتساوي المطلق.'
        }
      ]
    },
    {
      id: 'radd_spouses',
      title: 'الرد على أحد الزوجين عند انفراد التركة',
      badge: 'صلة الرحم مقابل رابطة العقد',
      description: 'إذا لم تستغرق الفروض كل تركة الميت ولم يكن له عصبة يستحقون الباقي، يُرد الفائض على الورثة. لكن هل ينال الزوج أو الزوجة نصيباً من هذا الرد أم يُرد على ذوي الأنساب فقط؟',
      schools: [
        {
          name: 'مذهب جمهور الصحابة والفقهاء (المعتمد في الحاسبة)',
          verdict: 'لا يُرد على الزوجين مطلقاً، بل يقتصر الرد على ذوي الفروض من الأقارب والنسب فقط.',
          proof: 'الرد يعتمد على الرحم والقرابة لقوله تعالى "وأولو الأرحام بعضهم أولى ببعض"، وعلاقة الزوجية هي علاقة سببية تزول بوفاة الشريك، فتنال الزوجة فرضها المقدر فقط (الربع أو الثمن) ويعاد الباقي للأقارب.',
          example: 'ماتت وكتت: زوجاً وبنتاً واحدة. للزوج الربع فرضاً (25%)، وللبنت النصف فرضاً والباقي رداً لتنال (75% من التركة).'
        },
        {
          name: 'مذهب أمير المؤمنين عثمان بن عفان وبعض متأخري الفقهاء',
          verdict: 'يُرد الفائض على جميع الورثة بما في ذلك الزوج أو الزوجة بنسبة فرض كل منهما.',
          proof: 'الزوجية عقد عظيم ترتب عليه التوارث ابتداءً، والرد تيسير وتوسيع على الشريك الحي في غياب الأقارب العصبات أو ذوي الأرحام المقربين صوناً لكرامته ولحفظ الاستقرار الأسري.',
          example: 'ماتت وتركت: زوجاً وبنتاً. للزوج فرضاً ورداً (20%)، وللبنت فرضاً ورداً (80%) (حسب نسبة فرضيهما الربع إلى النصف وهي 1:2).'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Guide Accordion */}
      <section className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-brand-light-beige pb-3">
          <Book className="w-5 h-5 text-brand-green" />
          <h2 className="font-serif text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">الدليل الفقهي السريع للمواريث</h2>
        </div>
        <p className="text-brand-dark/70 text-xs md:text-sm mb-5 leading-relaxed">
          علم الفرائض هو العلم الذي يُعرف به من يرث ومن لا يرث ومقدار ما لكل وارث. إليك تفصيلاً لأهم الأحكام الشرعية وقواعد الحساب المعتمدة في هذا التطبيق:
        </p>

        <div className="space-y-3">
          {rules.map((rule, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-brand-border/60 rounded-xl overflow-hidden shadow-3xs transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between p-4 bg-brand-light-beige/30 hover:bg-brand-light-beige/60 transition-colors text-right cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {rule.icon}
                    <span className="font-sans text-xs md:text-sm font-semibold text-brand-dark">
                      {rule.title}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-dark/60" /> : <ChevronDown className="w-4 h-4 text-brand-dark/60" />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 bg-white border-t border-brand-border/40 text-[11px] md:text-xs text-brand-dark/80 space-y-2.5 leading-relaxed">
                        {rule.content.map((line, lIdx) => (
                          <p key={lIdx}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Jurisprudential Differences Section */}
      <section className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-brand-light-beige pb-3 justify-between flex-wrap gap-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-gold animate-spin-slow" />
            <h2 className="font-serif text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">مقارنة المذاهب والاختلافات الفقهية</h2>
          </div>
          <span className="text-[10px] bg-brand-light-green/45 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-full font-bold">
            التعددية الفقهية رحمة وتيسير
          </span>
        </div>

        <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed">
          علم الفرائض والمواريث حافل بمسائل الاجتهاد الفقهي التي صقلها كبار الصحابة الكرام والفقهاء الأربعة لتغطي الحالات الاجتماعية المعقدة بمرونة تامة. تصفح الاختلافات الفقهية الكبرى لمعرفة أوجه المقارنة بين المذاهب:
        </p>

        {/* Dispute selection tabs / buttons */}
        <div className="flex flex-col sm:flex-row gap-2 border-b border-brand-border pb-1">
          {disputes.map((dispute) => (
            <button
              key={dispute.id}
              onClick={() => setActiveDispute(dispute.id)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold text-right transition-all duration-200 cursor-pointer flex-1 sm:flex-none border-b-2 ${
                activeDispute === dispute.id
                  ? 'border-brand-green text-brand-green bg-brand-light-green/20'
                  : 'border-transparent text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light-beige/30'
              }`}
            >
              <div className="flex flex-col">
                <span>{dispute.title}</span>
                <span className="text-[9px] text-brand-gold/80 font-normal mt-0.5">{dispute.badge}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Dispute details content */}
        {disputes.filter(d => d.id === activeDispute).map((dispute) => (
          <div key={dispute.id} className="space-y-5 animate-fade-in">
            {/* Dispute Head Description */}
            <div className="p-4 bg-brand-light-beige/30 border border-brand-border/40 rounded-xl space-y-2">
              <span className="text-[10px] bg-brand-gold text-brand-green font-bold px-2 py-0.5 rounded-full inline-block">
                موضوع المسألة والخلاف الحسابي
              </span>
              <p className="text-[11px] md:text-xs text-brand-dark/80 leading-relaxed font-sans">
                {dispute.description}
              </p>
            </div>

            {/* School comparison columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dispute.schools.map((school, sIdx) => (
                <div 
                  key={sIdx}
                  className="bg-brand-light-beige/10 hover:bg-white border border-brand-border/60 hover:border-brand-green/30 rounded-2xl p-4 transition-all duration-300 space-y-4 shadow-3xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* School Title Banner */}
                    <div className="flex items-center gap-2 border-b border-brand-border pb-2.5">
                      <Layers className="w-4 h-4 text-brand-green" />
                      <h4 className="font-serif text-xs md:text-sm font-bold text-brand-dark leading-tight">
                        {school.name}
                      </h4>
                    </div>

                    {/* Verdict / Decision */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-green font-bold block">الحكم الفقهي والتوريث:</span>
                      <p className="text-[11px] md:text-xs text-brand-dark/90 leading-relaxed font-sans bg-brand-light-green/10 p-2.5 rounded-xl border border-brand-green/10">
                        {school.verdict}
                      </p>
                    </div>

                    {/* Religious Proof */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-gold font-bold block">الدليل والتعليل الشرعي:</span>
                      <p className="text-[11px] text-brand-dark/70 leading-relaxed text-justify">
                        • {school.proof}
                      </p>
                    </div>
                  </div>

                  {/* Math Example */}
                  <div className="pt-3 border-t border-brand-border/40 mt-auto">
                    <span className="text-[10px] text-brand-dark/50 font-bold block mb-1">مثال تطبيقي للتقسيم:</span>
                    <div className="p-3 bg-white border border-brand-border/30 rounded-lg text-[10px] font-mono text-brand-dark/85 leading-relaxed border-r-4 border-r-brand-gold">
                      {school.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note on Calculator's choice */}
            <div className="flex gap-2.5 items-start p-3 bg-rose-50/15 border border-brand-border/40 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-dark/60 leading-normal">
                <strong>تنويه حسابي:</strong> يتبنى محرك حساب الإرث في هذا التطبيق الرقمي مذهب الجمهور في حساب ميراث "الرد" والميراث المتعلق بالمسألة "المشركة" لتوافقه مع المعايير المعاصرة لمعظم المحاكم الشرعية في العالم العربي والإسلامي.
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

