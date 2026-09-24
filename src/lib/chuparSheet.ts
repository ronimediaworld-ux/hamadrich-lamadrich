import type { Chupar } from '../data/types';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

interface Theme { bg: string; ink: string; band: string; pattern: string }

const KIND_THEME: Record<Chupar['kind'], Theme> = {
  'אכיל': { bg: '#FFF1DC', ink: '#7A3712', band: '#E8843A', pattern: 'radial-gradient(circle at 8px 8px, rgba(232,132,58,.16) 2px, transparent 3px) 0 0/16px 16px' },
  'מתנה מוחשית': { bg: '#F1E8FA', ink: '#4B2A7A', band: '#8A5CC9', pattern: 'repeating-linear-gradient(45deg, rgba(138,92,201,.10) 0 6px, transparent 6px 14px)' },
  'חוויה': { bg: '#E3F3FA', ink: '#0F4C68', band: '#2E97C4', pattern: 'radial-gradient(circle at 10px 10px, rgba(46,151,196,.16) 1.5px, transparent 2.5px) 0 0/20px 20px, radial-gradient(circle at 0 0, rgba(46,151,196,.10) 1px, transparent 2px) 10px 10px/20px 20px' },
  'DIY': { bg: '#EAF5DF', ink: '#2F5A17', band: '#6BAA3A', pattern: 'repeating-linear-gradient(0deg, rgba(107,170,58,.13) 0 2px, transparent 2px 12px)' },
};

const ACCENTS = ['#D96A2B', '#B03A7A', '#2E97C4', '#6BAA3A', '#C8991E', '#7A5CC9'];

function accentFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

function cardHtml(c: Chupar, imgBase: string): string {
  const t = KIND_THEME[c.kind];
  const accent = accentFor(c.id);
  const bodyLen = c.description.length + c.tip.length;
  const size = bodyLen > 520 ? 'wide' : bodyLen > 300 ? 'tall' : '';
  const fontSize = bodyLen > 520 ? 11 : bodyLen > 300 ? 11.5 : 12.5;
  const img = c.designImage
    ? `<img class="pic" src="${esc(imgBase + c.designImage)}" alt="">`
    : '';
  return `<div class="card ${size}" style="background:${t.bg};color:${t.ink};--accent:${accent}">
  <div class="pat" style="background:${t.pattern}"></div>
  <div class="band" style="background:${t.band}"><span>${esc(c.kind)}</span><span>${esc(c.forWhom)}</span></div>
  <div class="inner" style="font-size:${fontSize}px">
    <h3 style="border-color:${accent}">${esc(c.title)}</h3>
    ${img}
    <p class="desc">${esc(c.description)}</p>
    <div class="tip"><b>איך עושים</b><div>${esc(c.tip)}</div></div>
  </div>
  <div class="meta"><span>תקציב ${esc(c.budget)}</span><span>הכנה ${esc(c.prepTime)}</span><span class="logo">המדריך למדריך</span></div>
</div>`;
}

export function buildChuparSheetHtml(items: Chupar[], imgBase: string): string {
  const printedOn = new Date().toLocaleDateString('he-IL');
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>דף צ׳ופרים — המדריך למדריך</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@600;800&family=Heebo:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  @page { size: A4; margin: 9mm; }
  body { margin: 0; background: #FBF9F2; font-family: 'Heebo', Arial, sans-serif; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .head { max-width: 200mm; margin: 6mm auto 4mm; display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; color: #8C7F6B; padding: 0 2mm; }
  .head b { font-family: 'Rubik', sans-serif; font-size: 16px; color: #241C11; }
  .grid { max-width: 200mm; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 84mm; gap: 3mm; }
  .card { position: relative; border: 1.5px dashed #9a8f7c; border-radius: 4mm; overflow: hidden; display: flex; flex-direction: column; break-inside: avoid; page-break-inside: avoid; }
  .card.tall { grid-row: span 1; }
  .card.wide { grid-column: span 2; }
  .card.wide .tip { column-count: 2; column-gap: 6mm; column-rule: 1px solid rgba(0,0,0,.12); }
  .card.wide .tip b { column-span: all; }
  .pat { position: absolute; inset: 0; pointer-events: none; }
  .band { position: relative; color: #fff; display: flex; justify-content: space-between; padding: 1.6mm 4mm; font-size: 10.5px; font-weight: 700; letter-spacing: .02em; }
  .inner { position: relative; padding: 3mm 4.5mm 0; flex: 1; overflow: hidden; line-height: 1.5; }
  h3 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 15px; line-height: 1.25; margin: 0 0 2mm; padding-inline-start: 2.5mm; border-inline-start: 4px solid; }
  .desc { margin: 0 0 2mm; }
  .pic { width: 100%; max-height: 26mm; object-fit: cover; border-radius: 2mm; margin-bottom: 2mm; }
  .tip { background: rgba(255,255,255,.72); border-radius: 2.5mm; padding: 2mm 3mm; white-space: pre-line; }
  .tip b { display: block; font-size: 10px; letter-spacing: .04em; color: var(--accent); margin-bottom: .5mm; }
  .meta { position: relative; display: flex; gap: 3mm; padding: 1.5mm 4.5mm 2.2mm; font-size: 9.5px; opacity: .8; }
  .meta .logo { margin-inline-start: auto; font-weight: 700; }
  @media screen { .grid { padding-bottom: 20mm; } }
</style>
</head>
<body>
<div class="head"><b>דף צ׳ופרים</b><span>${items.length} צ׳ופרים · גוזרים לאורך הקו המקווקו · ${printedOn}</span></div>
<div class="grid">
${items.map((c) => cardHtml(c, imgBase)).join('\n')}
</div>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 500); });</script>
</body>
</html>`;
}
