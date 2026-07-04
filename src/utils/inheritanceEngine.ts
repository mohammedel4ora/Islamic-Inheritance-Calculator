import { HeirInput, HeirResult, CalculationResult, HeirStatus } from '../types';

// Helper to find Greatest Common Divisor
function getGCD(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Helper to simplify fractions
function simplifyFraction(numerator: number, denominator: number): string {
  if (numerator === 0) return '0';
  const gcd = getGCD(numerator, denominator);
  const num = numerator / gcd;
  const den = denominator / gcd;
  return den === 1 ? `${num}` : `${num}/${den}`;
}

export function calculateInheritance(input: HeirInput, totalEstate: number, debts: number, willExpenses: number): CalculationResult {
  const netEstate = Math.max(0, totalEstate - debts - willExpenses);
  
  // 1. Check if the estate is fully consumed by debts and wills
  if (netEstate === 0) {
    return {
      deceasedGender: input.husband ? 'female' : 'male',
      totalEstate,
      debts,
      willExpenses,
      netEstate: 0,
      originalBase: 0,
      finalBase: 0,
      heirs: [],
      hasAwl: false,
      hasRadd: false,
    };
  }

  // Helper arrays/objects for calculation
  const heirs: HeirResult[] = [];
  
  // Let's determine presence of branches (الفرع الوارث والأصل الوارث والجمع من الأخوة)
  const hasMaleDescendant = input.sonsCount > 0 || input.sonsSonsCount > 0;
  const hasFemaleDescendant = input.daughtersCount > 0 || input.sonsDaughtersCount > 0;
  const hasDescendant = hasMaleDescendant || hasFemaleDescendant;
  
  const hasMother = input.mother;
  const hasFather = input.father;
  
  // Total siblings count from any side (الشقيق، لأب، لأم)
  const siblingsCount = 
    input.fullBrothersCount + 
    input.fullSistersCount + 
    input.consanguineBrothersCount + 
    input.consanguineSistersCount + 
    input.uterineBrothersCount + 
    input.uterineSistersCount;
  const hasMultipleSiblings = siblingsCount >= 2;

  // Track who is blocked and why
  const blockedStatus: Record<string, { blocked: boolean; reasons: string[] }> = {};

  // Setup blocking logic
  // Grandfather is blocked by Father
  blockedStatus['grandfather'] = {
    blocked: input.grandfather && hasFather,
    reasons: hasFather ? ['الأب'] : []
  };

  // Grandmother MotherSide (أم الأم) is blocked by Mother
  blockedStatus['grandmotherMotherSide'] = {
    blocked: input.grandmotherMotherSide && hasMother,
    reasons: hasMother ? ['الأم'] : []
  };

  // Grandmother FatherSide (أم الأب) is blocked by Mother, or Father, or Grandmother MotherSide if we assume standard block
  const fatherSideBlockedBy: string[] = [];
  if (hasMother) fatherSideBlockedBy.push('الأم');
  if (hasFather) fatherSideBlockedBy.push('الأب');
  blockedStatus['grandmotherFatherSide'] = {
    blocked: input.grandmotherFatherSide && (hasMother || hasFather),
    reasons: fatherSideBlockedBy
  };

  // Son's Son is blocked by Son
  blockedStatus['sonsSons'] = {
    blocked: input.sonsSonsCount > 0 && input.sonsCount > 0,
    reasons: input.sonsCount > 0 ? ['الابن'] : []
  };

  // Son's Daughter is blocked by:
  // 1. Son
  // 2. Multiple Daughters (2 or more) unless there is a Son's Son of equal or lower rank (which makes her Asabah)
  const hasEqualSonsSon = input.sonsSonsCount > 0;
  const sonsDaughtersBlockedBy: string[] = [];
  if (input.sonsCount > 0) sonsDaughtersBlockedBy.push('الابن');
  if (input.daughtersCount >= 2 && !hasEqualSonsSon) sonsDaughtersBlockedBy.push('البنات المتعددات (وليس معها ابن ابن يعصبها)');
  blockedStatus['sonsDaughters'] = {
    blocked: input.sonsDaughtersCount > 0 && (input.sonsCount > 0 || (input.daughtersCount >= 2 && !hasEqualSonsSon)),
    reasons: sonsDaughtersBlockedBy
  };

  // Full Brother is blocked by Son, Son's Son, Father
  const brotherBlockedBy: string[] = [];
  if (input.sonsCount > 0) brotherBlockedBy.push('الابن');
  if (input.sonsSonsCount > 0) brotherBlockedBy.push('ابن الابن');
  if (hasFather) brotherBlockedBy.push('الأب');
  blockedStatus['fullBrothers'] = {
    blocked: input.fullBrothersCount > 0 && brotherBlockedBy.length > 0,
    reasons: brotherBlockedBy
  };

  // Full Sister is blocked by Son, Son's Son, Father
  const sisterBlockedBy: string[] = [];
  if (input.sonsCount > 0) sisterBlockedBy.push('الابن');
  if (input.sonsSonsCount > 0) sisterBlockedBy.push('ابن الابن');
  if (hasFather) sisterBlockedBy.push('الأب');
  blockedStatus['fullSisters'] = {
    blocked: input.fullSistersCount > 0 && sisterBlockedBy.length > 0,
    reasons: sisterBlockedBy
  };

  // Consanguine Brother is blocked by: Son, Son's Son, Father, Full Brother, or Full Sister if she becomes Asabah مع الغير (with Daughters)
  // Let's check if Full Sister is Asabah with Daughters
  const fullSisterIsAsabahWithDaughters = input.fullSistersCount > 0 && hasFemaleDescendant && input.fullBrothersCount === 0 && !hasFather && input.sonsCount === 0 && input.sonsSonsCount === 0;
  const consBrotherBlockedBy: string[] = [];
  if (input.sonsCount > 0) consBrotherBlockedBy.push('الابن');
  if (input.sonsSonsCount > 0) consBrotherBlockedBy.push('ابن الابن');
  if (hasFather) consBrotherBlockedBy.push('الأب');
  if (input.fullBrothersCount > 0) consBrotherBlockedBy.push('الأخ الشقيق');
  if (fullSisterIsAsabahWithDaughters) consBrotherBlockedBy.push('الأخت الشقيقة التي صارت عصبة مع البنات');
  blockedStatus['consanguineBrothers'] = {
    blocked: input.consanguineBrothersCount > 0 && consBrotherBlockedBy.length > 0,
    reasons: consBrotherBlockedBy
  };

  // Consanguine Sister is blocked by:
  // 1. Son, Son's Son, Father
  // 2. Full Brother
  // 3. Full Sister if she is Asabah مع الغير
  // 4. Multiple Full Sisters (2+) unless there is a Consanguine Brother to make her Asabah
  const hasConsBrother = input.consanguineBrothersCount > 0;
  const consSisterBlockedBy: string[] = [];
  if (input.sonsCount > 0) consSisterBlockedBy.push('الابن');
  if (input.sonsSonsCount > 0) consSisterBlockedBy.push('ابن الابن');
  if (hasFather) consSisterBlockedBy.push('الأب');
  if (input.fullBrothersCount > 0) consSisterBlockedBy.push('الأخ الشقيق');
  if (fullSisterIsAsabahWithDaughters) consSisterBlockedBy.push('الأخت الشقيقة التي صارت عصبة مع البنات');
  if (input.fullSistersCount >= 2 && !hasConsBrother) consSisterBlockedBy.push('الأخوات الشقيقات المتعددات (وليس معها أخ لأب يعصبها)');
  blockedStatus['consanguineSisters'] = {
    blocked: input.consanguineSistersCount > 0 && consSisterBlockedBy.length > 0,
    reasons: consSisterBlockedBy
  };

  // Uterine Siblings are blocked by: any descending branch, or Father, or Grandfather
  const uterineBlockedBy: string[] = [];
  if (hasDescendant) uterineBlockedBy.push('الفرع الوارث');
  if (hasFather) uterineBlockedBy.push('الأب');
  if (input.grandfather && !blockedStatus['grandfather'].blocked) uterineBlockedBy.push('الجد');
  blockedStatus['uterineSiblings'] = {
    blocked: (input.uterineBrothersCount > 0 || input.uterineSistersCount > 0) && uterineBlockedBy.length > 0,
    reasons: uterineBlockedBy
  };

  // Paternal Uncles are blocked by: Son, Son's Son, Father, Grandfather, Full Brother, Consanguine Brother, or Sisters who are Asabah with Others
  const consSisterIsAsabahWithOthers = input.consanguineSistersCount > 0 && hasFemaleDescendant && input.fullBrothersCount === 0 && input.fullSistersCount === 0 && input.consanguineBrothersCount === 0 && !hasFather && input.sonsCount === 0 && input.sonsSonsCount === 0;

  const fullUncleBlockedBy: string[] = [];
  if (input.sonsCount > 0) fullUncleBlockedBy.push('الابن');
  if (input.sonsSonsCount > 0) fullUncleBlockedBy.push('ابن الابن');
  if (hasFather) fullUncleBlockedBy.push('الأب');
  if (input.grandfather && !blockedStatus['grandfather'].blocked) fullUncleBlockedBy.push('الجد');
  if (input.fullBrothersCount > 0) fullUncleBlockedBy.push('الأخ الشقيق');
  if (input.consanguineBrothersCount > 0) fullUncleBlockedBy.push('الأخ لأب');
  if (fullSisterIsAsabahWithDaughters) fullUncleBlockedBy.push('الأخت الشقيقة التي صارت عصبة مع البنات');
  if (consSisterIsAsabahWithOthers) fullUncleBlockedBy.push('الأخت لأب التي صارت عصبة مع البنات');

  blockedStatus['fullUncles'] = {
    blocked: input.fullUnclesCount > 0 && fullUncleBlockedBy.length > 0,
    reasons: fullUncleBlockedBy
  };

  const consUncleBlockedBy: string[] = [...fullUncleBlockedBy];
  if (input.fullUnclesCount > 0 && !blockedStatus['fullUncles'].blocked) {
    consUncleBlockedBy.push('العم الشقيق');
  }
  blockedStatus['consanguineUncles'] = {
    blocked: input.consanguineUnclesCount > 0 && consUncleBlockedBy.length > 0,
    reasons: consUncleBlockedBy
  };

  // Fard (Fixed Share) Calculations in terms of Seham out of 24
  let fardSeham: Record<string, number> = {};
  let explanations: Record<string, string> = {};

  // -- Husband --
  if (input.husband) {
    if (hasDescendant) {
      fardSeham['husband'] = 6; // 1/4 of 24
      explanations['husband'] = 'الربع فرضاً لوجود الفرع الوارث للميت.';
    } else {
      fardSeham['husband'] = 12; // 1/2 of 24
      explanations['husband'] = 'النصف فرضاً لعدم وجود فرع وارث للميت.';
    }
  }

  // -- Wife/Wives --
  if (input.wivesCount > 0) {
    if (hasDescendant) {
      fardSeham['spouses'] = 3; // 1/8 of 24
      explanations['spouses'] = `الثمن فرضاً لوجود الفرع الوارث للميت (يُقسم بين الزوجات بالتساوي: ${simplifyFraction(1, 8 * input.wivesCount)} لكل زوجة).`;
    } else {
      fardSeham['spouses'] = 6; // 1/4 of 24
      explanations['spouses'] = `الربع فرضاً لعدم وجود فرع وارث للميت (يُقسم بين الزوجات بالتساوي: ${simplifyFraction(1, 4 * input.wivesCount)} لكل زوجة).`;
    }
  }

  // -- Mother --
  if (hasMother) {
    // Check Umariyyah (العمرية أو الغراوية):
    // 1. Husband + Mother + Father (No other heirs)
    // 2. Wife/Wives + Mother + Father (No other heirs)
    const onlyHusbandMotherFather = input.husband && hasMother && hasFather && input.sonsCount === 0 && input.daughtersCount === 0 && siblingsCount === 0 && input.sonsSonsCount === 0 && input.sonsDaughtersCount === 0 && !input.grandfather && !input.grandmotherFatherSide && !input.grandmotherMotherSide;
    const onlyWivesMotherFather = input.wivesCount > 0 && hasMother && hasFather && input.sonsCount === 0 && input.daughtersCount === 0 && siblingsCount === 0 && input.sonsSonsCount === 0 && input.sonsDaughtersCount === 0 && !input.grandfather && !input.grandmotherFatherSide && !input.grandmotherMotherSide;

    if (onlyHusbandMotherFather) {
      fardSeham['mother'] = 4; // 1/3 of the remainder after husband takes 12/24. Remainder is 12, so mother gets 4. (Which is 1/6 of 24)
      explanations['mother'] = 'ثلث الباقي فرضاً في المسألة العمرية (بعد نصيب الزوج وهو النصف).';
    } else if (onlyWivesMotherFather) {
      fardSeham['mother'] = 6; // 1/3 of the remainder after wife takes 6/24. Remainder is 18, so mother gets 6. (Which is 1/4 of 24)
      explanations['mother'] = 'ثلث الباقي فرضاً في المسألة العمرية (بعد نصيب الزوجة وهو الربع).';
    } else if (hasDescendant || hasMultipleSiblings) {
      fardSeham['mother'] = 4; // 1/6 of 24
      explanations['mother'] = `السدس فرضاً لوجود ${hasDescendant ? 'الفرع الوارث' : ''}${hasDescendant && hasMultipleSiblings ? ' و' : ''}${hasMultipleSiblings ? 'جمع من الأخوة' : ''}.`;
    } else {
      fardSeham['mother'] = 8; // 1/3 of 24
      explanations['mother'] = 'الثلث فرضاً لعدم وجود فرع وارث أو جمع من الأخوة للميت.';
    }
  }

  // -- Father --
  if (hasFather) {
    if (hasMaleDescendant) {
      fardSeham['father'] = 4; // 1/6 of 24
      explanations['father'] = 'السدس فرضاً لوجود فرع وارث ذكر (ابن أو ابن ابن).';
    } else if (hasFemaleDescendant) {
      fardSeham['father'] = 4; // 1/6 + Ta'seeb
      explanations['father'] = 'السدس فرضاً لوجود فرع وارث أنثى، بالإضافة إلى التعصيب إن بقي شيء.';
    } else {
      // Pure Ta'seeb (Remainder)
      fardSeham['father'] = 0;
      explanations['father'] = 'التعصيب محضا كونه أقرب عصبة من الذكور لعدم وجود فرع وارث.';
    }
  }

  // -- Grandfather (أب الأب) --
  if (input.grandfather && !blockedStatus['grandfather'].blocked) {
    if (hasMaleDescendant) {
      fardSeham['grandfather'] = 4; // 1/6 of 24
      explanations['grandfather'] = 'السدس فرضاً لوجود فرع وارث ذكر عند عدم وجود الأب.';
    } else if (hasFemaleDescendant) {
      fardSeham['grandfather'] = 4; // 1/6 + Ta'seeb
      explanations['grandfather'] = 'السدس فرضاً لوجود فرع وارث أنثى عند عدم وجود الأب، بالإضافة إلى التعصيب.';
    } else {
      fardSeham['grandfather'] = 0;
      explanations['grandfather'] = 'التعصيب محضا لعدم وجود فرع وارث أو أب.';
    }
  }

  // -- Grandmother (أم الأم / أم الأب) --
  const activeMaternalGrandmother = input.grandmotherMotherSide && !blockedStatus['grandmotherMotherSide'].blocked;
  const activePaternalGrandmother = input.grandmotherFatherSide && !blockedStatus['grandmotherFatherSide'].blocked;
  
  if (activeMaternalGrandmother || activePaternalGrandmother) {
    const grandmotherCount = (activeMaternalGrandmother ? 1 : 0) + (activePaternalGrandmother ? 1 : 0);
    fardSeham['grandmother'] = 4; // 1/6 of 24 (shared if both are active)
    if (activeMaternalGrandmother && activePaternalGrandmother) {
      explanations['grandmother'] = 'السدس فرضاً يُقسم بين الجدتين بالتساوي (أم الأم وأم الأب) لعدم وجود حاجب.';
    } else if (activeMaternalGrandmother) {
      explanations['grandmother'] = 'السدس فرضاً للجدة لأم (أم الأم) لعدم وجود الأم.';
    } else {
      explanations['grandmother'] = 'السدس فرضاً للجدة لأب (أم الأب) لعدم وجود الأم أو الأب.';
    }
  }

  // -- Daughters (البنات) --
  let daughtersIsAsabah = false;
  if (input.daughtersCount > 0) {
    if (input.sonsCount > 0) {
      daughtersIsAsabah = true;
      explanations['daughters'] = 'التعصيب بالغير مع الابن (للذكر مثل حظ الأنثيين).';
    } else {
      if (input.daughtersCount === 1) {
        fardSeham['daughters'] = 12; // 1/2 of 24
        explanations['daughters'] = 'النصف فرضاً كونها ابنة واحدة منفردة ولا يعصبها ابن.';
      } else {
        fardSeham['daughters'] = 16; // 2/3 of 24
        explanations['daughters'] = 'الثلثان فرضاً كونهن بنات متعددات (اثنتين فأكثر) ولا يعصبهن ابن.';
      }
    }
  }

  // -- Son's Daughters (بنات الابن) --
  let sonsDaughtersIsAsabah = false;
  if (input.sonsDaughtersCount > 0 && !blockedStatus['sonsDaughters'].blocked) {
    if (input.sonsSonsCount > 0) {
      sonsDaughtersIsAsabah = true;
      explanations['sonsDaughters'] = 'التعصيب بالغير مع ابن الابن (للذكر مثل حظ الأنثيين).';
    } else {
      // If no daughter and no son: acts like daughter
      if (input.daughtersCount === 0) {
        if (input.sonsDaughtersCount === 1) {
          fardSeham['sonsDaughters'] = 12; // 1/2 of 24
          explanations['sonsDaughters'] = 'النصف فرضاً لانفرادها وعدم وجود بنت صلبية أو ابن ابن يعصبها.';
        } else {
          fardSeham['sonsDaughters'] = 16; // 2/3 of 24
          explanations['sonsDaughters'] = 'الثلثان فرضاً للتعدد وعدم وجود بنت صلبية أو ابن ابن يعصبها.';
        }
      } else if (input.daughtersCount === 1) {
        // One daughter exists -> Son's Daughter gets 1/6 (تكملة الثلثين)
        fardSeham['sonsDaughters'] = 4; // 1/6 of 24
        explanations['sonsDaughters'] = 'السدس فرضاً تكملة للثلثين مع وجود ابنة صلبية واحدة فرضها النصف.';
      }
    }
  }

  // -- Full Sisters (الأخوات الشقيقات) --
  let fullSistersIsAsabah = false;
  let fullSistersIsAsabahWithOthers = false; // عصبة مع الغير (مع البنات)
  if (input.fullSistersCount > 0 && !blockedStatus['fullSisters'].blocked) {
    if (input.fullBrothersCount > 0) {
      fullSistersIsAsabah = true;
      explanations['fullSisters'] = 'التعصيب بالغير مع الأخ الشقيق (للذكر مثل حظ الأنثيين).';
    } else if (hasFemaleDescendant) {
      fullSistersIsAsabahWithOthers = true;
      explanations['fullSisters'] = 'التعصيب مع الغير مع البنات أو بنات الابن لقوله ﷺ: (اجعلوا الأخوات مع البنات عصبة).';
    } else {
      if (input.fullSistersCount === 1) {
        fardSeham['fullSisters'] = 12; // 1/2 of 24
        explanations['fullSisters'] = 'النصف فرضاً كونها أختاً شقيقة واحدة منفردة ولا حاجب لها ولا معصب.';
      } else {
        fardSeham['fullSisters'] = 16; // 2/3 of 24
        explanations['fullSisters'] = 'الثلثان فرضاً كونهن أخوات شقيقات متعددات ولا حاجب لهن ولا معصب.';
      }
    }
  }

  // -- Consanguine Sisters (الأخوات لأب) --
  let consSistersIsAsabah = false;
  let consSistersIsAsabahWithOthers = false;
  if (input.consanguineSistersCount > 0 && !blockedStatus['consanguineSisters'].blocked) {
    if (input.consanguineBrothersCount > 0) {
      consSistersIsAsabah = true;
      explanations['consanguineSisters'] = 'التعصيب بالغير مع الأخ لأب (للذكر مثل حظ الأنثيين).';
    } else if (hasFemaleDescendant && input.fullBrothersCount === 0 && input.fullSistersCount === 0) {
      // Becomes Asabah with girls if no brothers or full sisters
      consSistersIsAsabahWithOthers = true;
      explanations['consanguineSisters'] = 'التعصيب مع الغير مع البنات أو بنات الابن عند عدم وجود الشقاق.';
    } else {
      if (input.fullSistersCount === 0) {
        if (input.consanguineSistersCount === 1) {
          fardSeham['consanguineSisters'] = 12; // 1/2 of 24
          explanations['consanguineSisters'] = 'النصف فرضاً لانفرادها وعدم وجود شقيق أو أخت شقيقة أو معصب.';
        } else {
          fardSeham['consanguineSisters'] = 16; // 2/3 of 24
          explanations['consanguineSisters'] = 'الثلثان فرضاً للتعدد وعدم وجود شقيق أو أخت شقيقة أو معصب.';
        }
      } else if (input.fullSistersCount === 1) {
        // One full sister exists -> 1/6 (تكملة الثلثين)
        fardSeham['consanguineSisters'] = 4; // 1/6 of 24
        explanations['consanguineSisters'] = 'السدس فرضاً تكملة للثلثين مع وجود أخت شقيقة واحدة فرضها النصف.';
      }
    }
  }

  // -- Uterine Siblings (الأخوة لأم) --
  if ((input.uterineBrothersCount > 0 || input.uterineSistersCount > 0) && !blockedStatus['uterineSiblings'].blocked) {
    const totalUterineCount = input.uterineBrothersCount + input.uterineSistersCount;
    if (totalUterineCount === 1) {
      fardSeham['uterineSiblings'] = 4; // 1/6 of 24
      explanations['uterineSiblings'] = 'السدس فرضاً لانفراد الأخ لأم (أو الأخت لأم) وعدم وجود حاجب.';
    } else {
      fardSeham['uterineSiblings'] = 8; // 1/3 of 24
      explanations['uterineSiblings'] = 'الثلث فرضاً لتعددهم (يُقسم بين الإخوة لأم بالتساوي للذكر والأنثى على حد سواء).';
    }
  }

  // --- Sum Fard shares ---
  let totalFardSeham = 0;
  for (const key in fardSeham) {
    totalFardSeham += fardSeham[key];
  }

  let finalBase = 24;
  let hasAwl = false;
  let hasRadd = false;

  // Track the actual shares (out of finalBase)
  const finalSeham: Record<string, number> = {};
  
  // Copy fard seham to final seham initially
  for (const key in fardSeham) {
    finalSeham[key] = fardSeham[key];
  }

  // Check for Al-Awl (العول)
  if (totalFardSeham > 24) {
    hasAwl = true;
    finalBase = totalFardSeham; // Base expands to sum of Fard shares
  }

  // If we have Al-Awl, there is absolutely no remainder for Asabah.
  // Let's resolve Asabah if there is NO Awl (totalFardSeham <= 24)
  const remainingSeham = Math.max(0, 24 - totalFardSeham);
  
  // Let's list the potential active Asabah heirs in order of priority:
  // 1. Sons (and Daughters by Ta'seeb)
  // 2. Son's Sons (and Son's Daughters by Ta'seeb)
  // 3. Father (by Ta'seeb if no male descendant - Father takes remainder if any)
  // 4. Grandfather (if Father is blocked/not present, gets remainder if no male descendant)
  // 5. Full Brothers (and Full Sisters if Asabah بالغير or مع الغير)
  // 6. Consanguine Brothers (and Consanguine Sisters if Asabah بالغير or مع الغير)
  
  let asabahDistributed = false;
  let activeAsabahId: string | null = null;
  let asabahExplanation = '';
  
  if (!hasAwl && remainingSeham >= 0) {
    // 1. Sons & Daughters
    if (input.sonsCount > 0) {
      activeAsabahId = 'descendants_asabah';
      asabahDistributed = true;
      // Daughters become Asabah with Sons (if any daughters)
      const maleShares = input.sonsCount * 2;
      const femaleShares = input.daughtersCount;
      const totalUnits = maleShares + femaleShares;
      
      finalSeham['sons'] = remainingSeham * (maleShares / totalUnits);
      if (input.daughtersCount > 0) {
        finalSeham['daughters'] = remainingSeham * (femaleShares / totalUnits);
        asabahExplanation = `التعصيب بالغير للابن والبنت (للذكر مثل حظ الأنثيين)، تم تقسيم باقي التركة وهو ${remainingSeham} سهام من 24.`;
      } else {
        asabahExplanation = `التعصيب بالنفس للابن، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
      }
    }
    // 2. Son's Sons & Son's Daughters
    else if (input.sonsSonsCount > 0 && !blockedStatus['sonsSons'].blocked) {
      activeAsabahId = 'sonsSons_asabah';
      asabahDistributed = true;
      const maleShares = input.sonsSonsCount * 2;
      const femaleShares = (input.sonsDaughtersCount > 0 && !blockedStatus['sonsDaughters'].blocked) ? input.sonsDaughtersCount : 0;
      const totalUnits = maleShares + femaleShares;
      
      finalSeham['sonsSons'] = remainingSeham * (maleShares / totalUnits);
      if (femaleShares > 0) {
        finalSeham['sonsDaughters'] = remainingSeham * (femaleShares / totalUnits);
        asabahExplanation = `التعصيب بالغير لابن الابن وبنت الابن (للذكر مثل حظ الأنثيين)، تم تقسيم باقي التركة وهو ${remainingSeham} سهام من 24.`;
      } else {
        asabahExplanation = `التعصيب بالنفس لابن الابن، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
      }
    }
    // 3. Father (Ta'seeb remainder when only female descendants or no descendants exist)
    else if (hasFather && remainingSeham > 0) {
      activeAsabahId = 'father_asabah';
      asabahDistributed = true;
      // Father gets the entire remaining seham in addition to his Fard (if any)
      finalSeham['father'] = (finalSeham['father'] || 0) + remainingSeham;
      if (hasFemaleDescendant) {
        explanations['father'] = `السدس فرضاً لوجود فرع وارث أنثى (${simplifyFraction(4, 24)}) + التعصيب بأخذ الباقي وهو (${simplifyFraction(remainingSeham, 24)}).`;
      } else {
        explanations['father'] = `التعصيب محضا كونه عصبة الميت، يأخذ باقي التركة بالكامل وهو ${remainingSeham} سهام من 24.`;
      }
    }
    // 4. Grandfather (Ta'seeb remainder if active)
    else if (input.grandfather && !blockedStatus['grandfather'].blocked && remainingSeham > 0) {
      activeAsabahId = 'grandfather_asabah';
      asabahDistributed = true;
      finalSeham['grandfather'] = (finalSeham['grandfather'] || 0) + remainingSeham;
      if (hasFemaleDescendant) {
        explanations['grandfather'] = `السدس فرضاً لوجود فرع وارث أنثى (${simplifyFraction(4, 24)}) عند عدم وجود الأب + التعصيب بأخذ الباقي وهو (${simplifyFraction(remainingSeham, 24)}).`;
      } else {
        explanations['grandfather'] = `التعصيب محضا عند عدم وجود الأب أو الفرع الوارث، يأخذ باقي التركة بالكامل وهو ${remainingSeham} سهام من 24.`;
      }
    }
    // 5. Full Brothers & Full Sisters
    else if (input.fullBrothersCount > 0 && !blockedStatus['fullBrothers'].blocked) {
      activeAsabahId = 'brothers_asabah';
      asabahDistributed = true;
      const maleShares = input.fullBrothersCount * 2;
      const femaleShares = (input.fullSistersCount > 0 && !blockedStatus['fullSisters'].blocked) ? input.fullSistersCount : 0;
      const totalUnits = maleShares + femaleShares;
      
      finalSeham['fullBrothers'] = remainingSeham * (maleShares / totalUnits);
      if (femaleShares > 0) {
        finalSeham['fullSisters'] = remainingSeham * (femaleShares / totalUnits);
        asabahExplanation = `التعصيب بالغير للأخوة الأشقاء مع الأخوات الشقيقات (للذكر مثل حظ الأنثيين)، تم تقسيم باقي التركة وهو ${remainingSeham} سهام من 24.`;
      } else {
        asabahExplanation = `التعصيب بالنفس للأخ الشقيق، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
      }
    }
    // 6. Full Sisters (Asabah مع الغير - with daughters, taking remainder, if no brothers/father/descendant males)
    else if (input.fullSistersCount > 0 && !blockedStatus['fullSisters'].blocked && fullSistersIsAsabahWithOthers && remainingSeham > 0) {
      activeAsabahId = 'sisters_with_girls_asabah';
      asabahDistributed = true;
      finalSeham['fullSisters'] = remainingSeham;
      explanations['fullSisters'] = `التعصيب مع الغير مع البنات (تأخذ الأخوات الشقيقات باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي).`;
    }
    // 7. Consanguine Brothers & Consanguine Sisters
    else if (input.consanguineBrothersCount > 0 && !blockedStatus['consanguineBrothers'].blocked) {
      activeAsabahId = 'cons_brothers_asabah';
      asabahDistributed = true;
      const maleShares = input.consanguineBrothersCount * 2;
      const femaleShares = (input.consanguineSistersCount > 0 && !blockedStatus['consanguineSisters'].blocked) ? input.consanguineSistersCount : 0;
      const totalUnits = maleShares + femaleShares;
      
      finalSeham['consanguineBrothers'] = remainingSeham * (maleShares / totalUnits);
      if (femaleShares > 0) {
        finalSeham['consanguineSisters'] = remainingSeham * (femaleShares / totalUnits);
        asabahExplanation = `التعصيب بالغير للأخ لأب مع الأخت لأب (للذكر مثل حظ الأنثيين)، تم تقسيم باقي التركة وهو ${remainingSeham} سهام من 24.`;
      } else {
        asabahExplanation = `التعصيب بالنفس للأخ لأب، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
      }
    }
    // 8. Consanguine Sisters (Asabah مع الغير - with daughters)
    else if (input.consanguineSistersCount > 0 && !blockedStatus['consanguineSisters'].blocked && consSistersIsAsabahWithOthers && remainingSeham > 0) {
      activeAsabahId = 'cons_sisters_with_girls_asabah';
      asabahDistributed = true;
      finalSeham['consanguineSisters'] = remainingSeham;
      explanations['consanguineSisters'] = `التعصيب مع الغير مع البنات (تأخذ الأخوات لأب باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي).`;
    }
    // 9. Full Paternal Uncles
    else if (input.fullUnclesCount > 0 && !blockedStatus['fullUncles'].blocked) {
      activeAsabahId = 'fullUncles_asabah';
      asabahDistributed = true;
      finalSeham['fullUncles'] = remainingSeham;
      asabahExplanation = `التعصيب بالنفس للعم الشقيق، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
    }
    // 10. Consanguine Paternal Uncles
    else if (input.consanguineUnclesCount > 0 && !blockedStatus['consanguineUncles'].blocked) {
      activeAsabahId = 'consanguineUncles_asabah';
      asabahDistributed = true;
      finalSeham['consanguineUncles'] = remainingSeham;
      asabahExplanation = `التعصيب بالنفس للعم لأب، يأخذ باقي التركة وهو ${remainingSeham} سهام من 24 بالتساوي.`;
    }
  }

  // --- Al-Radd (الرد) ---
  // If the sum of Fard seham is less than 24, AND there are NO active Asabah heirs
  let spouseShare = 0;
  let nonSpouseFardSum = 0;
  const nonSpouseKeys: string[] = [];

  if (!hasAwl && !asabahDistributed && remainingSeham > 0) {
    hasRadd = true;
    
    // Spouse shares are never increased by Al-Radd
    if (input.husband) spouseShare = finalSeham['husband'] || 0;
    if (input.wivesCount > 0) spouseShare = finalSeham['spouses'] || 0;
    
    // Calculate sum of other Fard heirs
    for (const key in finalSeham) {
      if (key !== 'husband' && key !== 'spouses') {
        nonSpouseFardSum += finalSeham[key];
        nonSpouseKeys.push(key);
      }
    }

    if (nonSpouseFardSum > 0) {
      // Math of Radd:
      // If there is a spouse:
      // Spouse gets spouseShare/24.
      // Other heirs share the remaining portion (24 - spouseShare)/24 in proportion to their initial Fard shares (nonSpouseKeys).
      // Let's adjust their seham!
      const remainderForRadd = 24 - spouseShare;
      
      for (const key of nonSpouseKeys) {
        const initialShare = finalSeham[key];
        // Adjusted share:
        finalSeham[key] = (initialShare / nonSpouseFardSum) * remainderForRadd;
        
        // Append Radd explanation
        const oldExplain = explanations[key] || '';
        explanations[key] = `${oldExplain.replace(/فرضاً.*/, 'فرضاً ورداً')} (تمت زيادة النصيب بالرد لعدم وجود عصبة للميت).`;
      }
    } else {
      // If there are no other Fard heirs besides the spouse, does it go to the spouse?
      // Classical Islamic jurisprudence: The spouse does not get Radd, the remainder goes to Beit Al-Mal (بيت مال المسلمين) or to more distant relatives (ذوي الأرحام).
      // We can represent this as "باقي التركة يذهب لبيت المال أو ذوي الأرحام".
      // Let's leave the spouse's share as is, and the rest is undistributed/goes to baitulmal.
    }
  }

  // Build the final Heirs List with their actual values
  // We can scale up decimals or float values to show integers if possible, but let's calculate exact percentages and cash values first.
  
  // Let's populate the Heir Results list
  const addHeirResult = (
    id: keyof HeirInput | 'spouses' | 'sons' | 'daughters' | 'fullBrothers' | 'fullSisters' | 'consanguineBrothers' | 'consanguineSisters' | 'uterineSiblings' | 'sonsSons' | 'sonsDaughters' | 'fullUncles' | 'consanguineUncles',
    name: string,
    count: number,
    status: HeirStatus,
    rawSeham: number,
    customExplain?: string
  ) => {
    if (count <= 0) return;
    
    const decimalShare = rawSeham / 24;
    const valueShare = decimalShare * netEstate;
    
    let shareText = '';
    if (status === 'blocked') {
      shareText = 'محجوب';
    } else if (status === 'none') {
      shareText = 'لا يرث';
    } else if (status === 'taseeb') {
      shareText = 'عصبة';
    } else {
      // Fard
      shareText = simplifyFraction(Math.round(rawSeham * 1000) / 1000, 24);
    }

    const individualShareValue = valueShare / count;
    const individualShareFractionText = count > 1 && status !== 'blocked' ? simplifyFraction(Math.round(rawSeham * 1000) / 1000, 24 * count) : shareText;

    const reasons: string[] = [];
    if (blockedStatus[id]?.blocked) {
      reasons.push(...blockedStatus[id].reasons);
    }

    heirs.push({
      id,
      name,
      status,
      shareFractionText: shareText,
      shareDecimal: decimalShare,
      shareValue: valueShare,
      seham: Math.round(rawSeham * 100) / 100,
      blockedBy: reasons.length > 0 ? reasons : undefined,
      reason: customExplain || explanations[id] || '',
      count,
      individualShareValue,
      individualShareFractionText,
    });
  };

  // 1. Husband
  if (input.husband) {
    addHeirResult('husband', 'الزوج', 1, 'fard', finalSeham['husband'] || 0);
  }

  // 2. Wife/Wives
  if (input.wivesCount > 0) {
    addHeirResult('spouses', 'الزوجات', input.wivesCount, 'fard', finalSeham['spouses'] || 0);
  }

  // 3. Father
  if (hasFather) {
    const isPureAsabah = !hasMaleDescendant && !hasFemaleDescendant;
    addHeirResult('father', 'الأب', 1, isPureAsabah ? 'taseeb' : 'fard', finalSeham['father'] || 0);
  }

  // 4. Mother
  if (hasMother) {
    addHeirResult('mother', 'الأم', 1, 'fard', finalSeham['mother'] || 0);
  }

  // 5. Grandfather
  if (input.grandfather) {
    const isBlocked = blockedStatus['grandfather'].blocked;
    const isPureAsabah = !hasMaleDescendant && !hasFemaleDescendant;
    addHeirResult(
      'grandfather',
      'الجد (أب الأب)',
      1,
      isBlocked ? 'blocked' : (isPureAsabah ? 'taseeb' : 'fard'),
      isBlocked ? 0 : (finalSeham['grandfather'] || 0)
    );
  }

  // 6. Grandmother MotherSide
  if (input.grandmotherMotherSide) {
    const isBlocked = blockedStatus['grandmotherMotherSide'].blocked;
    addHeirResult(
      'grandmotherMotherSide',
      'الجدة لأم (أم الأم)',
      1,
      isBlocked ? 'blocked' : 'fard',
      isBlocked ? 0 : (activePaternalGrandmother ? 2 : 4) // splits the 4 seham (1/6) if both grandmother active
    );
  }

  // 7. Grandmother FatherSide
  if (input.grandmotherFatherSide) {
    const isBlocked = blockedStatus['grandmotherFatherSide'].blocked;
    addHeirResult(
      'grandmotherFatherSide',
      'الجدة لأب (أم الأب)',
      1,
      isBlocked ? 'blocked' : 'fard',
      isBlocked ? 0 : (activeMaternalGrandmother ? 2 : 4)
    );
  }

  // 8. Sons
  if (input.sonsCount > 0) {
    addHeirResult('sons', 'الأبناء', input.sonsCount, 'taseeb', finalSeham['sons'] || 0, asabahExplanation);
  }

  // 9. Daughters
  if (input.daughtersCount > 0) {
    addHeirResult(
      'daughters',
      'البنات',
      input.daughtersCount,
      daughtersIsAsabah ? 'taseeb' : 'fard',
      finalSeham['daughters'] || 0,
      daughtersIsAsabah ? asabahExplanation : undefined
    );
  }

  // 10. Son's Sons
  if (input.sonsSonsCount > 0) {
    const isBlocked = blockedStatus['sonsSons'].blocked;
    addHeirResult(
      'sonsSons',
      'أبناء الابن',
      input.sonsSonsCount,
      isBlocked ? 'blocked' : 'taseeb',
      isBlocked ? 0 : (finalSeham['sonsSons'] || 0),
      isBlocked ? 'محجوب بالابن الصلبي الأعلى درجة.' : asabahExplanation
    );
  }

  // 11. Son's Daughters
  if (input.sonsDaughtersCount > 0) {
    const isBlocked = blockedStatus['sonsDaughters'].blocked;
    addHeirResult(
      'sonsDaughters',
      'بنات الابن',
      input.sonsDaughtersCount,
      isBlocked ? 'blocked' : (sonsDaughtersIsAsabah ? 'taseeb' : 'fard'),
      isBlocked ? 0 : (finalSeham['sonsDaughters'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['sonsDaughters'].reasons.join(', ')}.` : (sonsDaughtersIsAsabah ? asabahExplanation : undefined)
    );
  }

  // 12. Full Brothers
  if (input.fullBrothersCount > 0) {
    const isBlocked = blockedStatus['fullBrothers'].blocked;
    addHeirResult(
      'fullBrothers',
      'الأخوة الأشقاء',
      input.fullBrothersCount,
      isBlocked ? 'blocked' : 'taseeb',
      isBlocked ? 0 : (finalSeham['fullBrothers'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['fullBrothers'].reasons.join(', ')}.` : asabahExplanation
    );
  }

  // 13. Full Sisters
  if (input.fullSistersCount > 0) {
    const isBlocked = blockedStatus['fullSisters'].blocked;
    addHeirResult(
      'fullSisters',
      'الأخوات الشقيقات',
      input.fullSistersCount,
      isBlocked ? 'blocked' : (fullSistersIsAsabah || fullSistersIsAsabahWithOthers ? 'taseeb' : 'fard'),
      isBlocked ? 0 : (finalSeham['fullSisters'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['fullSisters'].reasons.join(', ')}.` : undefined
    );
  }

  // 14. Consanguine Brothers
  if (input.consanguineBrothersCount > 0) {
    const isBlocked = blockedStatus['consanguineBrothers'].blocked;
    addHeirResult(
      'consanguineBrothers',
      'الأخوة لأب',
      input.consanguineBrothersCount,
      isBlocked ? 'blocked' : 'taseeb',
      isBlocked ? 0 : (finalSeham['consanguineBrothers'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['consanguineBrothers'].reasons.join(', ')}.` : asabahExplanation
    );
  }

  // 15. Consanguine Sisters
  if (input.consanguineSistersCount > 0) {
    const isBlocked = blockedStatus['consanguineSisters'].blocked;
    addHeirResult(
      'consanguineSisters',
      'الأخوات لأب',
      input.consanguineSistersCount,
      isBlocked ? 'blocked' : (consSistersIsAsabah || consSistersIsAsabahWithOthers ? 'taseeb' : 'fard'),
      isBlocked ? 0 : (finalSeham['consanguineSisters'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['consanguineSisters'].reasons.join(', ')}.` : undefined
    );
  }

  // 16. Uterine Siblings
  const totalUterineCount = input.uterineBrothersCount + input.uterineSistersCount;
  if (totalUterineCount > 0) {
    const isBlocked = blockedStatus['uterineSiblings'].blocked;
    addHeirResult(
      'uterineSiblings',
      'الأخوة لأم',
      totalUterineCount,
      isBlocked ? 'blocked' : 'fard',
      isBlocked ? 0 : (finalSeham['uterineSiblings'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['uterineSiblings'].reasons.join(', ')}.` : undefined
    );
  }

  // 17. Full Paternal Uncles
  if (input.fullUnclesCount > 0) {
    const isBlocked = blockedStatus['fullUncles'].blocked;
    addHeirResult(
      'fullUncles',
      'الأعمام الأشقاء',
      input.fullUnclesCount,
      isBlocked ? 'blocked' : 'taseeb',
      isBlocked ? 0 : (finalSeham['fullUncles'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['fullUncles'].reasons.join(', ')}.` : undefined
    );
  }

  // 18. Consanguine Paternal Uncles
  if (input.consanguineUnclesCount > 0) {
    const isBlocked = blockedStatus['consanguineUncles'].blocked;
    addHeirResult(
      'consanguineUncles',
      'الأعمام لأب',
      input.consanguineUnclesCount,
      isBlocked ? 'blocked' : 'taseeb',
      isBlocked ? 0 : (finalSeham['consanguineUncles'] || 0),
      isBlocked ? `محجوب بـ: ${blockedStatus['consanguineUncles'].reasons.join(', ')}.` : undefined
    );
  }

  // Determine standard base of the matter and adjusting for Awl/Radd
  let originalBase = 24;
  let finalCalculatedBase = finalBase;

  // Let's calculate the traditional base of the matter for classical presentation.
  // Traditional bases: 2, 3, 4, 6, 8, 12, 24.
  // If we can simplify all active heirs' seham and the base by their GCD, we do so.
  const activeHeirSehams = heirs
    .filter(h => h.status !== 'blocked' && h.status !== 'none' && h.seham > 0)
    .map(h => Math.round(h.seham * 100)); // scale up to integer for GCD calculation if float
  
  if (activeHeirSehams.length > 0) {
    const scaledBase = Math.round(finalBase * 100);
    let commonGCD = scaledBase;
    for (const s of activeHeirSehams) {
      commonGCD = getGCD(commonGCD, s);
    }
    // Simplify base if GCD > 100
    // GCD of 100 means they were integers originally. Let's find real divisor:
    const divisor = commonGCD / 100;
    if (divisor >= 1) {
      originalBase = 24 / divisor;
      finalCalculatedBase = finalBase / divisor;
      
      // Update seham for all heirs in simplified form
      for (const h of heirs) {
        if (h.status !== 'blocked' && h.status !== 'none') {
          h.seham = h.seham / divisor;
        }
      }
    }
  }

  // Clean float issues if any
  heirs.forEach(h => {
    h.seham = Math.round(h.seham * 1000) / 1000;
    h.shareValue = Math.round(h.shareValue * 100) / 100;
    h.individualShareValue = Math.round(h.individualShareValue * 100) / 100;
  });

  return {
    deceasedGender: input.husband ? 'female' : 'male',
    totalEstate,
    debts,
    willExpenses,
    netEstate,
    originalBase: Math.round(originalBase * 100) / 100,
    finalBase: Math.round(finalCalculatedBase * 100) / 100,
    heirs,
    hasAwl,
    hasRadd,
  };
}
