import React from 'react';
import { CircleDollarSign, ShieldAlert, HeartHandshake, FileText } from 'lucide-react';

interface EstateFormProps {
  gender: 'male' | 'female';
  setGender: (g: 'male' | 'female') => void;
  totalEstate: string;
  setTotalEstate: (v: string) => void;
  debts: string;
  setDebts: (v: string) => void;
  willExpenses: string;
  setWillExpenses: (v: string) => void;
}

export default function EstateForm({
  gender,
  setGender,
  totalEstate,
  setTotalEstate,
  debts,
  setDebts,
  willExpenses,
  setWillExpenses
}: EstateFormProps) {
  
  // Format numeric inputs
  const parseNum = (val: string) => parseFloat(val) || 0;
  
  const estateNum = parseNum(totalEstate);
  const debtsNum = parseNum(debts);
  const willsNum = parseNum(willExpenses);
  const netEstate = Math.max(0, estateNum - debtsNum - willsNum);
  
  const isOverSpent = (debtsNum + willsNum) > estateNum;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 md:p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-brand-light-beige pb-3">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-brand-green" />
          <h2 className="font-serif text-lg font-bold border-r-4 border-brand-green pr-3 text-brand-dark">بيانات المتوفى والتركة</h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">الخطوة 1 من 3</span>
      </div>

      {/* Gender Selection */}
      <div>
        <label className="block text-brand-dark text-xs font-bold uppercase mb-2">جنس المتوفى</label>
        <div className="flex bg-brand-light-beige p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              gender === 'male'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-brand-dark/70 hover:text-brand-dark'
            }`}
          >
            <span>👨</span>
            <span>ذكر</span>
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              gender === 'female'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-brand-dark/70 hover:text-brand-dark'
            }`}
          >
            <span>👩</span>
            <span>أنثى</span>
          </button>
        </div>
      </div>

      {/* Financial Fields */}
      <div className="space-y-4">
        {/* Total Estate */}
        <div>
          <label className="block text-brand-dark text-xs font-bold uppercase mb-1.5 flex justify-between items-center">
            <span>إجمالي قيمة التركة</span>
            <span className="text-[10px] text-gray-400 font-normal">بالريال أو العملة المحلية</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={totalEstate}
              onChange={(e) => setTotalEstate(e.target.value)}
              className="w-full bg-brand-light-beige p-3 rounded-xl text-left font-mono font-bold text-brand-green border-none focus:ring-2 focus:ring-brand-gold outline-hidden text-sm"
            />
            <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
          </div>
        </div>

        {/* Debts & Wills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-dark text-xs font-bold uppercase mb-1.5 flex items-center gap-1">
              <HeartHandshake className="w-4 h-4 text-gray-400" />
              <span>الديون على الميت</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                className="w-full bg-brand-light-beige p-3 rounded-xl text-left font-mono font-bold text-brand-dark/80 border-none focus:ring-2 focus:ring-brand-gold outline-hidden text-sm"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
            </div>
          </div>

          <div>
            <label className="block text-brand-dark text-xs font-bold uppercase mb-1.5 flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>الوصايا الشرعية</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={willExpenses}
                onChange={(e) => setWillExpenses(e.target.value)}
                className="w-full bg-brand-light-beige p-3 rounded-xl text-left font-mono font-bold text-brand-dark/80 border-none focus:ring-2 focus:ring-brand-gold outline-hidden text-sm"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-xs">ريال</span>
            </div>
            {willsNum > 0 && willsNum > (estateNum / 3) && (
              <p className="text-[10px] text-amber-600 mt-1 leading-normal">
                ⚠️ تجاوزت ثلث التركة ({Math.round(estateNum / 3)})، وهو الحد الشرعي الأقصى.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Net Estate Display */}
      <div className="p-4 bg-brand-light-green/40 border border-brand-border/40 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-brand-dark/60">التركة الإجمالية:</span>
          <span className="font-mono font-bold text-brand-dark/80">{estateNum.toLocaleString()} ريال</span>
        </div>
        <div className="flex justify-between items-center text-xs text-rose-600">
          <span>اقتطاع الديون والوصايا:</span>
          <span className="font-mono font-bold">-{(debtsNum + willsNum).toLocaleString()} ريال</span>
        </div>
        <div className="h-px bg-brand-border/50 my-1"></div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-brand-green">التركة الصافية للإرث:</span>
          <span className="font-mono font-bold text-brand-green text-base">
            {netEstate.toLocaleString()} ريال
          </span>
        </div>
      </div>

      {/* Overspent Warning */}
      {isOverSpent && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800 leading-normal">
            <p className="font-bold">تنبيه شرعي مهم:</p>
            <p className="mt-1">
              الديون والوصايا تتجاوز قيمة التركة الإجمالية. في هذه الحالة، تستغرق الديون التركة كاملة، ولا يتبقى شيء للورثة.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
