// סינון והתאמה של פעולות לפי נתונים אמיתיים (גיל, משך, מקום, סוג, ציוד), לא לפי הכותרת.
import { activities } from '../data/activities';
import type { Activity } from '../data/types';

export type ActivityKind = 'חינוכית ודיון' | 'כיפית וקלילה' | 'גיבוש והיכרות' | 'משחקים' | 'ערב גיבוש';
export const ACTIVITY_KINDS: ActivityKind[] = ['חינוכית ודיון', 'כיפית וקלילה', 'גיבוש והיכרות', 'משחקים', 'ערב גיבוש'];

// ציוד "בסיסי" שיש בכל סניף ולא נחשב ציוד שצריך להכין.
const BASIC_EQUIPMENT = /^(דפים?|עטים?|טושים?|דפים וטושים|נייר|עיפרון|פתקים?|לוח|דף ועט)$/;

export function activityKind(a: Activity): ActivityKind {
  const t = [...a.tags, ...(a.subtopics ?? [])].join(' ');
  if (a.categorySlug === 'social-nights') return 'ערב גיבוש';
  if (a.categorySlug === 'games' || a.tags.includes('משחקים')) return 'משחקים';
  if (/גיבוש|היכרות|שבירת קרח/.test(t)) return 'גיבוש והיכרות';
  if (a.depth === 'קליל' && a.energy !== 'נמוכה') return 'כיפית וקלילה';
  return 'חינוכית ודיון';
}

// "בלי ציוד" לפי המידע באתר: לא נרשם ציוד, או שכל מה שנרשם הוא ציוד בסיסי.
export function noEquipment(a: Activity): boolean {
  const eq = (a.equipment ?? []).map((e) => e.trim()).filter(Boolean);
  return eq.length === 0 || eq.every((e) => BASIC_EQUIPMENT.test(e));
}

export function fitsGrade(a: Activity, grade: number): boolean {
  return a.ageMin <= grade && grade <= a.ageMax;
}

export interface NeedNowOptions {
  grade: number; // 1-12
  minutes: number; // 20 / 30 / 40 / 60 ...
  kind: ActivityKind | 'הכל';
  noEquip: boolean;
  shabbat: boolean;
  place: 'הכל' | 'פנים' | 'חוץ';
}

export interface NeedNowResult {
  activity: Activity;
  score: number;
  reasons: string[];
  notes: string[]; // מה לא מתאים בדיוק
}

// התאמה מדורגת: קודם כל התנאים המחייבים (גיל), אחר כך קרבה במשך, סוג, מקום, ציוד ושבת.
export function findNow(o: NeedNowOptions, pool: Activity[] = activities): NeedNowResult[] {
  const out: NeedNowResult[] = [];
  for (const a of pool) {
    if (!fitsGrade(a, o.grade)) continue;
    let score = 100;
    const reasons: string[] = [`מתאימה לכיתה ${o.grade}`];
    const notes: string[] = [];

    const diff = a.duration - o.minutes;
    if (Math.abs(diff) <= 5) { score += 30; reasons.push(`${a.duration} דקות, בדיוק לזמן שלך`); }
    else if (diff < 0 && diff >= -15) { score += 18; reasons.push(`${a.duration} דקות, קצרה מעט מהזמן שלך`); }
    else if (diff < 0) { score += 6; notes.push(`רק ${a.duration} דקות, אפשר להאריך בדיון או במשחק נוסף`); }
    else if (diff <= 10) { score += 8; notes.push(`${a.duration} דקות, מעט יותר ממה שביקשת`); }
    else { score -= 25; notes.push(`${a.duration} דקות, ארוכה מהזמן שלך`); }

    if (o.kind !== 'הכל') {
      if (activityKind(a) === o.kind) { score += 25; reasons.push(activityKind(a)); }
      else { score -= 70; notes.push(`סוג: ${activityKind(a)}`); }
    }
    if (o.place !== 'הכל') {
      if (a.place === o.place || a.place === 'שניהם') { score += 8; reasons.push(`אפשר ${o.place === 'חוץ' ? 'בחוץ' : 'בפנים'}`); }
      else { score -= 15; notes.push(`מתאימה ל${a.place === 'חוץ' ? 'חוץ' : 'פנים'}`); }
    }
    if (o.noEquip) {
      if (noEquipment(a)) { score += 14; reasons.push('בלי ציוד מיוחד'); }
      else { score -= 12; notes.push(`צריך: ${a.equipment.slice(0, 2).join(', ')}`); }
    }
    if (o.shabbat) {
      if (a.shabbat !== 'חול') { score += 10; reasons.push('מתאימה לשבת'); }
      else { score -= 40; notes.push('לא מתאימה לשבת'); }
    }
    out.push({ activity: a, score, reasons, notes });
  }
  return out.sort((x, y) => y.score - x.score || y.activity.rating - x.activity.rating);
}
