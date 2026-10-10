import { useEffect, useState } from 'react';
import { SEVEN_NOTE, SEVEN_PARTS } from '../data/sevenParts';
import { CopyButton } from './CopyButton';
import { escapeHtml, offerHtml } from '../lib/printFile';

const KEY = 'hlm-seven-checklist';

function loadChecked(): boolean[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return SEVEN_PARTS.map((_, i) => !!raw[i]);
  } catch {
    return SEVEN_PARTS.map(() => false);
  }
}

export function sevenPartsText(): string {
  return `שיטת שבעת החלקים לבניית פעולה\n\n${SEVEN_NOTE}\n\n` + SEVEN_PARTS.map((p) =>
    `${p.n}. ${p.name} (מרקר ${p.marker})\nמטרה: ${p.purpose}\nמה כותבים: ${p.write}\nאיך זה מקדם את הפעולה: ${p.advances}\nממה להימנע: ${p.avoid}`).join('\n\n');
}

// דף להדפסה: כותרות בצבעים, מקרא למרקרים ומקום לכתיבה בכל חלק.
export function buildSevenPartsPrintHtml(): string {
  const rows = SEVEN_PARTS.map((p) => `
  <section class="part" style="--c:${p.color};--t:${p.tint}">
    <h2><span class="n">${p.n}</span>${escapeHtml(p.name)}</h2>
    <p class="hint">${escapeHtml(p.purpose)}</p>
    <div class="lines"><i></i><i></i><i></i></div>
  </section>`).join('');
  const legend = SEVEN_PARTS.map((p) => `<span class="lg" style="--c:${p.color};--t:${p.tint}"><b>${p.n}</b> ${escapeHtml(p.name)} · ${escapeHtml(p.marker)}</span>`).join('');
  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><title>שיטת שבעת החלקים — דף בנייה</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;800&family=Heebo:wght@400;700&display=swap');
  * { box-sizing: border-box; }
  @page { size: A4; margin: 10mm; }
  body { margin: 0; color: #241C11; direction: rtl; font-family: 'Heebo', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .doc { max-width: 190mm; margin: 0 auto; padding: 6mm 0; }
  h1 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 6.5mm; margin: 0 0 1mm; }
  .sub { font-size: 3.4mm; color: #5B4E3C; margin: 0 0 3mm; }
  .legend { display: flex; flex-wrap: wrap; gap: 1.6mm; margin-bottom: 4mm; }
  .lg { background: var(--t); border: .3mm solid var(--c); border-radius: 99mm; padding: .8mm 3mm; font-size: 3.2mm; }
  .lg b { display: inline-block; background: var(--c); color: #fff; border-radius: 50%; width: 5mm; height: 5mm; line-height: 5mm; text-align: center; font-size: 3mm; margin-inline-end: 1mm; }
  .part { break-inside: avoid; border-inline-start: 2mm solid var(--c); background: var(--t); border-radius: 2mm; padding: 2.6mm 4mm 3mm; margin-bottom: 3mm; }
  h2 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 4.6mm; margin: 0 0 .6mm; display: flex; align-items: center; gap: 2mm; }
  .n { background: var(--c); color: #fff; border-radius: 50%; width: 6.4mm; height: 6.4mm; line-height: 6.4mm; text-align: center; font-size: 3.8mm; }
  .hint { margin: 0 0 1.2mm; font-size: 3.2mm; color: #4B4030; }
  .lines i { display: block; border-bottom: .25mm solid #8C7F6B; height: 6.5mm; }
  .foot { font-size: 3mm; color: #8C7F6B; margin-top: 2mm; }
</style></head><body><div class="doc">
  <h1>שיטת שבעת החלקים: דף בנייה לפעולה</h1>
  <p class="sub">שם הפעולה: ______________________ &nbsp; גיל: ________ &nbsp; משך: ________ דק׳</p>
  <div class="legend">${legend}</div>
  <p class="sub">מקרא למרקרים: מסמנים כל כותרת במרקר בצבע שלה, ובסוף בודקים שכל שבעת הצבעים מופיעים.</p>
  ${rows}
  <p class="foot">${escapeHtml(SEVEN_NOTE)} · המדריך למדריך</p>
</div><script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 600); });</script></body></html>`;
}

export function SevenParts() {
  const [checked, setChecked] = useState<boolean[]>(() => loadChecked());
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch { /* ממשיכים בלי שמירה */ }
  }, [checked]);
  const done = checked.filter(Boolean).length;

  return (
    <div>
      <p style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--ink-soft)', margin: '0 0 12px' }}>
        שבעה חלקים בסדר קבוע, וכל חלק בצבע קבוע. מי שבונה פעולה עוברת עליהם לפי הסדר, ובסוף בודקת שאף חלק לא חסר.
      </p>
      <p style={{ fontSize: 13.5, color: 'var(--ink-faint)', margin: '0 0 22px' }}>{SEVEN_NOTE}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }} aria-label="מקרא צבעים">
        {SEVEN_PARTS.map((p) => (
          <a key={p.key} href={`#seven-${p.key}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 6px', borderRadius: 99, background: p.tint, border: `1.5px solid ${p.color}`, fontSize: 13, fontWeight: 700, textDecoration: 'none', color: 'var(--ink)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: p.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{p.n}</span>
            {p.name}
            <span style={{ fontWeight: 400, color: 'var(--ink-faint)' }}>· מרקר {p.marker}</span>
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        <button type="button" className="btn btn-flame" onClick={() => void offerHtml('seven-parts-sheet.html', buildSevenPartsPrintHtml())}>הדפסת דף בנייה עם מקרא צבעים</button>
        <CopyButton variant="mini" text={sevenPartsText()} label="העתקת השיטה" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 34 }}>
        {SEVEN_PARTS.map((p) => (
          <section key={p.key} id={`seven-${p.key}`} style={{ background: p.tint, borderInlineStart: `6px solid ${p.color}`, borderRadius: 14, padding: '16px 20px 18px', scrollMarginTop: 90 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 800, margin: '0 0 8px' }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: p.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{p.n}</span>
              {p.name}
            </h3>
            <dl style={{ margin: 0, display: 'grid', gap: 8, fontSize: 14.5, lineHeight: 1.75 }}>
              <div><dt style={{ fontWeight: 800, display: 'inline' }}>מה המטרה? </dt><dd style={{ display: 'inline', margin: 0 }}>{p.purpose}</dd></div>
              <div><dt style={{ fontWeight: 800, display: 'inline' }}>מה כותבים? </dt><dd style={{ display: 'inline', margin: 0 }}>{p.write}</dd></div>
              <div><dt style={{ fontWeight: 800, display: 'inline' }}>איך זה מקדם את הפעולה? </dt><dd style={{ display: 'inline', margin: 0 }}>{p.advances}</dd></div>
              <div><dt style={{ fontWeight: 800, display: 'inline' }}>ממה להימנע? </dt><dd style={{ display: 'inline', margin: 0 }}>{p.avoid}</dd></div>
            </dl>
          </section>
        ))}
      </div>

      <section aria-labelledby="seven-check" style={{ border: '2px solid var(--ink)', borderRadius: 16, padding: '18px 22px', marginBottom: 40, background: 'var(--paper)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <h3 id="seven-check" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>רשימת בדיקה: האם בנית את כל החלקים?</h3>
          <span style={{ fontSize: 13, fontWeight: 700, color: done === 7 ? '#2F7A4B' : 'var(--ink-faint)' }}>{done} מתוך 7</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 6 }}>
          {SEVEN_PARTS.map((p, i) => (
            <li key={p.key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, background: checked[i] ? p.tint : 'transparent', cursor: 'pointer', fontSize: 15 }}>
                <input type="checkbox" checked={checked[i]} onChange={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))} style={{ width: 18, height: 18, accentColor: p.color }} />
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: p.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{p.n}</span>
                <b>{p.name}</b>
              </label>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-outline" onClick={() => setChecked(SEVEN_PARTS.map(() => false))}>איפוס הרשימה</button>
          <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>הסימונים נשמרים רק בדפדפן שלך.</span>
        </div>
      </section>
    </div>
  );
}
