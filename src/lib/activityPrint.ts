// קובץ הדפסה לפעולה מלאה — בעיצוב "דף פעולה מודפס" של האתר: כותרת עם לוגו, כרטיס פרטים, שלבים ממוספרים בצבע,
// ציטוטי "המדריך אומר", הסבר למדריך, טיפ, ונספחים בעמודים נפרדים (קטע להקראה, כרטיסי משפטים לגזירה, מגנים).
import type { Activity, FlowStep } from '../data/types';
import type { Chupar } from '../data/types';
import { escapeHtml, mascotSvg } from './printFile';
import { FONT_IMPORT, SHAPES, renderCard } from './chuparDesign';

const PALETTE = ['#C85B2A', '#A64D79', '#356E9A', '#5E7B2F', '#2F7D6A', '#6B5AA6', '#8A4D2A', '#B17824'];

function stepColor(name: string, index: number): string {
  if (/פתיחה/.test(name)) return '#C85B2A';
  if (/סרטון|קליפ|הקרנ|צפייה/.test(name)) return '#356E9A';
  if (/קריאה|סיפור|עדות|קטע/.test(name)) return '#A64D79';
  if (/מתודה|תערוכה|תרגיל|משימה|פעילות/.test(name)) return '#5E7B2F';
  if (/משחק|סבב/.test(name)) return '#2F7D6A';
  if (/דיון|שאלות/.test(name)) return '#6B5AA6';
  if (/סיכום|צ[׳']ופר|מגן/.test(name)) return '#8A4D2A';
  return PALETTE[index % PALETTE.length];
}

function splitMinutes(label: string): { name: string; minutes?: string } {
  const m = label.match(/^(.*?)\s*\((\d+)\s*דק[׳']\)\s*$/);
  return m ? { name: m[1].trim(), minutes: `${m[2]} דק׳` } : { name: label.trim() };
}

// --- טקסט גוף: פסקאות, תבליטים, ציטוט "המדריך אומר" ---
function inline(line: string): string {
  const safe = escapeHtml(line);
  const lead = safe.match(/^([א-ת׳״'"()0-9 /]{2,24}):\s(.+)$/);
  if (lead && !/^"/.test(line)) return `<b>${lead[1]}:</b> ${lead[2]}`;
  return safe;
}

function renderBody(text: string): string {
  const out: string[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) out.push(`<ul>${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`);
    bullets = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const bullet = line.match(/^[•-]\s+(.*)$/);
    if (bullet) { bullets.push(inline(bullet[1])); continue; }
    flush();
    const q = line.match(/^(.*?:\s*)?"(.{70,})"\.?$/);
    if (q) {
      if (q[1]) out.push(`<p>${inline(q[1].trim())}</p>`);
      out.push(`<blockquote>"${escapeHtml(q[2])}"</blockquote>`);
      continue;
    }
    out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return out.join('');
}

function stepsOf(a: Activity): FlowStep[] {
  if (a.flow && a.flow.length) return a.flow;
  const s: FlowStep[] = [{ label: 'פתיחה', body: a.opening }];
  if (a.game) s.push({ label: 'משחק', body: a.game });
  s.push({ label: 'מתודה', body: a.method });
  if (a.reading) s.push({ label: `קטע קריאה — ${a.reading.label}`, body: a.reading.text });
  if (a.discussion?.length) s.push({ label: 'דיון', items: a.discussion });
  if (a.questions?.length) s.push({ label: 'שאלות נוספות', items: a.questions });
  s.push({ label: 'סיכום', body: a.summary });
  return s;
}

function renderStep(s: FlowStep, i: number): string {
  const { name, minutes } = splitMinutes(s.label);
  const color = stepColor(name, i);
  const items = s.items?.length ? `<ul>${s.items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : '';
  const link = s.link
    ? `<div class="linkrow">▶ <b>${escapeHtml(s.link.title)}</b> <span dir="ltr">${escapeHtml(s.link.url)}</span></div>`
    : '';
  const note = s.note ? `<p class="note">${escapeHtml(s.note)}</p>` : '';
  return `<section class="step">
  <h3><span class="num" style="background:${color}">${i + 1}</span><span style="color:${color}">${escapeHtml(name)}</span>${minutes ? `<span class="min">· ${minutes}</span>` : ''}</h3>
  <div class="step-body">${s.body ? renderBody(s.body) : ''}${items}${link}${note}</div>
</section>`;
}

// --- נספחים ---
function shieldSvg(): string {
  const dots = (y: number) => `<line x1="52" x2="248" y1="${y}" y2="${y}" stroke="#5B4E3C" stroke-width="1" stroke-dasharray="1.5 2.5"/>`;
  return `<svg viewBox="0 0 300 390" class="shield" aria-hidden="true">
  <path d="M150 6 L294 50 L294 150 Q294 300 150 384 Q6 300 6 150 L6 50 Z" fill="#fff" stroke="#D96A2B" stroke-width="4" stroke-dasharray="9 6" stroke-linejoin="round"/>
  <path d="M150 28 L272 66 L272 150 Q272 280 150 352 Q28 280 28 150 L28 66 Z" fill="#FBEADF"/>
  <text x="150" y="82" text-anchor="middle" font-family="Rubik, Heebo, sans-serif" font-weight="800" font-size="19" fill="#7A3712">המשפט שבחרתי</text>
  ${dots(106)}${dots(126)}${dots(146)}
  <text x="150" y="176" text-anchor="middle" font-family="Heebo, sans-serif" font-weight="700" font-size="13" fill="#241C11">של: ____________ ז״ל</text>
  <text x="150" y="222" text-anchor="middle" font-family="Rubik, Heebo, sans-serif" font-weight="800" font-size="19" fill="#7A3712">כוח העל שלי</text>
  ${dots(250)}${dots(272)}${dots(294)}
</svg>`;
}

function renderCards(content: string): string | null {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const cardRe = /^(\d+)\.\s+([\s\S]+?)\n—\s*(.+)$/;
  const cards: { n: string; text: string; who: string }[] = [];
  const before: string[] = [];
  const after: string[] = [];
  let blank = false;
  let seen = false;
  for (const b of blocks) {
    const m = b.match(cardRe);
    if (/^\d+\.\s*\(כרטיס ריק/.test(b)) {
      seen = true;
      blank = true;
    } else if (m) {
      seen = true;
      cards.push({ n: m[1], text: m[2].replace(/^"|"$/g, ''), who: m[3] });
    } else (seen ? after : before).push(b);
  }
  if (cards.length < 4) return null;
  const grid =
    cards
      .map((c) => `<div class="qcard"><span class="qn">${c.n}</span><div class="qt">"${escapeHtml(c.text)}"</div><div class="qw">${escapeHtml(c.who)}</div></div>`)
      .join('') +
    (blank ? `<div class="qcard blank"><span class="qn">+</span><div class="line"></div><div class="line"></div><div class="qw">שם: ____________ ז״ל</div></div>` : '');
  const intro = before.length ? `<p class="app-intro">${escapeHtml(before.join(' '))}</p>` : '';
  const src = after.length ? `<div class="sources">${after.map((x) => `<p>${inline(x)}</p>`).join('')}</div>` : '';
  return `${intro}<div class="qgrid">${grid}</div>${src}`;
}

// טקסטים לקריאה בעמודות: בלוקים מופרדים בשורה ריקה; השורה הראשונה בבלוק היא הכותרת/המקור.
function renderColumns(content: string): string {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const intro = blocks.length && !blocks[0].includes('\n') ? `<p class="app-intro">${escapeHtml(blocks.shift() as string)}</p>` : '';
  const items = blocks.map((b) => {
    const [head, ...rest] = b.split('\n');
    if (!rest.length) return `<div class="colnote">${escapeHtml(head)}</div>`;
    return `<div class="colblock"><div class="colhead">${escapeHtml(head)}</div><div class="coltext">${escapeHtml(rest.join(' '))}</div></div>`;
  });
  const notes = items.filter((i) => i.startsWith('<div class="colnote">'));
  const main = items.filter((i) => !i.startsWith('<div class="colnote">'));
  return `${intro}<div class="cols">${main.join('')}</div>${notes.join('')}`;
}

// כרטיסים לגזירה: פסקת הסבר ואז שורה לכל כרטיס (בלי מספרים, כדי לא לחשוף את הסדר).
function renderSlips(content: string): string {
  const [introBlock, ...restBlocks] = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const lines = restBlocks.join('\n').split('\n').map((l) => l.trim()).filter(Boolean);
  return `<p class="app-intro">${escapeHtml(introBlock || '')}</p><div class="slips">${lines.map((l) => {
    const [head, body] = l.split('||');
    return body ? `<div class="slip"><div><div class="slip-h">${escapeHtml(head)}</div>${escapeHtml(body)}</div></div>` : `<div class="slip">${escapeHtml(l)}</div>`;
  }).join('')}</div>`;
}

function renderAppendix(ap: { label: string; content: string }): string {
  const heading = `<h2 class="app-h"><span class="bar"></span>${escapeHtml(ap.label)}</h2>`;
  if (/המגן שלי/.test(ap.label)) {
    const first = ap.content.split('\n')[0];
    return `<section class="app page">${heading}<p class="app-intro">${escapeHtml(first)}</p><div class="shields">${shieldSvg()}${shieldSvg()}${shieldSvg()}${shieldSvg()}</div></section>`;
  }
  const cards = renderCards(ap.content);
  if (cards) return `<section class="app page">${heading}${cards}</section>`;
  if (/בעמודות/.test(ap.label)) return `<section class="app page">${heading}${renderColumns(ap.content)}</section>`;
  if (/לגזירה/.test(ap.label)) return `<section class="app page">${heading}${renderSlips(ap.content)}</section>`;
  if (/מאגר|עוד משפטים|רוצים עוד/.test(ap.label)) {
    return `<section class="app"><div class="infobox"><h4>${escapeHtml(ap.label)}</h4>${renderBody(ap.content)}</div></section>`;
  }
  return `<section class="app page">${heading}<div class="textcard">${renderBody(ap.content)}</div></section>`;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&family=Heebo:wght@400;500;700&display=swap');
  @import url('${FONT_IMPORT}');
  :root { --paper:#FBF9F2; --ink:#241C11; --soft:#4B4030; --faint:#8C7F6B; --line:#E4DBC8; --flame:#D96A2B; --flame-ink:#7A3712; --tint:#FBE4D2; }
  * { box-sizing: border-box; }
  html { background-color: var(--paper); background-image: radial-gradient(#E9E1CF 1px, transparent 1.2px); background-size: 18px 18px;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; color: var(--ink); font-family: 'Heebo', Arial, sans-serif; direction: rtl; font-size: 13.5px; line-height: 1.75; }
  .doc { max-width: 780px; margin: 0 auto; padding: 24px 28px 40px; }
  table.wrap { width: 100%; border-collapse: collapse; } table.wrap > thead { display: table-header-group; } table.wrap td { padding: 0; vertical-align: top; }
  .run { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 10px; border-bottom: 2px solid var(--ink); margin-bottom: 18px; }
  .brand { display: flex; align-items: center; gap: 9px; font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 17px; }
  .run small { font-size: 12px; color: var(--faint); }
  .crumbs { font-size: 12px; color: var(--faint); margin-bottom: 10px; }
  .crumbs b { color: var(--soft); }
  .hero { display: grid; grid-template-columns: 1.55fr 1fr; gap: 26px; align-items: start; margin-bottom: 24px; }
  .chip { display: inline-block; padding: 4px 13px; border-radius: 999px; background: var(--tint); color: var(--flame-ink); font-weight: 700; font-size: 12px; margin-bottom: 8px; }
  h1 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 34px; line-height: 1.2; margin: 0 0 10px; }
  .desc { color: var(--soft); font-size: 14px; margin: 0; }
  .meta { background: #FFFEFA; border: 1px solid var(--line); border-radius: 18px; padding: 16px 18px; font-size: 12.5px; line-height: 1.7; }
  .meta .row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
  .meta .dot { color: var(--flame); font-size: 12px; }
  .meta hr { border: 0; border-top: 1px solid var(--line); margin: 9px 0; }
  .meta p { margin: 0 0 6px; }
  .shabbat { background: #E9F1F8; border: 1px solid #B9D0E3; border-radius: 12px; padding: 9px 14px; color: #1F4A6E; margin-bottom: 20px; font-size: 13px; }
  h2.sec { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 18px; color: #B8501C; margin: 0 0 8px; }
  h2.sec::after { content: '●'; font-size: 11px; margin-inline-start: 8px; }
  ul { margin: 4px 0 8px; padding-inline-start: 20px; }
  li { margin-bottom: 2px; }
  p { margin: 0 0 6px; }
  .divider { display: flex; align-items: center; gap: 10px; color: var(--faint); font-size: 12px; margin: 18px 0 12px; }
  .divider::after { content: ''; flex: 1; border-top: 1px solid var(--line); }
  .step { margin-bottom: 14px; break-inside: avoid; }
  .step h3 { margin: 0 0 4px; font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 15.5px; display: flex; align-items: center; gap: 8px; }
  .num { flex: none; width: 21px; height: 21px; border-radius: 50%; color: #fff; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
  .min { font-family: 'Heebo', sans-serif; font-weight: 500; color: var(--faint); font-size: 11.5px; }
  .step-body { padding-inline-start: 4px; }
  blockquote { margin: 6px 0 8px; padding: 2px 14px 2px 0; border-inline-start: 3px solid #D96A2B; color: var(--ink); }
  .linkrow { margin: 6px 0; padding: 7px 12px; background: #FFFEFA; border: 1px solid var(--line); border-radius: 10px; font-size: 12.5px; }
  .linkrow span { color: var(--faint); font-size: 11px; margin-inline-start: 6px; word-break: break-all; }
  .note { color: var(--faint); font-size: 12px; }
  .guide li { margin-bottom: 5px; }
  .tipbox { margin-top: 14px; background: #FBF0CC; border: 1px solid #E8C86A; border-radius: 14px; padding: 11px 16px; font-size: 13px; break-inside: avoid; }
  .src { margin: 10px 0 0; font-size: 12.5px; }
  .page { break-before: page; page-break-before: always; }
  .app-h { display: flex; align-items: center; gap: 8px; font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 18px; margin: 0 0 12px; }
  .app-h .bar { width: 9px; height: 22px; border-radius: 5px; background: var(--flame); }
  .app-intro { text-align: center; color: var(--faint); font-size: 12px; margin: 0 0 12px; }
  .textcard { border: 2px solid var(--ink); border-radius: 22px; background: #FFFEFA; padding: 22px 26px; font-size: 14.5px; line-height: 1.95; }
  .textcard p { margin-bottom: 9px; }
  .infobox { margin-top: 18px; background: #DDEAF3; border-radius: 16px; padding: 14px 20px; break-inside: avoid; font-size: 13px; }
  .infobox h4 { margin: 0 0 6px; font-family: 'Rubik', sans-serif; font-weight: 800; color: #1F3F5C; font-size: 14px; }
  .cols { column-count: 2; column-gap: 26px; }
  .colblock { break-inside: avoid; margin: 0 0 14px; padding: 12px 16px; border: 1px solid var(--line); border-radius: 14px; background: #FFFEFA; }
  .colhead { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 13px; color: var(--flame-ink); margin-bottom: 4px; }
  .coltext { font-size: 15px; line-height: 1.9; }
  .colnote { margin-top: 10px; font-size: 12px; color: var(--faint); }
  .slips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .slip { border: 2px dashed #E6B94F; border-radius: 12px; background: #FFFEFA; padding: 16px 14px; min-height: 84px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 14.5px; line-height: 1.7; break-inside: avoid; }
  .slip-h { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 15px; color: var(--flame-ink); margin-bottom: 6px; }
  .qgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .qcard { position: relative; min-height: 118px; border: 2px dashed #E6B94F; border-radius: 14px; background: #FFFEFA; padding: 22px 16px 14px; text-align: center; display: flex; flex-direction: column; justify-content: center; gap: 6px; break-inside: avoid; }
  .qn { position: absolute; top: 7px; left: 11px; font-size: 11px; font-weight: 700; color: var(--faint); }
  .qt { font-family: 'Rubik', sans-serif; font-weight: 700; font-size: 15.5px; line-height: 1.5; }
  .qw { color: #7A3712; font-weight: 700; font-size: 12px; }
  .qcard.blank .line { border-top: 1px dotted #5B4E3C; margin: 8px 6px; }
  .sources { margin-top: 14px; background: #FFFEFA; border: 1px solid var(--line); border-radius: 12px; padding: 10px 16px; font-size: 11.5px; line-height: 1.6; break-inside: avoid; }
  .shields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px; justify-items: center; }
  .shield { width: 100%; max-width: 262px; }
  @page { size: A4; margin: 13mm 13mm 16mm;
    @bottom-right { content: 'המדריך למדריך'; font: 10px 'Heebo', sans-serif; color: #8C7F6B; }
    @bottom-left { content: 'עמוד ' counter(page); font: 10px 'Heebo', sans-serif; color: #8C7F6B; } }
  @media print { .doc { max-width: none; padding: 0; } .crumbs { margin-top: 0; } }
`;

function renderChuparPage(c: Chupar, vals: string[]): string {
  const shape = SHAPES[c.print?.shape ?? 'card'] ?? SHAPES.card;
  const gap = 3;
  const cols = Math.max(1, Math.floor((176 + gap) / (shape.w + gap)));
  const rows = Math.max(1, Math.floor((215 + gap) / (shape.h + gap)));
  const card = renderCard(c, '', '', vals);
  const cells = Array.from({ length: cols * rows }, () => `<div class="ccell">${card}</div>`).join('');
  return `<section class="app page"><h2 class="app-h"><span class="bar"></span>צ׳ופר לסיום${/\(לבנים\)/.test(c.title) ? ' — גרסה גברית' : /\(לבנות\)/.test(c.title) ? ' — גרסה נשית' : ''} (לגזירה)</h2><p class="app-intro">מדפיסים על נייר עבה וגוזרים לאורך הקווים המקווקווים.</p><div class="cgrid" style="grid-template-columns:repeat(${cols},${shape.w}mm);grid-auto-rows:${shape.h}mm;gap:${gap}mm">${cells}</div></section>`;
}

export function renderActivityMain(a: Activity, categoryLabel: string, badge: string, extra?: { chuparim: Chupar[]; vals: string[] }): string {
  const steps = stepsOf(a);
  const place = a.place === 'שניהם' ? 'פנים וחוץ' : a.place;
  const shabbat = a.shabbat === 'שניהם' ? 'מתאים לשניהם' : `מתאים ל${a.shabbat} בלבד`;
  const equipment = a.equipment.length ? a.equipment.join(', ') : 'ללא ציוד מיוחד';
  const guideItems = (a.guideNotes || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const isInfo = (l: string) => /מאגר|עוד משפטים|רוצים עוד/.test(l);
  const aps = [...(a.appendices || [])];
  const info = aps.filter((x) => isInfo(x.label));
  const rest = aps.filter((x) => !isInfo(x.label));
  const firstText = rest.findIndex((x) => !/המגן שלי/.test(x.label) && !renderCards(x.content));
  rest.splice(firstText >= 0 ? firstText + 1 : rest.length, 0, ...info);
  const appendices = rest.map(renderAppendix).join('\n') + (extra ? extra.chuparim.map((ch) => renderChuparPage(ch, extra.vals)).join('') : '');

  return `<main class="doc">
  <div class="crumbs">בית › ${escapeHtml(categoryLabel)} › <b>${escapeHtml(a.title)}</b></div>
  <div class="hero">
    <div>
      <span class="chip">${escapeHtml(badge)}</span>
      <h1>${escapeHtml(a.title)}</h1>
      <p class="desc">${escapeHtml(a.description)}</p>
    </div>
    <div class="meta">
      <div class="row"><span class="dot">●</span>${escapeHtml(a.ageLabel)}</div>
      <div class="row"><span class="dot">◷</span>${a.duration} דקות</div>
      <div class="row"><span class="dot">⌂</span>${escapeHtml(place)}</div>
      <hr>
      <p><b>שבת/חול:</b> ${shabbat}</p>
      <p><b>ציוד:</b> ${escapeHtml(equipment)}</p>
    </div>
  </div>
  ${a.shabbatNote ? `<div class="shabbat"><b>התאמה לשבת:</b> ${escapeHtml(a.shabbatNote)}</div>` : ''}
  <h2 class="sec">מטרות</h2>
  <ul>${a.goals.map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul>
  <div class="divider">מהלך הפעולה</div>
  ${steps.map(renderStep).join('\n')}
  ${a.sourceLink ? `<p class="src"><b>מקור חיצוני:</b> ${escapeHtml(a.sourceLink.title)} <span dir="ltr">${escapeHtml(a.sourceLink.url)}</span></p>` : ''}
  ${guideItems.length ? `<h2 class="sec" style="margin-top:20px">הסבר למדריך</h2><ul class="guide">${guideItems.map((g) => `<li>${inline(g)}</li>`).join('')}</ul>` : ''}
  ${a.tip ? `<div class="tipbox"><b>טיפ למדריך:</b> ${escapeHtml(a.tip)}</div>` : ''}
  ${appendices}
</main>`;
}

export function buildActivityPrintHtml(a: Activity, categoryLabel: string, badge: string, extra?: { chuparim: Chupar[]; vals: string[] }): string {
  return wrapDoc(a.title, `${a.title} · מאגר פעולות`, renderActivityMain(a, categoryLabel, badge, extra));
}

export const PRINT_CSS_EXTRA = `${CSS}
  .cgrid { display: grid; justify-content: center; }
  .ccell { outline: .25mm dashed #888; outline-offset: 1.5mm; direction: ltr; }
  .cover { min-height: 230mm; display: flex; flex-direction: column; justify-content: center; }
  .cover h1 { font-size: 44px; margin-bottom: 6px; }
  .toc { margin: 18px 0 0; padding: 0; list-style: none; columns: 1; }
  .toc li { padding: 5px 0; border-bottom: 1px dotted var(--line); display: flex; justify-content: space-between; gap: 12px; }
  .toc .t-sec { font-family: 'Rubik', sans-serif; font-weight: 800; color: var(--flame-ink); border-bottom: none; padding-top: 14px; }
  .item-generic .textcard { margin-top: 12px; }
`;

export function wrapDoc(title: string, runningTitle: string, inner: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${PRINT_CSS_EXTRA}</style>
</head>
<body>
<table class="wrap"><thead><tr><td><div class="run"><div class="brand">${mascotSvg('ga')}<span>המדריך למדריך</span></div><small>${escapeHtml(runningTitle)}</small></div></td></tr></thead><tbody><tr><td>
${inner}
</td></tr></tbody></table>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 500); });</script>
</body>
</html>`;
}

// ---------- מסמך אחד מכמה תכנים (הקלסר שלי / חבילת שבת) ----------
export interface BinderEntry {
  section: string;
  title: string;
  activity?: Activity;
  categoryLabel?: string;
  badge?: string;
  generic?: { sub: string; text: string; link?: string };
}

export function buildCombinedPrintHtml(docTitle: string, intro: string, entries: BinderEntry[]): string {
  const bySection: Record<string, BinderEntry[]> = {};
  entries.forEach((e) => (bySection[e.section] ??= []).push(e));
  const toc = Object.entries(bySection)
    .map(([sec, list]) => `<li class="t-sec">${escapeHtml(sec)}</li>${list.map((e) => `<li><span>${escapeHtml(e.title)}</span><span style="color:var(--faint);font-size:12px">${e.activity ? `${e.activity.ageLabel} · ${e.activity.duration} דק׳` : escapeHtml(e.generic?.sub ?? '')}</span></li>`).join('')}`)
    .join('');
  const cover = `<main class="doc cover"><h1>${escapeHtml(docTitle)}</h1><p class="desc">${escapeHtml(intro)}</p><ul class="toc">${toc}</ul></main>`;
  const items = entries.map((e) => {
    if (e.activity) return `<div class="page">${renderActivityMain(e.activity, e.categoryLabel ?? e.section, e.badge ?? e.section)}</div>`;
    const g = e.generic!;
    return `<main class="doc item-generic page"><div class="crumbs">${escapeHtml(e.section)}</div><h1>${escapeHtml(e.title)}</h1><p class="desc">${escapeHtml(g.sub)}</p><div class="textcard">${renderBody(g.text)}</div>${g.link ? `<p class="src"><span dir="ltr">${escapeHtml(g.link)}</span></p>` : ''}</main>`;
  }).join('\n');
  return wrapDoc(docTitle, docTitle, cover + items);
}
