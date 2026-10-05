// לוח פרשות השבוע — נוסח ארץ ישראל. שבת (YYYY-MM-DD) → שם הפרשה.
// ממולא מ-2026 עד סוף 2028 (מקור: Hebcal, לוח ארץ ישראל). שבתות חג שבהן אין פרשה — מוחזר null.
// פרשות כפולות מופיעות עם מקף (למשל "ויקהל-פקודי"), ו-getCurrentParshaNames מחזיר כל אחת בנפרד.
// כדי להרחיב — מוסיפים שורות לפי אותו מבנה.

interface ParshaEntry {
  date: string;
  parsha: string;
}

const SCHEDULE: ParshaEntry[] = [
  { date: '2026-09-05', parsha: 'נצבים־וילך' },
  { date: '2026-09-19', parsha: 'האזינו' },
  { date: '2026-10-10', parsha: 'בראשית' },
  { date: '2026-10-17', parsha: 'נח' },
  { date: '2026-10-24', parsha: 'לך־לך' },
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
  { date: '2027-02-13', parsha: 'תרומה' },
  { date: '2027-02-20', parsha: 'תצוה' },
  { date: '2027-02-27', parsha: 'כי תשא' },
  { date: '2027-03-06', parsha: 'ויקהל' },
  { date: '2027-03-13', parsha: 'פקודי' },
  { date: '2027-03-20', parsha: 'ויקרא' },
  { date: '2027-03-27', parsha: 'צו' },
  { date: '2027-04-03', parsha: 'שמיני' },
  { date: '2027-04-10', parsha: 'תזריע' },
  { date: '2027-04-17', parsha: 'מצרע' },
  { date: '2027-05-01', parsha: 'אחרי מות' },
  { date: '2027-05-08', parsha: 'קדשים' },
  { date: '2027-05-15', parsha: 'אמור' },
  { date: '2027-05-22', parsha: 'בהר' },
  { date: '2027-05-29', parsha: 'בחקתי' },
  { date: '2027-06-05', parsha: 'במדבר' },
  { date: '2027-06-12', parsha: 'נשא' },
  { date: '2027-06-19', parsha: 'בהעלתך' },
  { date: '2027-06-26', parsha: 'שלח־לך' },
  { date: '2027-07-03', parsha: 'קורח' },
  { date: '2027-07-10', parsha: 'חוקת' },
  { date: '2027-07-17', parsha: 'בלק' },
  { date: '2027-07-24', parsha: 'פינחס' },
  { date: '2027-07-31', parsha: 'מטות־מסעי' },
  { date: '2027-08-07', parsha: 'דברים' },
  { date: '2027-08-14', parsha: 'ואתחנן' },
  { date: '2027-08-21', parsha: 'עקב' },
  { date: '2027-08-28', parsha: 'ראה' },
  { date: '2027-09-04', parsha: 'שופטים' },
  { date: '2027-09-11', parsha: 'כי־תצא' },
  { date: '2027-09-18', parsha: 'כי־תבוא' },
  { date: '2027-09-25', parsha: 'נצבים־וילך' },
  { date: '2027-10-09', parsha: 'האזינו' },
  { date: '2027-10-30', parsha: 'בראשית' },
  { date: '2027-11-06', parsha: 'נח' },
  { date: '2027-11-13', parsha: 'לך־לך' },
  { date: '2027-11-20', parsha: 'וירא' },
  { date: '2027-11-27', parsha: 'חיי שרה' },
  { date: '2027-12-04', parsha: 'תולדות' },
  { date: '2027-12-11', parsha: 'ויצא' },
  { date: '2027-12-18', parsha: 'וישלח' },
  { date: '2027-12-25', parsha: 'וישב' },
  { date: '2028-01-01', parsha: 'מקץ' },
  { date: '2028-01-08', parsha: 'ויגש' },
  { date: '2028-01-15', parsha: 'ויחי' },
  { date: '2028-01-22', parsha: 'שמות' },
  { date: '2028-01-29', parsha: 'וארא' },
  { date: '2028-02-05', parsha: 'בא' },
  { date: '2028-02-12', parsha: 'בשלח' },
  { date: '2028-02-19', parsha: 'יתרו' },
  { date: '2028-02-26', parsha: 'משפטים' },
  { date: '2028-03-04', parsha: 'תרומה' },
  { date: '2028-03-11', parsha: 'תצוה' },
  { date: '2028-03-18', parsha: 'כי תשא' },
  { date: '2028-03-25', parsha: 'ויקהל־פקודי' },
  { date: '2028-04-01', parsha: 'ויקרא' },
  { date: '2028-04-08', parsha: 'צו' },
  { date: '2028-04-22', parsha: 'שמיני' },
  { date: '2028-04-29', parsha: 'תזריע־מצרע' },
  { date: '2028-05-06', parsha: 'אחרי מות־קדשים' },
  { date: '2028-05-13', parsha: 'אמור' },
  { date: '2028-05-20', parsha: 'בהר־בחקתי' },
  { date: '2028-05-27', parsha: 'במדבר' },
  { date: '2028-06-03', parsha: 'נשא' },
  { date: '2028-06-10', parsha: 'בהעלתך' },
  { date: '2028-06-17', parsha: 'שלח־לך' },
  { date: '2028-06-24', parsha: 'קורח' },
  { date: '2028-07-01', parsha: 'חוקת' },
  { date: '2028-07-08', parsha: 'בלק' },
  { date: '2028-07-15', parsha: 'פינחס' },
  { date: '2028-07-22', parsha: 'מטות־מסעי' },
  { date: '2028-07-29', parsha: 'דברים' },
  { date: '2028-08-05', parsha: 'ואתחנן' },
  { date: '2028-08-12', parsha: 'עקב' },
  { date: '2028-08-19', parsha: 'ראה' },
  { date: '2028-08-26', parsha: 'שופטים' },
  { date: '2028-09-02', parsha: 'כי־תצא' },
  { date: '2028-09-09', parsha: 'כי־תבוא' },
  { date: '2028-09-16', parsha: 'נצבים־וילך' },
  { date: '2028-09-23', parsha: 'האזינו' },
  { date: '2028-10-14', parsha: 'בראשית' },
  { date: '2028-10-21', parsha: 'נח' },
  { date: '2028-10-28', parsha: 'לך־לך' },
  { date: '2028-11-04', parsha: 'וירא' },
  { date: '2028-11-11', parsha: 'חיי שרה' },
  { date: '2028-11-18', parsha: 'תולדות' },
  { date: '2028-11-25', parsha: 'ויצא' },
  { date: '2028-12-02', parsha: 'וישלח' },
  { date: '2028-12-09', parsha: 'וישב' },
  { date: '2028-12-16', parsha: 'מקץ' },
  { date: '2028-12-23', parsha: 'ויגש' },
  { date: '2028-12-30', parsha: 'ויחי' },
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

const DOUBLE = new Set(['אחרי מות־קדשים', 'בהר־בחקתי', 'ויקהל־פקודי', 'מטות־מסעי', 'נצבים־וילך', 'תזריע־מצרע']);
const ALIAS: Record<string, string> = {
  'בהעלתך': 'בהעלותך', 'מצרע': 'מצורע', 'קדשים': 'קדושים', 'בחקתי': 'בחוקותי', 'שלח־לך': 'שלח',
  'לך־לך': 'לך לך', 'כי־תשא': 'כי תשא', 'כי־תבוא': 'כי תבוא', 'כי־תצא': 'כי תצא',
};

// שם פרשה מהלוח → שמות הפרשות בכתיב של התגיות באתר (פרשה כפולה → שתי פרשות).
function toTagNames(raw: string): string[] {
  const parts = DOUBLE.has(raw) ? raw.split('־') : [raw];
  return parts.map((p) => ALIAS[p] ?? p);
}

function currentEntry(now: Date): ParshaEntry | undefined {
  const target = comingSaturdayISO(now);
  return SCHEDULE.find((e) => e.date === target);
}

// לתצוגה: "ויקהל-פקודי" לשבת עם פרשה כפולה.
export function getCurrentParsha(now: Date = new Date()): string | null {
  const e = currentEntry(now);
  return e ? toTagNames(e.parsha).join('-') : null;
}

// להתאמה לתגיות של הפעולות: ["ויקהל", "פקודי"].
export function getCurrentParshaNames(now: Date = new Date()): string[] {
  const e = currentEntry(now);
  return e ? toTagNames(e.parsha) : [];
}

// כל הפרשיות לפי ספרים, בכתיב של התגיות באתר (לאינדקס "פעולות לכל פרשה").
export const PARSHIOT_BY_BOOK: { book: string; names: string[] }[] = [
  { book: 'בראשית', names: ['בראשית', 'נח', 'לך לך', 'וירא', 'חיי שרה', 'תולדות', 'ויצא', 'וישלח', 'וישב', 'מקץ', 'ויגש', 'ויחי'] },
  { book: 'שמות', names: ['שמות', 'וארא', 'בא', 'בשלח', 'יתרו', 'משפטים', 'תרומה', 'תצוה', 'כי תשא', 'ויקהל', 'פקודי'] },
  { book: 'ויקרא', names: ['ויקרא', 'צו', 'שמיני', 'תזריע', 'מצורע', 'אחרי מות', 'קדושים', 'אמור', 'בהר', 'בחוקותי'] },
  { book: 'במדבר', names: ['במדבר', 'נשא', 'בהעלותך', 'שלח', 'קורח', 'חוקת', 'בלק', 'פינחס', 'מטות', 'מסעי'] },
  { book: 'דברים', names: ['דברים', 'ואתחנן', 'עקב', 'ראה', 'שופטים', 'כי תצא', 'כי תבוא', 'נצבים', 'וילך', 'האזינו', 'וזאת הברכה'] },
];
