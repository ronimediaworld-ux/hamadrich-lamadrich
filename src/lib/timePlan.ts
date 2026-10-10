// חישוב משך מותאם לפעולה: אף פעם לא מקטינים זמנים של שלב, רק מוותרים על שלבי הרחבה.
// שלבי ליבה (פתיחה, הדיון, ההסבר, הסיפור/הקטע והסיכום, וחוויה מרכזית אחת) נשארים תמיד.
import type { Activity, FlowStep } from '../data/types';

export interface TimedStep {
  index: number; // המקום בפעולה המקורית
  step: FlowStep;
  minutes: number;
  core: boolean;
  kind: 'opening' | 'main' | 'game' | 'discussion' | 'reading' | 'explanation' | 'summary' | 'chupar' | 'other';
}

export function stepMinutes(label: string): number | null {
  const m = label.match(/\((\d+)(?:\s*[–-]\s*(\d+))?\s*דק/);
  if (!m) return null;
  return m[2] ? Math.round((Number(m[1]) + Number(m[2])) / 2) : Number(m[1]);
}

function kindOf(label: string): TimedStep['kind'] {
  const l = label;
  if (/צ[׳']ופר/.test(l)) return 'chupar';
  if (/סיכום/.test(l)) return 'summary';
  if (/דיון|שאלות לדיון/.test(l)) return 'discussion';
  if (/קטע|סיפור|מקור|קריאה/.test(l)) return 'reading';
  if (/הסבר|חיבור|ומה זה קשור|מכאן/.test(l)) return 'explanation';
  if (/פתיחה/.test(l)) return 'opening';
  if (/משחק|חידות|תרגיל|סבב|תחנות|משימ/.test(l)) return 'game';
  return 'other';
}

// פעולה "ניתנת לתכנון זמן" אם רוב שלביה כוללים דקות. אחרת לא מציגים בורר משך (ולא ממציאים זמנים).
export function timedSteps(a: Activity): TimedStep[] | null {
  const flow = a.flow ?? [];
  if (flow.length < 3) return null;
  const mins = flow.map((s) => stepMinutes(s.label));
  const withMinutes = mins.filter((m) => m !== null).length;
  if (withMinutes < 3 || withMinutes < flow.length - 2) return null;

  const steps: TimedStep[] = flow.map((s, index) => ({ index, step: s, minutes: mins[index] ?? 0, core: false, kind: kindOf(s.label) }));
  // שלב ללא דקות (למשל "דיון" כרשימת שאלות) נחשב חלק מהשלב שלפניו ולכן לא נספר בנפרד, ונשאר עם הליבה.
  const gameLike = steps.filter((t) => (t.kind === 'game' || t.kind === 'main' || t.kind === 'other') && t.minutes > 0);
  const biggest = gameLike.sort((x, y) => y.minutes - x.minutes)[0];
  // מקור/קטע והסבר: אחד מכל סוג הוא ליבה (הארוך ביותר), האחרים הרחבה.
  const longest = (kind: TimedStep['kind']) => steps.filter((t) => t.kind === kind).sort((x, y) => y.minutes - x.minutes)[0];
  const coreReading = longest('reading');
  const coreExplanation = longest('explanation');
  for (const t of steps) {
    if (t.kind === 'opening' || t.kind === 'discussion' || t.kind === 'summary') t.core = true;
    else if (t === coreReading || t === coreExplanation) t.core = true;
    else if (t === biggest) t.core = true; // חוויה מרכזית אחת נשארת תמיד
    else if (t.minutes === 0) t.core = true; // שלב בלי דקות לא מוותרים עליו
    else t.core = false;
  }
  return steps;
}

export const sumMinutes = (steps: TimedStep[], include: Set<number>) => steps.reduce((s, t) => (include.has(t.index) ? s + t.minutes : s), 0);

export interface TimePlan {
  include: Set<number>;
  total: number;
  coreTotal: number;
  fullTotal: number;
  status: 'exact' | 'shorter' | 'longer' | 'too-short-impossible';
  message: string;
}

// בוחרים משך יעד: מוותרים על שלבי הרחבה (מהקצרים והפחות חשובים) עד שמגיעים ליעד, בלי לפגוע בליבה.
export function planForTarget(a: Activity, target: number): TimePlan | null {
  const steps = timedSteps(a);
  if (!steps) return null;
  const all = new Set(steps.map((t) => t.index));
  const fullTotal = sumMinutes(steps, all);
  const coreTotal = sumMinutes(steps, new Set(steps.filter((t) => t.core).map((t) => t.index)));
  const include = new Set(all);
  const optional = steps.filter((t) => !t.core);
  // סדר ויתור: צ'ופר, ואחר כך הארוך ביותר שלא מקצר מתחת ליעד, ובסוף הקצר ביותר.
  const order = [...optional].sort((x, y) => (x.kind === 'chupar' ? -1 : 0) - (y.kind === 'chupar' ? -1 : 0) || y.minutes - x.minutes);
  let total = fullTotal;
  while (total > target + 3 && order.length) {
    const fit = order.find((t) => include.has(t.index) && total - t.minutes >= target - 6);
    const pick = fit ?? [...order].reverse().find((t) => include.has(t.index));
    if (!pick) break;
    include.delete(pick.index);
    total -= pick.minutes;
    const i = order.indexOf(pick); if (i >= 0) order.splice(i, 1);
  }
  let status: TimePlan['status'] = 'exact';
  let message = `${total} דקות, קרוב ל־${target}.`;
  if (total > target + 3) {
    status = 'too-short-impossible';
    message = `אי אפשר להגיע ל־${target} דקות בלי לפגוע בחלקים המרכזיים של הפעולה. המינימום ההגיוני הוא ${coreTotal} דקות. אפשר לבחור פעולה קצרה יותר ב"אני צריכה פעולה עכשיו".`;
  } else if (total < target - 8) {
    status = 'longer';
    message = `הפעולה במלואה היא ${total} דקות, פחות מ־${target}. אפשר להאריך בדיון, בסבב נוסף של המשחק או בקטע קריאה.`;
  } else if (total < target - 3) {
    status = 'shorter';
    message = `${total} דקות, מעט פחות מ־${target}, וזה משאיר מרווח לדיון.`;
  }
  return { include, total, coreTotal, fullTotal, status, message };
}

// בחירה ידנית של שלבים: ליבה תמיד נכללת.
export function planForSelection(a: Activity, optionalIncluded: Set<number>): TimePlan | null {
  const steps = timedSteps(a);
  if (!steps) return null;
  const include = new Set(steps.filter((t) => t.core || optionalIncluded.has(t.index)).map((t) => t.index));
  const total = sumMinutes(steps, include);
  const coreTotal = sumMinutes(steps, new Set(steps.filter((t) => t.core).map((t) => t.index)));
  const fullTotal = sumMinutes(steps, new Set(steps.map((t) => t.index)));
  return { include, total, coreTotal, fullTotal, status: 'exact', message: `${total} דקות` };
}

// פעולה עם הזרימה שנבחרה (להצגה ולהדפסה), עם משך מעודכן.
export function applyPlan(a: Activity, plan: TimePlan): Activity {
  return { ...a, duration: plan.total, flow: (a.flow ?? []).filter((_, i) => plan.include.has(i)) };
}
