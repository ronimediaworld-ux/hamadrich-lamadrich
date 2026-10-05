import { activities } from '../data/activities';
import type { Activity } from '../data/types';

interface ParsedQuery {
  gradeWords: string[];
  wantsShabbat: boolean;
  wantsChol: boolean;
  maxDuration: number | null;
  noEquipment: boolean;
  topicWords: string[];
}

const gradePattern = /כיתה\s*([א-ת]')|([א-ת]')\s*-\s*([א-ת]')|\bי['"]?ב\b/g;
const stopWords = new Set([
  'פעולה', 'משהו', 'בנושא', 'על', 'עם', 'בלי', 'של', 'זה', 'את', 'לא', 'כן',
  'רוצה', 'צריך', 'צריכה', 'אני', 'אנחנו', 'מחפש', 'מחפשת', 'דקות', 'דקה',
  'לכיתה', 'ל', 'עבור', 'קצת', 'יותר', 'פחות',
]);

export function parseQuery(raw: string): ParsedQuery {
  const text = raw.trim();
  const gradeWords = text.match(gradePattern)?.map((m) => m.trim()) ?? [];
  const wantsShabbat = /שבת/.test(text);
  const wantsChol = /חול(?!ם)/.test(text);
  const durationMatch = text.match(/(\d{1,3})\s*דק/);
  const maxDuration = durationMatch ? Number(durationMatch[1]) : null;
  const noEquipment = /בלי ציוד|ללא ציוד|אין ציוד/.test(text);

  const topicWords = text
    .replace(/[.,!?;:"'׳״]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !stopWords.has(w) && !gradeWords.includes(w));

  return { gradeWords, wantsShabbat, wantsChol, maxDuration, noEquipment, topicWords };
}

function wordMatches(haystack: string, word: string): boolean {
  if (haystack.includes(word)) return true;
  // Hebrew has rich morphology (אמונה/אמוני/אמונית) — fall back to a shared root prefix
  if (word.length >= 4) {
    const root = word.slice(0, 4);
    if (haystack.includes(root)) return true;
  }
  return false;
}

function scoreActivity(a: Activity, q: ParsedQuery): number {
  let score = 0;
  const strongHaystack = [a.title, ...a.tags, ...a.values].join(' ');
  const weakHaystack = [a.description, ...a.subtopics, a.ageLabel].join(' ');

  let matched = 0;
  for (const word of q.topicWords) {
    if (wordMatches(strongHaystack, word)) { score += 3; matched += 1; }
    else if (wordMatches(weakHaystack, word)) { score += 1; matched += 1; }
  }
  // שאילתה עם כמה מילות נושא: לפחות שתיים מהן צריכות להופיע — אחרת כל פעולה שמזכירה מילה אחת נכנסת לתוצאות.
  if (q.topicWords.length >= 2 && matched < 2) return 0;

  if (q.wantsShabbat && (a.shabbat === 'שבת' || a.shabbat === 'שניהם')) score += 3;
  if (q.wantsChol && (a.shabbat === 'חול' || a.shabbat === 'שניהם')) score += 3;
  if (q.wantsShabbat && a.shabbat === 'חול') score -= 3;

  if (q.maxDuration && a.duration <= q.maxDuration) score += 3;
  if (q.maxDuration && a.duration > q.maxDuration + 10) score -= 2;

  if (q.noEquipment && a.equipment.length === 0) score += 3;

  for (const g of q.gradeWords) {
    if (a.ageLabel.includes(g)) score += 3;
  }

  return score;
}

function hasNoSignal(q: ParsedQuery): boolean {
  return q.topicWords.length === 0 && !q.wantsShabbat && !q.wantsChol && q.maxDuration === null && !q.noEquipment && q.gradeWords.length === 0;
}

export function searchActivities(raw: string, limit = 6): Activity[] {
  const q = parseQuery(raw);

  if (hasNoSignal(q)) {
    return [...activities].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  const scored = activities
    .map((a) => ({ activity: a, score: scoreActivity(a, q) }))
    .filter(({ score }) => score >= 3)
    .sort((x, y) => y.score - x.score);

  return scored.slice(0, limit).map(({ activity }) => activity);
}
