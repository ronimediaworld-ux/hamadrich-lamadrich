// הדפסה שעובדת בשני העולמות:
// - באתר האמיתי — מוריד ישר קובץ HTML מוכן להדפסה למחשב (הורדת קובץ אמיתית של הדפדפן, לא חלון print שיכול "להיבלע").
//   הקובץ נפתח מוכן לחלון הדפסה של הדפדפן אוטומטית כשפותחים אותו.
// - בתוך תצוגת הדגמה של Claude (Artifact) — הורדת קובץ ישירה חסומה ב-iframe, אז משתמשים ב-API של Claude להורדה.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// צבע קבוע לכל סוג כותרת (פתיחה/משחק/מתודה/דיון...) — כדי שהעין תזהה מייד איזה שלב זה, בלי לקרוא את המילה.
const HEADER_COLORS: [RegExp, string][] = [
  [/פתיחה/, '#1D3F54'], // sky-ink
  [/(משחק|מטרות|מטרה)/, '#3E5219'], // lime-ink
  [/(מתודה|תוכן)/, '#6E1F3E'], // magenta-ink
  [/(קטע קריאה|קטע חזק|מקור|טיפ)/, '#7A3712'], // flame-ink
  [/(דיון|שאלות)/, '#8A6D1D'], // gold ink
  [/סיכום/, '#1F6E63'], // teal ink
];

function headerColor(headerText: string): string {
  const hit = HEADER_COLORS.find(([re]) => re.test(headerText));
  return hit ? hit[1] : '#7A3712';
}

// שורת "1. פתיחה:" בתחילת שורה — הופכים את התחילית למודגשת ובצבע קבוע לפי סוג השלב, כדי שהמסמך המודפס יראה מאורגן וכיף לעין כמו באתר.
function formatBody(bodyText: string): string {
  return bodyText
    .split('\n')
    .map((line) => {
      const safeLine = escapeHtml(line);
      const m = safeLine.match(/^(\d+\.\s[^:]+:)(.*)$/);
      if (m) return `<strong style="color:${headerColor(m[1])}">${m[1]}</strong>${m[2]}`;
      if (/^[•\-]\s/.test(line)) return `<span class="bullet">${safeLine}</span>`;
      return safeLine;
    })
    .join('\n');
}

// לוגו "המדריך למדריך" — אותו ה-SVG של המסקוט מהאתר, משוכפל כאן כי הקובץ המודפס עומד בפני עצמו.
const MASCOT_SVG = `<svg width="34" height="34" viewBox="0 0 80 80" aria-hidden="true">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#F2C85B"/><stop offset="100%" stop-color="#D96A2B"/>
  </linearGradient></defs>
  <path d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z" fill="url(#g)" stroke="#241C11" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="32" cy="52" r="4" fill="#241C11"/><circle cx="50" cy="52" r="4" fill="#241C11"/>
  <path d="M32 62c3 3 13 3 16 0" stroke="#241C11" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>`;

export function buildPrintableHtml(title: string, bodyText: string): string {
  const safeTitle = escapeHtml(title);
  const printedOn = new Date().toLocaleDateString('he-IL');
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@600;800&family=Heebo:wght@400;500;700&display=swap');
  :root { --bg:#FBF9F2; --paper:#FFFEFA; --ink:#241C11; --ink-soft:#5B4E3C; --ink-faint:#8C7F6B; --line:#E4DBC8; --flame:#D96A2B; --flame-ink:#7A3712; --flame-tint:#FBE4D2; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: 'Heebo', Arial, sans-serif; direction: rtl; }
  .sheet { max-width: 720px; margin: 0 auto; background: var(--paper); padding: 30px 34px 40px; }
  .brand { display: flex; align-items: center; gap: 10px; padding-bottom: 14px; border-bottom: 3px solid var(--ink); margin-bottom: 22px; }
  .brand-name { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 18px; }
  h1 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 26px; line-height: 1.3; margin: 0 0 22px; color: var(--ink); }
  .content { font-size: 15.5px; line-height: 1.9; white-space: pre-line; }
  .content strong { color: var(--flame-ink); }
  .bullet { display: block; padding-inline-start: 4px; }
  .footer { margin-top: 34px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 12px; color: var(--ink-faint); display: flex; justify-content: space-between; }
  @media print {
    body { background: var(--paper); }
    .sheet { padding: 0; max-width: none; }
    .footer { position: fixed; bottom: 0; left: 34px; right: 34px; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="brand">${MASCOT_SVG}<span class="brand-name">המדריך למדריך</span></div>
  <h1>${safeTitle}</h1>
  <div class="content">${formatBody(bodyText)}</div>
  <div class="footer"><span>המדריך למדריך</span><span>הודפס בתאריך ${printedOn}</span></div>
</div>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 300); });</script>
</body>
</html>`;
}

// מוריד קובץ אמיתית דרך הדפדפן (עובד רק כשהדף לא רץ בתוך iframe מבודד כמו Artifact).
function downloadHtmlFile(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

interface ClaudeDownloadsNamespace {
  save: (req: { filename: string; data: string }) => Promise<{ status: 'saved' | 'delivered' }>;
}
interface ClaudeGlobal {
  use: (name: string) => Promise<ClaudeDownloadsNamespace | null>;
}

export type PrintOutcome = 'printed' | 'downloaded' | 'declined' | 'unavailable';

// בתוך תצוגת הדגמה של Claude (window.claude קיים) — משתמשים ב-API של Claude, כי הורדת קובץ ישירה חסומה שם.
// באתר האמיתי — מורידים ישר קובץ, בלי לעבור דרך חלון print של הדף המקורי.
export async function offerPrint(filename: string, title: string, bodyText: string): Promise<PrintOutcome> {
  const html = buildPrintableHtml(title, bodyText);
  const claude = (window as unknown as { claude?: ClaudeGlobal }).claude;
  if (claude?.use) {
    try {
      const downloads = await claude.use('downloads');
      if (downloads) {
        await downloads.save({ filename, data: html });
        return 'downloaded';
      }
    } catch (err) {
      const code = (err as { code?: string } | undefined)?.code;
      if (code === 'declined') return 'declined';
      // כל שגיאה אחרת (לא זמין, לא אושר וכו') — ננסה הורדה ישירה כגיבוי
    }
  }
  try {
    downloadHtmlFile(filename, html);
    return 'downloaded';
  } catch {
    return 'unavailable';
  }
}
