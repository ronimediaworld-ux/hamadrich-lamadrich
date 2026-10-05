import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';
import { methods } from '../data/methods';
import { situations } from '../data/situations';
import { quickGames } from '../data/quickGames';
import type { Activity } from '../data/types';
import { parseQuery, searchActivities } from './search';
import { queryWords } from './textFilter';

export interface SiteHit {
  group: string;
  title: string;
  snippet: string;
  url: string;
}

interface Doc extends SiteHit {
  strong: string; // כותרת ותגיות — משקל גבוה
  weak: string; // שאר הטקסט
}

const GUIDES: { id: string; title: string; snippet: string; keywords: string }[] = [
  { id: 'peula', title: 'איך בונים פעולה', snippet: 'השלד של פעולה טובה: מטרה, פתיחה, גוף, דיון וסיכום', keywords: 'לבנות פעולה מטרה פתיחה דיון סיכום מתודה להכין' },
  { id: 'maarach', title: 'איך בונים מערך', snippet: 'סדרת מפגשים שמתקדמת לאורך זמן', keywords: 'מערך סדרה מפגשים רצף' },
  { id: 'giyus', title: 'איך מגייסים חניכים', snippet: 'גיוס, פרסום והנעה לפעילות', keywords: 'גיוס חניכים פרסום לשכנע' },
  { id: 'zugot-hadracha', title: 'עבודה בזוג מדריכים', snippet: 'איך עובדים טוב עם מדריך שותף', keywords: 'זוג מדריכים שותף צוות עבודה משותפת' },
  { id: 'personal-talks', title: 'איך עושים שיחה אישית עם חניך', snippet: 'מתי, איך ומה שואלים — עם כרטיסיות שאלות להדפסה', keywords: 'שיחה אישית שיחות אישיות חניך כרטיסיות שאלות להקשיב' },
  { id: 'canva', title: 'איך מעצבים בקנבה', snippet: 'מדריך עיצוב לצ׳ופרים, כרזות וכרטיסים להדפסה', keywords: 'קנבה canva עיצוב כרזה צופר כרטיס הדפסה גופן צבעים תבנית' },
];

let cache: Doc[] | null = null;

function docs(): Doc[] {
  if (cache) return cache;
  const d: Doc[] = [];
  readings.forEach((r) => d.push({ group: 'קטעי קריאה', title: r.title, snippet: r.description, url: `/reading/${r.id}`, strong: [r.title, ...r.tags].join(' '), weak: [r.description, r.source, r.text.slice(0, 400)].join(' ') }));
  staffStudy.forEach((s) => d.push({ group: 'לימוד צוות', title: s.title, snippet: s.description, url: `/staff-study/${s.id}`, strong: [s.title, s.topic].join(' '), weak: [s.description, s.content.slice(0, 400)].join(' ') }));
  chuparim.forEach((c) => d.push({ group: 'צ׳ופרים', title: c.title, snippet: c.description, url: `/chupar/${c.id}`, strong: [c.title, c.kind].join(' '), weak: [c.description, c.tip, c.forWhom].join(' ') }));
  methods.forEach((m) => d.push({ group: 'מתודות', title: m.title, snippet: m.suitableFor, url: `/category/methods?q=${encodeURIComponent(m.title)}`, strong: [m.title, ...(m.tags ?? [])].join(' '), weak: [m.description, m.suitableFor, m.howToUse].join(' ') }));
  situations.forEach((s) => d.push({ group: 'סיטואציות בהדרכה', title: s.title, snippet: s.scenario, url: `/category/tools?q=${encodeURIComponent(s.title)}`, strong: s.title, weak: [s.scenario, ...s.approach, s.tip].join(' ') }));
  quickGames.forEach((g) => d.push({ group: 'משחקים מהירים', title: g.name, snippet: g.description, url: `/category/games?q=${encodeURIComponent(g.name)}`, strong: [g.name, g.kind].join(' '), weak: [g.description, g.needs].join(' ') }));
  GUIDES.forEach((g) => d.push({ group: 'נדבר ת׳כלס', title: g.title, snippet: g.snippet, url: `/how-to-build?guide=${g.id}`, strong: g.title, weak: g.keywords }));
  cache = d;
  return d;
}

function has(hay: string, w: string): boolean {
  const h = hay.toLowerCase();
  return h.includes(w) || (w.length >= 4 && h.includes(w.slice(0, 4)));
}

// חיפוש בכל האתר: פעולות (עם ההבנה של גיל/שבת/זמן) + כל שאר סוגי התוכן.
export function searchSite(raw: string): { activities: Activity[]; others: SiteHit[] } {
  const q = raw.trim();
  if (!q) return { activities: [], others: [] };
  const words = parseQuery(q).topicWords.flatMap((w) => queryWords(w));
  const acts = searchActivities(q, 30);
  const scored: { doc: Doc; score: number }[] = [];
  if (words.length) {
    for (const doc of docs()) {
      let score = 0;
      for (const w of words) {
        if (has(doc.strong, w)) score += 3;
        else if (has(doc.weak, w)) score += 1;
      }
      if (score >= 3) scored.push({ doc, score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return { activities: acts, others: scored.slice(0, 40).map(({ doc }) => ({ group: doc.group, title: doc.title, snippet: doc.snippet, url: doc.url })) };
}
