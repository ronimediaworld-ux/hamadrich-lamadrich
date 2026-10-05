// הדפסה שעובדת בשני העולמות:
// - באתר האמיתי — מוריד ישר קובץ HTML מוכן להדפסה למחשב (הורדת קובץ אמיתית של הדפדפן, לא חלון print שיכול "להיבלע").
//   הקובץ נפתח מוכן לחלון הדפסה של הדפדפן אוטומטית כשפותחים אותו.
// - בתוך תצוגת הדגמה של Claude (Artifact) — הורדת קובץ ישירה חסומה ב-iframe, אז משתמשים ב-API של Claude להורדה.
//
// עיצוב: כל שלב במהלך הפעולה (פתיחה/משחק/דיון/...) מקבל כותרת עם פס צבע קבוע לפי סוג השלב.
// קטעי קריאה, קטעים חזקים, וצ'ופרים "יוצאים" מתוך הזרימה הראשית והופכים לעמוד נספח מעוצב בסוף הקובץ.

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- זיהוי וסיווג כותרות שלב מתוך הטקסט השטוח (שמגיע מ-contentText.ts) ---

type SectionKind = 'open' | 'game' | 'link' | 'reading' | 'discussion' | 'activity' | 'summary' | 'bonus' | 'meta';

// רק כותרות "נקיות" (שורה משלהן, לא שורת מטא-דאטה צפופה כמו "גיל | משך | מקום") מקבלות שבב כותרת —
// תואם בדיוק למה שבקובץ העיצוב שהתקבל כן קיבל שבב ("מטרות:", "הערות למדריך:", "טיפ:") לעומת מה שנשאר טקסט רגיל ("גיל:", "ציוד:", "מקור חיצוני:").
const BARE_META_LABELS = new Set([
  'מטרות', 'מהלך הפעולה', 'שאלות לדיון', 'שאלות נוספות', 'הערות למדריך', 'טיפ',
  'לקחת מזה', 'איך עושים', 'איך משתמשים בזה בפעולה', 'איך משתמשים',
  'מתאים ל', 'תקציב', 'מה כדאי לעשות', 'ממה כדאי להימנע',
]);

