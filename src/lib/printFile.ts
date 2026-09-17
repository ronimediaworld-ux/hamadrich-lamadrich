// הדפסה שעובדת בשני העולמות:
// - באתר האמיתי — מוריד ישר קובץ HTML מוכן להדפסה למחשב (הורדת קובץ אמיתית של הדפדפן, לא חלון print שיכול "להיבלע").
//   הקובץ נפתח מוכן לחלון הדפסה של הדפדפן אוטומטית כשפותחים אותו.
// - בתוך תצוגת הדגמה של Claude (Artifact) — הורדת קובץ ישירה חסומה ב-iframe, אז משתמשים ב-API של Claude להורדה.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildPrintableHtml(title: string, bodyText: string): string {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(bodyText);
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
  body { font-family: Arial, "Segoe UI", sans-serif; direction: rtl; line-height: 1.85; padding: 28px; max-width: 720px; margin: 0 auto; color: #241C11; font-size: 16px; white-space: pre-line; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>${safeBody}
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
