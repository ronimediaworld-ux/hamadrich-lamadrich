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

function scoreActivity(a: Activity, q: ParsedQuery): number {
  let score = 0;
  const haystack = [
    a.title,
    a.description,
    ...a.subtopics,
    ...a.tags,
    ...a.values,
    a.ageLabel,
  ].join(' ');

  for (const word of q.topicWords) {
    if (haystack.includes(word)) score += 2;
  }

  if (q.wantsShabbat && (a.shabbat === 'שבת' || a.shabbat === 'שניהם')) score += 2;
  if (q.wantsChol && (a.shabbat === 'חול' || a.shabbat === 'שניהם')) score += 1;
  if (q.wantsShabbat && a.shabbat === 'חול') score -= 3;

  if (q.maxDuration && a.duration <= q.maxDuration) score += 2;
  if (q.maxDuration && a.duration > q.maxDuration + 10) score -= 2;

  if (q.noEquipment && a.equipment.length === 0) score += 2;

  for (const g of q.gradeWords) {
    if (a.ageLabel.includes(g)) score += 3;
  }

  return score;
}

export function searchActivities(raw: string, limit = 6): Activity[] {
  const q = parseQuery(raw);
  const scored = activities
    .map((a) => ({ activity: a, score: scoreActivity(a, q) }))
    .filter(({ score }) => score >= 3)
    .sort((x, y) => y.score - x.score);

  return scored.slice(0, limit).map(({ activity }) => activity);
}
