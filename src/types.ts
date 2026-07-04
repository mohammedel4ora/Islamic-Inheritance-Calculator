export interface HeirInput {
  husband: boolean;
  wivesCount: number; // 0 to 4
  sonsCount: number;
  daughtersCount: number;
  father: boolean;
  mother: boolean;
  grandfather: boolean; // paternal grandfather (أب الأب)
  grandmotherMotherSide: boolean; // maternal grandmother (أم الأم)
  grandmotherFatherSide: boolean; // paternal grandmother (أم الأب)
  fullBrothersCount: number;
  fullSistersCount: number;
  consanguineBrothersCount: number; // الأخ لأب
  consanguineSistersCount: number; // الأخت لأب
  uterineBrothersCount: number; // الأخ لأم
  uterineSistersCount: number; // الأخت لأم
  sonsSonsCount: number; // ابن الابن
  sonsDaughtersCount: number; // بنت الابن
  fullUnclesCount: number; // العم الشقيق
  consanguineUnclesCount: number; // العم لأب
}

export type HeirStatus = 'fard' | 'taseeb' | 'blocked' | 'none';

export interface HeirResult {
  id: keyof HeirInput | 'spouses' | 'sons' | 'daughters' | 'fullBrothers' | 'fullSisters' | 'consanguineBrothers' | 'consanguineSisters' | 'uterineSiblings' | 'sonsSons' | 'sonsDaughters' | 'fullUncles' | 'consanguineUncles';
  name: string; // e.g. "الزوج", "الزوجة"
  status: HeirStatus;
  shareFractionText: string; // e.g. "1/6", "1/8", "عصبة", "محجوب"
  shareDecimal: number; // fraction of net estate, e.g. 0.125
  shareValue: number; // cash value of share
  seham: number; // سهام من أصل المسألة
  blockedBy?: string[]; // who blocked this heir
  reason: string; // Arabic explanation of the ruling
  count: number; // how many of this heir category exist
  individualShareValue: number; // share value per person if count > 1
  individualShareFractionText: string; // share fraction per person if count > 1
}

export interface CalculationResult {
  deceasedGender: 'male' | 'female';
  totalEstate: number;
  debts: number;
  willExpenses: number;
  netEstate: number;
  originalBase: number; // أصل المسألة قبل العول والرد
  finalBase: number; // أصل المسألة بعد العول أو الرد
  heirs: HeirResult[];
  hasAwl: boolean;
  hasRadd: boolean;
  raddRatio?: number; // ratio of radd distribution
  awlBase?: number; // أصل المسألة العائل
}