function classify(label: string): SectionKind {
  const l = label.trim();
  if (/צ[׳']ופר|צופר/.test(l)) return 'bonus';
  if (/קטע קריאה|קטע חזק|הרחבה|^מקור/.test(l)) return 'reading';
  if (/פתיחה/.test(l)) return 'open';
  if (/משחק/.test(l)) return 'game';
  if (/חיבור|הסבר/.test(l)) return 'link';
  if (/דיון|שאלות/.test(l)) return 'discussion';
  if (/סיכום|לקחת מזה/.test(l)) return 'summary';
  if (/שיתוף|תרגיל|משימה|מתודה|פעילות|תוכן/.test(l)) return 'activity';
  if (BARE_META_LABELS.has(l)) return 'meta';
  return 'activity';
}

const KIND_COLOR: Record<SectionKind, string> = {
  open: '#C85B2A',
  game: '#2F7D6A',
  link: '#6B5AA6',
  reading: '#A64D79',
  discussion: '#356E9A',
  activity: '#B17824',
  summary: '#8A4D2A',
  bonus: '#B35C3C',
  meta: '#65725F',
};

interface Section {
  headerRaw: string; // "2. משחק מוכר 1 — חבושים" (בלי המספר) / "מטרות"
  label: string; // הכותרת בלבד, בלי המספר
  numbered: boolean;
  plain?: boolean; // שורת מידע (כמו "מקור חיצוני:") שמפרידה בין שלבים אבל לא מקבלת שבב כותרת
  kind: SectionKind;
  body: string; // שאר השורות ששייכות לשלב הזה (כולל טקסט שהיה על אותה שורה אחרי נקודתיים)
}

// שורות "מקור חיצוני:" / "מקור:" תמיד מפסיקות את השלב הנוכחי (כדי שלא "ייבלעו" לתוך קטע קריאה/צ'ופר
// שהוצא לעמוד נספח), אבל מוצגות כטקסט רגיל בלי שבב — בדיוק כמו בקובץ העיצוב שהתקבל.
const PLAIN_BREAK_LABELS = new Set(['מקור חיצוני', 'מקור', 'גיל', 'ציוד', 'מערך']);

function parseSections(bodyText: string): { preamble: string; sections: Section[] } {
  const lines = bodyText.split('\n');
  const sections: Section[] = [];
  const preambleLines: string[] = [];
  let current: Section | null = null;

  function pushLine(line: string) {
    if (current) current.body += (current.body ? '\n' : '') + line;
    else preambleLines.push(line);
  }

  for (const rawLine of lines) {
    const numberedMatch = rawLine.match(/^(\d+)\.\s(.+)$/);
    const bareMatch = rawLine.match(/^([א-ת׳' ]+?):(.*)$/);

    if (numberedMatch) {
      const rest = numberedMatch[2];
      const colonIdx = rest.indexOf(':');
      const label = colonIdx === -1 ? rest : rest.slice(0, colonIdx);
      const sameLineBody = colonIdx === -1 ? '' : rest.slice(colonIdx + 1).trim();
      current = { headerRaw: rest, label, numbered: true, kind: classify(label), body: sameLineBody };
      sections.push(current);
      continue;
    }

    if (bareMatch && BARE_META_LABELS.has(bareMatch[1].trim())) {
      const label = bareMatch[1].trim();
      const sameLineBody = bareMatch[2].trim();
      current = { headerRaw: label, label, numbered: false, kind: classify(label), body: sameLineBody };
      sections.push(current);
      continue;
    }

    if (bareMatch && PLAIN_BREAK_LABELS.has(bareMatch[1].trim())) {
      current = { headerRaw: rawLine, label: '', numbered: false, plain: true, kind: 'meta', body: rawLine };
      sections.push(current);
      continue;
    }

    pushLine(rawLine);
  }

  return { preamble: preambleLines.join('\n').trim(), sections };
}

// --- עמודי נספח מעוצבים (קטע קריאה / צ'ופר) ---

interface AppendixCard {
  kind: 'reading' | 'bonus';
  kicker: string;
  cardTitle: string;
  quote: string;
  source?: string;
  link?: { text: string; url: string };
}

function extractTitleFromLabel(label: string, fallback: string): string {
  const m = label.match(/—\s*(.+)$/);
  if (m) return m[1].trim().replace(/:$/, '');
  return fallback;
}

function extractCard(section: Section, docTitle: string): AppendixCard {
  let body = section.body.trim();
  let source: string | undefined;
  let link: { text: string; url: string } | undefined;

  const linkMatch = body.match(/\n?\s*קישור:\s*(.+?)\s*—\s*(\S+)\s*$/);
  if (linkMatch) {
    link = { text: linkMatch[1].trim(), url: linkMatch[2].trim() };
    body = body.slice(0, linkMatch.index).trim();
  }

  const trailingParen = body.match(/\(([^()]{2,80})\)\s*$/);
  if (trailingParen) {
    source = trailingParen[1].trim();
    body = body.slice(0, trailingParen.index).trim();
  }

  if (section.kind === 'bonus') {
    return { kind: 'bonus', kicker: 'צ׳ופר לפעולה', cardTitle: docTitle, quote: body, source, link };
  }
  return {
    kind: 'reading',
    kicker: 'קטע קריאה לפעולה',
    cardTitle: extractTitleFromLabel(section.label, docTitle),
    quote: body,
    source,
    link,
  };
}

// --- הרכבת ה-HTML של תוכן הגוף (השלבים הרגילים, אחרי שהוצאנו קטעי קריאה/צ'ופר) ---

function renderInlineSection(section: Section, num: string): string {
  if (section.plain) return escapeHtml(section.body);
  const color = KIND_COLOR[section.kind];
  const header = `<span class="section-title" style="color:${color}">${num}${escapeHtml(section.label)}</span>`;
  const bodyHtml = section.body
    .split('\n')
    .map((line) => {
      const safe = escapeHtml(line);
      if (/^[•\-]\s/.test(line)) return `<span class="bullet">${safe}</span>`;
      return safe;
    })
    .join('\n');
  return bodyHtml ? `${header}\n${bodyHtml}` : header;
}

function renderPointer(section: Section, num: string, pageNote: string): string {
  const color = KIND_COLOR[section.kind];
  const header = `<span class="section-title" style="color:${color}">${num}${escapeHtml(section.label)}</span>`;
  return `${header}\n${escapeHtml(pageNote)}`;
}

// --- SVG הלוגו — אותו מסקוט מהאתר, משוכפל כי הקובץ המודפס עומד בפני עצמו ---
export function mascotSvg(gradId: string): string {
  return `<svg width="34" height="34" viewBox="0 0 80 80" aria-hidden="true">
  <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#F2C85B"/><stop offset="100%" stop-color="#D96A2B"/>
  </linearGradient></defs>
  <path d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z" fill="url(#${gradId})" stroke="#241C11" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="32" cy="52" r="4" fill="#241C11"/><circle cx="50" cy="52" r="4" fill="#241C11"/>
  <path d="M32 62c3 3 13 3 16 0" stroke="#241C11" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>`;
}

function renderCardPage(card: AppendixCard, printedOn: string): string {
  const kickerColor = card.kind === 'bonus' ? KIND_COLOR.bonus : KIND_COLOR.reading;
  const linkHtml = card.link
    ? `<div class="reading-source"><a href="${escapeHtml(card.link.url)}" style="color:inherit">${escapeHtml(card.link.text)} ↗</a></div>`
    : '';
  return `<div class="sheet reading-page">
  <div class="brand">${mascotSvg('g' + Math.random().toString(36).slice(2, 8))}<span class="brand-name">המדריך למדריך</span></div>
  <div class="reading-wrap">
    <div class="reading-card">
      <div class="reading-kicker" style="color:${kickerColor}">${escapeHtml(card.kicker)}</div>
      <div class="reading-title">${escapeHtml(card.cardTitle)}</div>
      <div class="reading-quote" style="border-color:${kickerColor}">${escapeHtml(card.quote)}</div>
      ${card.source ? `<div class="reading-source">(${escapeHtml(card.source)})</div>` : ''}
      ${linkHtml}
    </div>
  </div>
  <div class="footer"><span>המדריך למדריך</span><span>נספח · ${escapeHtml(printedOn)}</span></div>
</div>`;
}

export function buildPrintableHtml(title: string, bodyText: string): string {
  const safeTitle = escapeHtml(title);
  const printedOn = new Date().toLocaleDateString('he-IL');

  const { preamble, sections } = parseSections(bodyText);
  const inlineParts: string[] = [];
  const cards: AppendixCard[] = [];
  let n = 1;

  if (preamble) inlineParts.push(escapeHtml(preamble));

  for (const section of sections) {
    const isReadingPage = section.numbered && /^קטע קריאה|^קטע חזק/.test(section.label.trim());
    const isBonusPage = section.numbered && /^צ[׳']ופר$|^צופר$/.test(section.label.trim());
    const num = section.numbered ? `${n++}. ` : '';

    if (isReadingPage || isBonusPage) {
      const card = extractCard(section, title);
      cards.push(card);
      const pageNote = isBonusPage
        ? 'הצ׳ופר בעמוד המעוצב הבא.'
        : `עוברים לקטע הקריאה המעוצב שבעמוד הבא — "${card.cardTitle}".`;
      inlineParts.push(renderPointer(section, num, pageNote));
    } else {
      inlineParts.push(renderInlineSection(section, num));
    }
  }

  const contentHtml = inlineParts.join('\n\n');
  const cardPages = cards.map((c) => renderCardPage(c, printedOn)).join('\n');

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
  .bullet { display: block; padding-inline-start: 4px; }
  .footer { margin-top: 34px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 12px; color: var(--ink-faint); display: flex; justify-content: space-between; }

  .section-title {
    display: inline-block;
    font-family: 'Rubik', sans-serif;
    font-weight: 800;
    line-height: 1.35;
    margin-top: 7px;
    padding-right: 9px;
    border-right: 3px solid currentColor;
  }

  .reading-page { margin-top: 28px; min-height: 930px; display: flex; flex-direction: column; }
  .reading-page .reading-wrap { flex: 1; display: flex; align-items: center; justify-content: center; }
  .reading-card {
    width: 100%; border: 1px solid #E9D8C7; border-radius: 22px; padding: 36px 34px 34px;
    background: radial-gradient(circle at 90% 10%, rgba(217,106,43,.10), transparent 26%),
      radial-gradient(circle at 10% 90%, rgba(166,77,121,.08), transparent 28%), #FFFCF7;
    position: relative; overflow: hidden;
  }
  .reading-kicker { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .02em; margin-bottom: 10px; }
  .reading-title { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 28px; line-height: 1.35; margin: 0 0 22px; color: var(--ink); }
  .reading-quote {
    font-family: 'Rubik', sans-serif; font-weight: 700; font-size: 22px; line-height: 1.8; color: var(--flame-ink);
    padding: 18px 22px; margin: 8px 0 22px; border-right: 5px solid var(--flame);
    background: rgba(251,228,210,.62); border-radius: 14px; white-space: pre-line;
  }
  .reading-source { margin-top: 20px; font-size: 13px; color: var(--ink-faint); }

  @media print {
    body { background: var(--paper); }
    .sheet { padding: 0; max-width: none; }
    .reading-page { page-break-before: always; break-before: page; min-height: auto; margin-top: 0; }
    .footer { position: static; margin-top: 28px; }
    .reading-card { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="brand">${mascotSvg('g0')}<span class="brand-name">המדריך למדריך</span></div>
  <h1>${safeTitle}</h1>
  <div class="content">${contentHtml}</div>
  <div class="footer"><span>המדריך למדריך</span><span>הודפס בתאריך ${printedOn}</span></div>
</div>
${cardPages}
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
  return offerHtml(filename, buildPrintableHtml(title, bodyText));
}

export async function offerHtml(filename: string, html: string): Promise<PrintOutcome> {
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
