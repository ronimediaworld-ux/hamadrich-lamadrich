// לוח פרשות השבוע — נוסח ארץ ישראל. שבת (YYYY-MM-DD) → שם הפרשה.
// ממולא לשנת תשפ"ז: ספר בראשית ותחילת שמות (אוקטובר 2026 – פברואר 2027).
// לתאריכים שאינם בלוח מוחזר null, ועמוד הבית מציג קישור כללי לכל פעולות פרשת השבוע.
// כדי להרחיב — מוסיפים שורות לפי אותו מבנה.

interface ParshaEntry {
  date: string;
  parsha: string;
}

const SCHEDULE: ParshaEntry[] = [
  { date: '2026-10-10', parsha: 'בראשית' },
  { date: '2026-10-17', parsha: 'נח' },
  { date: '2026-10-24', parsha: 'לך לך' },
  { date: '2026-10-31', parsha: 'וירא' },
  { date: '2026-11-07', parsha: 'חיי שרה' },
  { date: '2026-11-14', parsha: 'תולדות' },
  { date: '2026-11-21', parsha: 'ויצא' },
  { date: '2026-11-28', parsha: 'וישלח' },
  { date: '2026-12-05', parsha: 'וישב' },
  { date: '2026-12-12', parsha: 'מקץ' },
  { date: '2026-12-19', parsha: 'ויגש' },
  { date: '2026-12-26', parsha: 'ויחי' },
  { date: '2027-01-02', parsha: 'שמות' },
  { date: '2027-01-09', parsha: 'וארא' },
  { date: '2027-01-16', parsha: 'בא' },
  { date: '2027-01-23', parsha: 'בשלח' },
  { date: '2027-01-30', parsha: 'יתרו' },
  { date: '2027-02-06', parsha: 'משפטים' },
];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// השבת הקרובה (או היום, אם היום שבת) — היא ה"פרשה של השבוע" מיום ראשון עד שבת.
function comingSaturdayISO(now: Date): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysUntilSaturday = (6 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  return toISO(d);
}

export function getCurrentParsha(now: Date = new Date()): string | null {
  const target = comingSaturdayISO(now);
  return SCHEDULE.find((e) => e.date === target)?.parsha ?? null;
}
