import type { Chupar, ChuparPrint } from '../data/types';

export interface Palette { bg: string; fg: string; acc: string; acc2: string }

export const PALETTES: Record<string, Palette> = {
  sunrise: { bg: '#FFE9C7', fg: '#7A2E0E', acc: '#F26B21', acc2: '#FFC145' },
  berry: { bg: '#FBE0EE', fg: '#6B1145', acc: '#D63384', acc2: '#FF9CCB' },
  ocean: { bg: '#DDF1FA', fg: '#0B4260', acc: '#1E8FC9', acc2: '#7CD1F2' },
  forest: { bg: '#E3F3D6', fg: '#244A12', acc: '#4E9A2A', acc2: '#B5DE6B' },
  grape: { bg: '#EDE3FA', fg: '#3F2278', acc: '#7A4FD1', acc2: '#C9B0F5' },
  night: { bg: '#1F2547', fg: '#F5EFD8', acc: '#FFC93C', acc2: '#7B8CF0' },
  sand: { bg: '#F6ECD6', fg: '#5A3D14', acc: '#C0862A', acc2: '#E8C77B' },
  cherry: { bg: '#FFE3E0', fg: '#7A1418', acc: '#E0353B', acc2: '#FF9A8F' },
  mint: { bg: '#DDF6EE', fg: '#0F4D42', acc: '#1FAF92', acc2: '#8FE3CE' },
  sky: { bg: '#E6EEFF', fg: '#1B2F6B', acc: '#3F6BE8', acc2: '#A9C0FF' },
  chalk: { bg: '#2B3A33', fg: '#F4F1E6', acc: '#F4D35E', acc2: '#8FD1B5' },
  cream: { bg: '#FFF8E7', fg: '#3B2A14', acc: '#E05D2D', acc2: '#F2B84B' },
};

export const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Rubik:wght@500;800;900&family=Heebo:wght@400;700&family=Suez+One&family=Secular+One&family=Amatic+SC:wght@400;700&family=Karantina:wght@700&display=swap";

// גודל כרטיס במ"מ לכל צורה
export const SHAPES: Record<string, { w: number; h: number }> = {
  card: { w: 92, h: 52 },
  cert: { w: 92, h: 64 },
  ticket: { w: 92, h: 34 },
  label: { w: 60, h: 40 },
  tag: { w: 44, h: 66 },
  square: { w: 60, h: 60 },
  image: { w: 92, h: 64 },
  imagesq: { w: 60, h: 60 },
  imagewide: { w: 92, h: 44 },
  wide: { w: 92, h: 44 },
  cinema: { w: 92, h: 42 },
  note: { w: 62, h: 60 },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ציורים קטנים (viewBox 100x100), נבנים מצבעי הפלטה
function motif(name: string, p: Palette): string {
  const { fg, acc, acc2 } = p;
  const st = (c: string, w = 4) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const m: Record<string, string> = {
    envelope: `<rect x="10" y="26" width="80" height="54" rx="6" fill="${acc2}"/><path d="M10 32 L50 60 L90 32" ${st(fg)}/><path d="M50 22c-6-9-18-2-11 6l11 9 11-9c7-8-5-15-11-6z" fill="${acc}"/>`,
    rosette: `<path d="M34 60 L24 94 L42 84 L50 94 L52 62Z M66 60 L76 94 L58 84 L50 94 L48 62Z" fill="${acc}"/><circle cx="50" cy="40" r="30" fill="${acc}"/><circle cx="50" cy="40" r="21" fill="${acc2}"/><path d="M50 27l4 9 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z" fill="${fg}"/>`,
    chest: `<rect x="14" y="44" width="72" height="42" rx="5" fill="${acc}"/><path d="M14 46c0-22 72-22 72 0z" fill="${acc2}"/><rect x="43" y="52" width="14" height="16" rx="3" fill="${fg}"/><path d="M14 62h72" ${st(fg, 3)}/>`,
    popcorn: `<circle cx="34" cy="34" r="12" fill="${acc2}"/><circle cx="52" cy="26" r="13" fill="${acc2}"/><circle cx="68" cy="35" r="12" fill="${acc2}"/><path d="M24 44h52l-7 46H31z" fill="${acc}"/><path d="M40 44l-2 46M52 44v46M64 44l2 46" ${st('#fff', 5)}/>`,
    star: `<path d="M50 8l12 27 29 3-22 20 7 29-26-15-26 15 7-29L9 38l29-3z" fill="${acc}" stroke="${acc2}" stroke-width="5" stroke-linejoin="round"/>`,
    heart: `<path d="M50 88C10 58 12 28 32 22c10-3 15 4 18 10 3-6 8-13 18-10 20 6 22 36-18 66z" fill="${acc}"/><path d="M28 32c-4 4-5 10-3 15" ${st('#fff', 4)} opacity=".7"/>`,
    sun: `<circle cx="50" cy="50" r="19" fill="${acc2}" stroke="${acc}" stroke-width="5"/><path d="M50 8v14M50 78v14M8 50h14M78 50h14M20 20l10 10M70 70l10 10M80 20L70 30M30 70L20 80" ${st(acc, 6)}/>`,
    moon: `<path d="M64 12A38 38 0 1 0 88 62 32 32 0 0 1 64 12z" fill="${acc}"/><path d="M78 24l3 7 7 1-6 5 2 7-6-4-6 4 2-7-6-5 7-1z" fill="${acc2}"/><circle cx="24" cy="24" r="3" fill="${acc2}"/><circle cx="84" cy="80" r="3" fill="${acc2}"/>`,
    bubbles: `<circle cx="36" cy="60" r="26" fill="${acc2}" opacity=".55" stroke="${acc}" stroke-width="4"/><circle cx="68" cy="34" r="16" fill="${acc2}" opacity=".55" stroke="${acc}" stroke-width="4"/><circle cx="72" cy="74" r="9" fill="${acc2}" opacity=".55" stroke="${acc}" stroke-width="4"/><path d="M26 50a14 14 0 0 1 10-8" ${st('#fff', 4)}/>`,
    balloon: `<ellipse cx="50" cy="38" rx="25" ry="30" fill="${acc}"/><path d="M50 68l-6 8h12z" fill="${acc}"/><path d="M50 76c-8 8 8 10 0 20" ${st(fg, 3)}/><path d="M36 26c-3 5-4 11-2 16" ${st('#fff', 4)} opacity=".6"/>`,
    jar: `<rect x="24" y="32" width="52" height="58" rx="12" fill="${acc2}" opacity=".7" stroke="${fg}" stroke-width="4"/><rect x="30" y="16" width="40" height="14" rx="4" fill="${acc}"/><path d="M50 74c-14-10-14-20-6-22 4-1 6 2 6 4 0-2 2-5 6-4 8 2 8 12-6 22z" fill="${acc}"/>`,
    key: `<circle cx="30" cy="50" r="18" ${st(acc, 9)}/><circle cx="30" cy="50" r="5" fill="${acc}"/><path d="M48 50h42M76 50v14M88 50v10" ${st(acc, 8)}/>`,
    compass: `<circle cx="50" cy="50" r="40" fill="${acc2}" stroke="${fg}" stroke-width="5"/><path d="M50 16v8M50 76v8M16 50h8M76 50h8" ${st(fg, 4)}/><path d="M50 22l10 28-10 6-10-6z" fill="${acc}"/><path d="M50 78L40 50l10-6 10 6z" fill="${fg}"/><circle cx="50" cy="50" r="4" fill="#fff"/>`,
    pill: `<g transform="rotate(-35 50 50)"><rect x="8" y="34" width="84" height="32" rx="16" fill="${acc2}"/><path d="M50 34h26a16 16 0 0 1 0 32H50z" fill="${acc}"/><path d="M20 42h20" ${st('#fff', 4)} opacity=".7"/></g>`,
    bandaid: `<g transform="rotate(-30 50 50)"><rect x="6" y="36" width="88" height="28" rx="14" fill="${acc2}" stroke="${fg}" stroke-width="3"/><rect x="34" y="36" width="32" height="28" fill="#fff" opacity=".7"/><g fill="${fg}"><circle cx="44" cy="45" r="2"/><circle cx="56" cy="45" r="2"/><circle cx="44" cy="55" r="2"/><circle cx="56" cy="55" r="2"/><circle cx="20" cy="50" r="2"/><circle cx="80" cy="50" r="2"/></g></g>`,
    crown: `<path d="M12 72L10 30l22 20 18-30 18 30 22-20-2 42z" fill="${acc}" stroke="${fg}" stroke-width="4" stroke-linejoin="round"/><rect x="12" y="72" width="76" height="12" rx="3" fill="${acc2}" stroke="${fg}" stroke-width="4"/><circle cx="50" cy="52" r="5" fill="${acc2}"/>`,
    bear: `<circle cx="26" cy="30" r="12" fill="${acc}"/><circle cx="74" cy="30" r="12" fill="${acc}"/><circle cx="50" cy="56" r="32" fill="${acc}"/><ellipse cx="50" cy="66" rx="14" ry="11" fill="${acc2}"/><circle cx="38" cy="50" r="4" fill="${fg}"/><circle cx="62" cy="50" r="4" fill="${fg}"/><ellipse cx="50" cy="62" rx="5" ry="3.5" fill="${fg}"/>`,
    sheep: `<g fill="#fff" stroke="${fg}" stroke-width="3"><circle cx="34" cy="48" r="16"/><circle cx="52" cy="40" r="18"/><circle cx="68" cy="50" r="16"/><circle cx="46" cy="60" r="16"/><circle cx="62" cy="62" r="14"/></g><ellipse cx="22" cy="60" rx="10" ry="12" fill="${fg}"/><path d="M40 78v12M60 78v12" ${st(fg, 5)}/>`,
    rooster: `<path d="M78 40c12-8 14 8 8 20-6 12-18 8-26 4z" fill="${acc2}"/><ellipse cx="46" cy="62" rx="28" ry="22" fill="${acc}"/><circle cx="30" cy="36" r="14" fill="${acc}"/><path d="M24 22c0-8 6-8 8-2 2-6 8-6 8 2" fill="#E0353B"/><path d="M16 36l-12 4 12 4z" fill="${acc2}"/><circle cx="28" cy="34" r="2.5" fill="${fg}"/><path d="M38 82v10M54 82v10" ${st(fg, 4)}/>`,
    snake: `<path d="M14 80c14-30 30 6 44-16s-6-40 14-40" ${st(acc, 14)}/><circle cx="76" cy="26" r="11" fill="${acc}"/><circle cx="79" cy="23" r="2.5" fill="#fff"/><path d="M86 30l10 3" ${st(acc2, 3)}/>`,
    drink: `<path d="M28 34l6 54h32l6-54z" fill="${acc}"/><path d="M28 34h44l-6-12H34z" fill="${acc2}"/><path d="M56 22l14-16" ${st(acc2, 6)}/><path d="M36 52h28" ${st('#fff', 5)} opacity=".6"/>`,
    candy: `<path d="M10 34l20 16-20 16zM90 34L70 50l20 16z" fill="${acc2}"/><ellipse cx="50" cy="50" rx="26" ry="20" fill="${acc}"/><path d="M40 34c6 14 6 22 0 32M54 32c6 14 6 24 0 36" ${st('#fff', 4)} opacity=".7"/>`,
    lollipop: `<path d="M50 50v44" ${st(fg, 5)}/><circle cx="50" cy="36" r="28" fill="${acc}"/><path d="M50 36m0 0a4 4 0 1 1 6 4 10 10 0 1 1-16-10 16 16 0 1 1 26 14" ${st(acc2, 5)}/>`,
    lips: `<path d="M8 50c14-16 26-14 42-4 16-10 28-12 42 4-12 26-30 36-42 36S20 76 8 50z" fill="${acc}"/><path d="M8 50c16 8 28 8 42 4 14 4 26 4 42-4" ${st(fg, 3)}/>`,
    toothbrush: `<rect x="8" y="58" width="60" height="12" rx="6" fill="${acc}" transform="rotate(-30 40 64)"/><g transform="rotate(-30 40 64)"><rect x="62" y="52" width="30" height="22" rx="4" fill="${acc2}"/><path d="M68 48v8M76 48v8M84 48v8" ${st(fg, 3)}/></g><circle cx="24" cy="30" r="4" fill="${acc2}"/><circle cx="14" cy="42" r="3" fill="${acc2}"/>`,
    thermo: `<rect x="40" y="10" width="20" height="60" rx="10" fill="#fff" stroke="${fg}" stroke-width="4"/><circle cx="50" cy="76" r="15" fill="${acc}" stroke="${fg}" stroke-width="4"/><rect x="46" y="34" width="8" height="42" fill="${acc}"/><path d="M66 24h10M66 38h10M66 52h10" ${st(fg, 3)}/>`,
    stamp: `<circle cx="50" cy="50" r="38" fill="none" stroke="${acc}" stroke-width="6" stroke-dasharray="4 5"/><circle cx="50" cy="50" r="28" fill="${acc2}"/><path d="M34 52l11 11 22-24" ${st(fg, 8)}/>`,
    mapx: `<path d="M10 20l20 6 20-6 20 6 20-6v60l-20 6-20-6-20 6-20-6z" fill="${acc2}" stroke="${fg}" stroke-width="3" stroke-linejoin="round"/><path d="M22 66c14-10 20 2 30-12s10-14 20-10" fill="none" stroke="${fg}" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M66 32l14 14M80 32L66 46" ${st(acc, 7)}/>`,
    mirror: `<ellipse cx="50" cy="40" rx="28" ry="32" fill="${acc2}" stroke="${acc}" stroke-width="7"/><path d="M50 72v20" ${st(acc, 9)}/><path d="M36 26c-4 6-5 12-3 18" ${st('#fff', 5)} opacity=".8"/>`,
    cards: `<g transform="rotate(-14 40 56)"><rect x="14" y="16" width="44" height="64" rx="6" fill="#fff" stroke="${fg}" stroke-width="3"/><path d="M36 36c-8-6-14 4-6 12l6 6 6-6c8-8 2-18-6-12z" fill="${acc}"/></g><g transform="rotate(14 62 52)"><rect x="42" y="18" width="44" height="64" rx="6" fill="#fff" stroke="${fg}" stroke-width="3"/><path d="M64 34l10 18-10 8-10-8z" fill="${fg}"/></g>`,
    sign: `<rect x="46" y="20" width="8" height="74" fill="${fg}"/><path d="M14 20h62l12 14-12 14H14z" fill="${acc}"/><path d="M24 34h44" ${st('#fff', 5)}/>`,
    bolt: `<path d="M58 6L22 56h24l-8 38 40-52H54z" fill="${acc2}" stroke="${acc}" stroke-width="5" stroke-linejoin="round"/>`,
    drop: `<path d="M50 8C30 34 20 46 20 62a30 30 0 0 0 60 0C80 46 70 34 50 8z" fill="${acc}"/><path d="M34 62a16 16 0 0 0 12 16" ${st('#fff', 5)} opacity=".7"/>`,
    ark: `<path d="M8 58h84l-14 26H22z" fill="${acc}"/><rect x="30" y="34" width="40" height="24" fill="${acc2}"/><path d="M26 34l24-18 24 18z" fill="${fg}"/><rect x="44" y="42" width="12" height="16" fill="${fg}"/><path d="M6 90c10-6 20 6 30 0s20 6 30 0 20 6 28 0" ${st(acc, 5)}/>`,
    tag: `<path d="M50 4v14" ${st(fg, 4)}/><rect x="24" y="18" width="52" height="76" rx="18" fill="${acc2}" stroke="${fg}" stroke-width="4"/><circle cx="50" cy="32" r="6" fill="${p.bg}" stroke="${fg}" stroke-width="3"/><path d="M36 54h28M36 66h28M40 78h20" ${st(fg, 4)}/>`,
    flag: `<path d="M20 90V12" ${st(fg, 6)}/><path d="M20 14c18-8 26 8 44 0 10-4 16-2 20 0v40c-4-2-10-4-20 0-18 8-26-8-44 0z" fill="${acc}"/>`,
    ticket: `<path d="M8 26h84v16a8 8 0 0 0 0 16v16H8V58a8 8 0 0 0 0-16z" fill="${acc}"/><path d="M62 26v48" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/><path d="M28 50l8 8 14-16" ${st('#fff', 5)}/>`,
    speech: `<path d="M12 18h76a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H48L28 90V70H12a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" fill="${acc}"/><path d="M24 36h52M24 50h34" ${st('#fff', 5)}/>`,
    magnet: `<path d="M22 20v34a28 28 0 0 0 56 0V20" ${st(acc, 16)}/><rect x="14" y="14" width="16" height="16" fill="#fff" stroke="${fg}" stroke-width="3"/><rect x="70" y="14" width="16" height="16" fill="#fff" stroke="${fg}" stroke-width="3"/>`,
    scroll: `<rect x="20" y="16" width="60" height="68" fill="${acc2}" stroke="${fg}" stroke-width="3"/><ellipse cx="20" cy="18" rx="8" ry="6" fill="${acc}"/><ellipse cx="80" cy="82" rx="8" ry="6" fill="${acc}"/><path d="M32 34h36M32 46h36M32 58h24" ${st(fg, 3)}/>`,
    spark: `<path d="M50 4c4 26 10 32 36 36-26 4-32 10-36 36-4-26-10-32-36-36 26-4 32-10 36-36z" fill="${acc}"/><path d="M80 66c2 10 4 12 14 14-10 2-12 4-14 14-2-10-4-12-14-14 10-2 12-4 14-14z" fill="${acc2}"/>`,
    paw: `<ellipse cx="50" cy="66" rx="22" ry="18" fill="${acc}"/><ellipse cx="22" cy="42" rx="8" ry="11" fill="${acc}"/><ellipse cx="40" cy="26" rx="8" ry="11" fill="${acc}"/><ellipse cx="60" cy="26" rx="8" ry="11" fill="${acc}"/><ellipse cx="78" cy="42" rx="8" ry="11" fill="${acc}"/>`,
    book: `<path d="M50 24c-10-10-28-10-40-6v60c12-4 30-4 40 6z" fill="${acc}"/><path d="M50 24c10-10 28-10 40-6v60c-12-4-30-4-40 6z" fill="${acc2}"/><path d="M50 24v60" ${st(fg, 3)}/>`,
    cloud: `<path d="M28 74a18 18 0 0 1 2-36 22 22 0 0 1 42 6 16 16 0 0 1-2 30z" fill="${acc2}" stroke="${acc}" stroke-width="4"/>`,
    shoe: `<path d="M10 62c10 0 14-8 14-22h20c0 16 12 22 36 26 8 2 10 10 10 16H10z" fill="${acc}"/><path d="M10 82h80" ${st(fg, 5)}/><path d="M26 52l14 4M30 62l14 4" ${st('#fff', 3)}/>`,
    glow: `<rect x="40" y="10" width="20" height="80" rx="10" fill="${acc2}" transform="rotate(30 50 50)"/><path d="M14 30l8 4M86 66l-8-4M12 60l9-2M88 34l-9 2M30 12l3 8M70 88l-3-8" ${st(acc, 5)}/>`,
    hat: `<path d="M10 62c4-28 20-42 40-42s36 14 40 42z" fill="${acc}"/><path d="M6 62h88c0 8-14 14-44 14S6 70 6 62z" fill="${acc2}" stroke="${fg}" stroke-width="3"/>`,
  };
  return m[name] ?? m.star;
}

// צבעי "מרקר" שטוחים — בהשראת העיצובים המקוריים (רקע לבן, מסגרת שחורה דקה, כיתוב שחור עבה, תוויות צבעוניות)
const CHIP_COLORS = ['#FFEB00', '#FF9500', '#7EE06A', '#F27FE0', '#C137D6'];
const FLAT: Record<string, [string, string]> = {
  sunrise: ['#FF9500', '#FFEB00'], berry: ['#F27FE0', '#C137D6'], ocean: ['#4A5D8F', '#8FB8E8'],
  forest: ['#7EE06A', '#90A783'], grape: ['#C137D6', '#F27FE0'], night: ['#4A5D8F', '#FFEB00'],
  sand: ['#C9A27E', '#FFEB00'], cherry: ['#FF4D4D', '#FF9500'], mint: ['#7EE06A', '#8FE3CE'],
  sky: ['#4A5D8F', '#8FB8E8'], chalk: ['#90A783', '#FFEB00'], cream: ['#FF9500', '#FFEB00'],
};
const PASTEL: Record<string, string> = {
  sunrise: '#FFEFC2', berry: '#FFDDF0', ocean: '#D6ECFF', forest: '#DDF6CF', grape: '#EADBFF', night: '#DDE3FF',
  sand: '#F9E6C9', cherry: '#FFDCD6', mint: '#D2F5E7', sky: '#DCE7FF', chalk: '#E1EEDD', cream: '#FFF1CC',
};
const BLOBS = [
  'M20 60c-6-24 14-46 40-44 20 2 34-8 44 8 12 20 6 44-10 58-18 16-36 20-56 12C24 88 24 72 20 60z',
  'M12 44c8-26 40-36 62-26 24 10 32 40 18 62-14 22-48 24-66 8C8 76 6 58 12 44z',
  'M18 30c14-18 50-20 68-4 16 14 14 44-4 60-20 18-52 12-64-8C8 62 8 42 18 30z',
];

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

// מייצר כרטיס אחד (HTML עם סגנון inline בלבד) — גודל במ"מ לפי הצורה
// לוגו ניצוץ (הלהבה המחייכת של האתר) — תגית עגולה קטנה בפינת הכרטיס
const NITZOTZ = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><path d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z" fill="#F5A93B" stroke="#241C11" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="52" r="4" fill="#241C11"/><circle cx="50" cy="52" r="4" fill="#241C11"/><path d="M32 62c3 3 13 3 16 0" stroke="#241C11" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
const nitzotzBadge = (pos: string, size = 6.2) => `<div style="position:absolute;${pos};width:${size}mm;height:${size}mm;border-radius:50%;background:#fff;border:.3mm solid #111;padding:.75mm;box-sizing:border-box">${NITZOTZ}</div>`;

export interface ChuparField { label: string }

// שדות דינמיים: כל קו תחתון ארוך (___) בטקסט הכרטיס הוא מקום שאפשר למלא בשם או בפרט
export function getFields(c: Chupar): ChuparField[] {
  const pr = c.print;
  if (!pr) return [];
  const out: ChuparField[] = [];
  for (const str of [pr.text, pr.sub ?? '']) {
    const re = /_{3,}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(str))) {
      const lineStart = str.lastIndexOf('\n', m.index) + 1;
      let before = str.slice(lineStart, m.index);
      before = before.slice(before.lastIndexOf('·') + 1).replace(/[:\s,]+$/g, '').trim();
      const words = before.split(/\s+/).filter(Boolean);
      out.push({ label: words.slice(-3).join(' ') || 'מילוי' });
    }
  }
  return out;
}

function fillBlanks(strs: [string, string], values: string[]): [string, string] {
  let k = 0;
  const f = (str: string) => str.replace(/_{3,}/g, () => {
    const v = (values[k++] ?? '').trim();
    return v ? v : '_'.repeat(9);
  });
  return [f(strs[0]), f(strs[1])];
}

export function renderCard(c: Chupar, imgBase = '', name = '', values: string[] = []): string {
  const base: ChuparPrint = c.print ?? { shape: 'card', layout: 'center', palette: 'cream', motif: 'star', font: 'rubik', text: c.title };
  const [ft, fsub] = fillBlanks([base.text, base.sub ?? ''], values);
  const pr: ChuparPrint = { ...base, text: ft, sub: base.sub ? fsub : undefined };
  const shape = SHAPES[pr.shape] ?? SHAPES.card;
  const { w, h } = shape;
  const hh = hash(c.id);

  if (c.designImage && pr.shape.startsWith('image')) {
    return `<div style="width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;"><img src="${esc(imgBase + c.designImage)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;display:block;margin:auto"></div>`;
  }

  // כרטיס "פתק" נקי: ריבוע, מסגרת דקה, כתב שחור על לבן, דגל ישראל קטן — בלי קישוטים
  if (pr.layout === 'plain') {
    const lines = (pr.sub ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
    const sender = lines.length > 1 ? lines[lines.length - 1] : '';
    const body = (sender ? lines.slice(0, -1) : lines).join(' ');
    const flag = `<svg viewBox="0 0 22 16" style="width:9.5mm;height:6.9mm;display:block;margin-bottom:2.6mm" xmlns="http://www.w3.org/2000/svg"><rect x=".4" y=".4" width="21.2" height="15.2" fill="#fff" stroke="#111" stroke-width=".5"/><rect x="0.4" y="2.1" width="21.2" height="1.7" fill="#0038B8"/><rect x="0.4" y="12.2" width="21.2" height="1.7" fill="#0038B8"/><g fill="none" stroke="#0038B8" stroke-width=".55"><path d="M11 4.9 L14 10.1 L8 10.1 Z"/><path d="M11 11.1 L14 5.9 L8 5.9 Z"/></g></svg>`;
    return `<div style="width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;direction:rtl;padding:1.6mm">
<div style="width:100%;height:100%;box-sizing:border-box;border:.35mm solid #111;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2mm 4mm;color:#111">
${flag}
<div style="font-family:'Rubik','Heebo',sans-serif;font-weight:700;font-size:4.5mm;line-height:1.3">${esc(pr.text).replace(/\n/g, '<br>')}</div>
<div style="width:9mm;border-top:.3mm solid #111;margin:2.2mm 0"></div>
<div style="font-family:'Heebo',sans-serif;font-size:2.9mm;line-height:1.35">${esc(body)}</div>
${sender ? `<div style="font-family:'Heebo',sans-serif;font-weight:500;font-size:3.1mm;line-height:1.3;margin-top:1.4mm">${esc(sender)}</div>` : ''}
</div></div>`;
  }

  if (pr.layout === 'cinema') {
    const parts = (pr.sub ?? '').split(/\s*·\s*/).map((x) => x.trim()).filter(Boolean);
    const subtitle = parts[0] ?? '';
    const bits = parts.slice(1);
    const cp: Palette = { bg: '#fff', fg: '#111', acc: '#E0353B', acc2: '#FFC93C' };
    const pop = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">${motif('popcorn', cp)}</svg>`;
    const strip = (side: string) => `<div style="position:absolute;${side}:0;top:0;bottom:0;width:6.4mm;background:#111"><div style="position:absolute;left:1.6mm;top:1mm;bottom:0;width:3.2mm;background:repeating-linear-gradient(to bottom,#fff 0 2.4mm,transparent 2.4mm 4.4mm);border-radius:.4mm"></div></div>`;
    const chipC = ['#FFEB00', '#FF9500'];
    const chipsHtml = bits.map((t, i) => `<span style="background:${chipC[i % 2]};color:#111;font-family:'Amatic SC','Heebo',cursive;font-weight:700;font-size:4.4mm;line-height:1;padding:.5mm 1.8mm .8mm">${esc(t)}</span>`).join('');
    return `<div style="width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;color:#111;direction:rtl;">
${strip('left')}${strip('right')}
<div style="position:absolute;left:8mm;right:8mm;top:1.6mm;bottom:1.6mm;border:.35mm solid #111;background:#FFF6DA"></div>
<div style="position:absolute;left:8mm;top:1.6mm;bottom:1.6mm;width:23mm;background:#E0353B;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1mm;border-inline-end:.5mm dashed #fff;box-sizing:border-box">
${nitzotzBadge('position:relative;top:0;left:0', 5)}<div style="width:13mm;height:13mm">${pop}</div>
<div style="color:#fff;font-family:'Amatic SC','Heebo',cursive;font-weight:700;font-size:4.6mm;line-height:1">כרטיס אחד</div></div>
<div style="position:absolute;left:31mm;right:9mm;top:2mm;bottom:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
<div style="font-family:'Amatic SC','Heebo',cursive;font-weight:700;font-size:4.4mm;line-height:1;letter-spacing:.06em">★ הקרנה מיוחדת ★</div>
<div style="font-family:'Secular One','Rubik',sans-serif;font-size:8mm;line-height:1.05;white-space:nowrap">${esc(pr.text)}</div>
<div style="height:.9mm;background:#404040;border-radius:1mm;width:78%;margin:.7mm 0 1mm"></div>
<div style="font-family:'Rubik',sans-serif;font-weight:900;font-size:5.4mm;line-height:1.1">${esc(subtitle)}</div>
<div style="display:flex;gap:1.4mm;margin-top:1.3mm;justify-content:center;flex-wrap:wrap">${chipsHtml}</div></div></div>`;
  }

  if (pr.layout === 'pharmacy') {
    const prefix = pr.customName?.prefix ?? pr.text;
    const nm = name.trim();
    const total = (prefix + nm).length;
    const tfs = Math.min(11.5, 50 / Math.max(total, 5) / 0.6);
    const slot = nm
      ? esc(nm)
      : `<span style="display:inline-block;min-width:${tfs * 2.6}mm;height:${tfs * 0.8}mm;border-bottom:${Math.max(.7, tfs * 0.09)}mm dotted #404040;vertical-align:baseline"></span>`;
    const chipCss = (bg: string, fg = '#111') => `background:${bg};color:${fg};font-family:'Amatic SC','Heebo',cursive;font-weight:700;font-size:4.6mm;line-height:1;padding:.5mm 1.8mm .8mm;`;
    return `<div style="width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;color:#111;direction:rtl;">
<div style="position:absolute;inset:1.8mm;border:.3mm solid #111;pointer-events:none"></div>${nitzotzBadge('top:.6mm;right:.8mm', 5.6)}
<div style="position:absolute;left:0;top:0;width:36mm;height:${h}mm">
<svg viewBox="0 0 120 100" style="position:absolute;inset:0;width:100%;height:100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M10 34c-2-16 16-26 34-20 14-8 34 0 38 18 14 6 24 22 12 38-8 12-22 12-30 8-4 14-24 22-38 12C8 78 2 60 10 34z" fill="#93A683"/></svg>
<div style="position:absolute;left:7mm;top:5mm;width:22mm;height:22mm;background:#4A5D8F;transform:rotate(14deg)"></div>
<div style="position:absolute;left:10mm;top:8mm;width:15mm;height:15mm;background:#404040;color:#fff;font-family:'Secular One','Rubik',sans-serif;text-align:center;font-size:3.3mm;line-height:1.05;padding-top:3.3mm;box-sizing:border-box"><div style="font-size:2.6mm">15</div>קפליות</div>
<div style="position:absolute;left:17mm;top:19mm;width:12mm;height:12mm;background:#404040;transform:rotate(0deg)"></div>
<div style="position:absolute;left:14mm;top:22mm;width:16mm;height:16mm;background:#4A5D8F;opacity:.0"></div>
</div>
<div style="position:absolute;right:5mm;left:38mm;top:6.4mm;bottom:3mm;display:flex;flex-direction:column;justify-content:center;align-items:stretch">
<div style="font-family:'Secular One','Rubik',sans-serif;font-size:${tfs}mm;line-height:1.1;text-align:center;white-space:nowrap">${esc(prefix)}${slot}</div>
<div style="height:1mm;background:#404040;border-radius:1mm;margin:.8mm 1mm 1.4mm"></div>
<div style="display:flex;flex-wrap:wrap;gap:1.4mm 2mm;align-items:center;justify-content:flex-start">
<span style="font-family:'Amatic SC','Heebo',cursive;font-weight:700;font-size:5mm">לקחת כש:</span>
<span style="${chipCss('#FF9500')}">כואב לי</span><span style="${chipCss('#C137D6', '#fff')}">עייף/ה</span>
<span style="${chipCss('#FFEB00')}">חם לי</span><span style="${chipCss('#7EE06A')}">קשה לי</span><span style="${chipCss('#F27FE0')}">כיף לי</span>
</div></div></div>`;
  }

  const [f1, f2] = FLAT[pr.palette] ?? FLAT.cream;
  const p: Palette = { bg: '#fff', fg: '#222', acc: f1, acc2: f2 };
  const titleFont = pr.font === 'amatic' || pr.font === 'karantina' ? "'Secular One', 'Rubik', sans-serif" : pr.font === 'suez' ? "'Secular One', 'Rubik', sans-serif" : "'Rubik', sans-serif";
  const titleWeight = titleFont.includes('Rubik') && !titleFont.includes('Secular') ? 900 : 400;
  const hand = "'Amatic SC', 'Heebo', cursive";
  const text = esc(pr.text).replace(/\n/g, '<br>');
  const len = pr.text.length;
  const isPoem = pr.layout === 'poem';

  const subParts = (pr.sub ?? '').split(/\s*·\s*|\n/).map((x) => x.trim()).filter(Boolean);
  const asChips = !isPoem && subParts.length >= 2 && subParts.every((x) => x.length <= 24 && !/_/.test(x));

  const area = w * h;
  let fs = len < 24 ? 8.2 : len < 48 ? 6.6 : len < 90 ? 5.2 : len < 160 ? 4 : 3.2;
  fs = Math.min(fs, Math.sqrt(area) / 6);
  if (isPoem) fs = Math.min(fs, 3.9);
  const sideMotif = pr.layout === 'split' || pr.layout === 'ticket';
  const corner = hh % 2 === 0 ? 'left' : 'right';
  const horiz = w / h >= 1.45;
  const mSize = sideMotif ? Math.min(w, h) * 0.62 : horiz ? h * 0.58 : Math.min(w, h) * 0.4;
  const reserve = mSize * 0.86 + 1.5;
  const padBottom = sideMotif || horiz ? 5 : Math.max(5, reserve);
  const padL = !sideMotif && horiz && corner === 'left' ? reserve : 8.5;
  const padR = !sideMotif && horiz && corner === 'right' ? reserve : 8.5;
  const centerPad = `padding:4mm ${padR}mm ${padBottom}mm ${padL}mm;`;
  const usableW = (sideMotif ? w * 0.62 : w - padL - padR) * (pr.layout === 'label' ? 0.95 : 1);
  const motifH = sideMotif || isPoem ? 0 : 0;
  const chipRows = asChips ? Math.ceil(subParts.length / 2) : 0;
  const usableH = h - 4 - padBottom - 2 - motifH - chipRows * 7;
  const countLines = (t: string, size: number) => t.split('\n').reduce((n, seg) => n + Math.max(1, Math.ceil((seg.length * size * 0.56) / usableW)), 0);
  const subText = asChips ? '' : (pr.sub ?? '');
  const fits = (size: number) => {
    const subSize = Math.max(size * 0.85, 4.4);
    const subH = subText ? countLines(subText, subSize * 0.6) * subSize * 1.0 + 1.5 : 0;
    return countLines(pr.text, size) * size * 1.2 + subH <= usableH;
  };
  while (fs > 2.3 && !fits(fs)) fs -= 0.25;
  let handPoem = 0;
  if (isPoem) {
    const subLines = pr.sub ? 1.4 : 0;
    const pw = w - padL - padR - 2;
    const ph = h - 4 - padBottom - 2;
    handPoem = 7.5;
    const need = (sz: number) => pr.text.split('\n').reduce((n, seg) => n + Math.max(1, Math.ceil((seg.length * sz * 0.36) / pw)), 0) * sz * 1.05 + subLines * sz;
    while (handPoem > 3 && need(handPoem) > ph) handPoem -= 0.2;
  }

  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">${motif(pr.motif, p)}</svg>`;
  const blob = `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%"><path d="${BLOBS[hh % BLOBS.length]}" fill="${f2}" opacity=".42"/></svg>`;
  // "סטיקר": כתם + ריבועים חופפים + עיגול לבן עם האייקון — בהשראת הקומפוזיציה של העיצובים המקוריים
  const deep = hh % 3 === 0 ? '#93A683' : '#4A5D8F';
  const cluster = (rot: number) => `${blob}
<div style="position:absolute;left:12%;top:8%;width:60%;height:60%;background:${deep};transform:rotate(${rot + 12}deg)"></div>
<div style="position:absolute;left:38%;top:34%;width:44%;height:44%;background:#404040;transform:rotate(${rot - 8}deg)"></div>
<div style="position:absolute;left:14%;top:14%;width:66%;height:66%;border-radius:50%;background:#fff;border:.3mm solid #111;box-sizing:border-box;padding:11%;transform:rotate(${rot}deg)">${svg}</div>`;
  const peek = `position:absolute;bottom:${-mSize * 0.14}mm;${corner}:${-mSize * 0.14}mm;width:${mSize}mm;height:${mSize}mm;`;
  const motifPeek = `<div style="${peek}">${cluster(corner === 'left' ? -8 : 8)}</div>`;
  const HL = ['#FFEB00', '#7EE06A', '#F27FE0', '#FF9500'];
  const hl = HL[hh % HL.length];
  const titleHtml = `<span style="background-image:linear-gradient(transparent 60%,${hl} 60%,${hl} 92%,transparent 92%);-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:0 1.2mm">${text}</span>`;
  const logoPos = `bottom:.7mm;${corner === 'left' ? 'right' : 'left'}:.9mm`;
  const badge = nitzotzBadge(logoPos);
  const brand = `<div style="position:absolute;bottom:.35mm;inset-inline:0;text-align:center;font-family:'Heebo',sans-serif;font-size:1.7mm;opacity:.5">המדריך למדריך</div>${badge}`;
  const rule = `<div style="position:relative;height:${Math.max(.9, fs * 0.12)}mm;background:#404040;border-radius:1mm;width:70%;margin:${fs * 0.22}mm auto ${fs * 0.28}mm"></div>`;

  const chips = asChips
    ? `<div style="position:relative;display:flex;flex-wrap:wrap;gap:1.4mm;justify-content:center;margin-top:1.4mm">${subParts.map((t, i) => {
        const col = CHIP_COLORS[(i + hh) % CHIP_COLORS.length];
        const dark = col === '#C137D6';
        return `<span style="background:${col};color:${dark ? '#fff' : '#111'};font-family:${hand};font-weight:700;font-size:${Math.max(4.4, fs * 0.8)}mm;line-height:1;padding:.6mm 2mm .8mm;border-radius:.9mm;transform:rotate(${i % 2 === 0 ? -2 : 2}deg);display:inline-block">${esc(t)}</span>`;
      }).join('')}</div>`
    : '';
  const handSub = subText
    ? `<div style="position:relative;font-family:${hand};font-weight:700;font-size:${Math.max(fs * 0.85, 4.4)}mm;line-height:1;margin-top:1.2mm">${esc(subText).replace(/\n/g, '<br>')}</div>`
    : '';

  const confColors = [...CHIP_COLORS, f1];
  const confetti = (() => {
    const items: string[] = [];
    let seed = hh;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const n = Math.round((w + h) / 9);
    for (let i = 0; i < n; i++) {
      const edge = i % 4;
      const along = rnd();
      const off = 0.6 + rnd() * 0.9;
      const pos = edge === 0 ? `top:${off}mm;left:${along * (w - 3)}mm` : edge === 1 ? `bottom:${off}mm;left:${along * (w - 3)}mm` : edge === 2 ? `left:${off}mm;top:${along * (h - 3)}mm` : `right:${off}mm;top:${along * (h - 3)}mm`;
      const col = confColors[Math.floor(rnd() * confColors.length)];
      const kind = Math.floor(rnd() * 3);
      const sz = 1.1 + rnd() * 0.8;
      const shape = kind === 0 ? `border-radius:50%;background:${col}` : kind === 1 ? `background:${col};transform:rotate(${Math.round(rnd() * 80)}deg)` : `border-left:${sz / 2}mm solid transparent;border-right:${sz / 2}mm solid transparent;border-bottom:${sz}mm solid ${col}`;
      items.push(`<div style="position:absolute;${pos};width:${kind === 2 ? 0 : sz}mm;height:${kind === 2 ? 0 : sz}mm;${shape}"></div>`);
    }
    return items.join('');
  })();
  const frame = `position:absolute;inset:2.5mm;border:.4mm solid #111;border-radius:3mm;background:#fff;pointer-events:none;`;
  const root = `width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:${PASTEL[pr.palette] ?? '#FFF1CC'};color:#111;direction:rtl;text-align:center;`;
  const titleStyle = `font-family:${titleFont};font-weight:${titleWeight};font-size:${fs}mm;line-height:1.12;`;

  if (isPoem) {
    return `<div style="${root}display:flex;align-items:center;justify-content:center;${centerPad}"><div style="${frame}"></div>${confetti}${motifPeek}
<div style="position:relative;font-family:${hand};font-weight:700;font-size:${handPoem}mm;line-height:1.05;color:#111">${text}${subText ? `<div style="font-family:'Rubik',sans-serif;font-weight:900;font-size:${Math.max(handPoem * 0.62, 3)}mm;margin-top:1.4mm">${esc(subText)}</div>` : ''}</div>${brand}</div>`;
  }
  if (pr.layout === 'split') {
    const side = mSize * 1.05;
    return `<div style="${root}display:flex;align-items:center;justify-content:space-between;padding:3mm 5mm;"><div style="${frame}"></div>${confetti}
<div style="position:relative;flex:none;width:${side}mm;height:${side}mm">${cluster(-7)}</div>
<div style="position:relative;flex:1;padding-inline-start:3mm"><div style="${titleStyle}">${titleHtml}</div>${rule}${chips}${handSub}</div>${brand}</div>`;
  }
  if (pr.layout === 'ticket') {
    return `<div style="${root}display:flex;align-items:center;padding:2mm 5mm;-webkit-mask:radial-gradient(circle 2.4mm at 0 50%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 2.4mm at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 2.4mm at 0 50%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 2.4mm at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat;"><div style="${frame}border-style:dashed"></div>${confetti}
<div style="position:relative;flex:1;padding-inline-end:3mm"><div style="${titleStyle}">${titleHtml}</div>${chips}${handSub}</div>
<div style="position:relative;flex:none;width:${h * 0.62}mm;height:${h * 0.62}mm">${cluster(8)}</div>${badge}</div>`;
  }
  if (pr.layout === 'seal') {
    return `<div style="${root}display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4mm 6mm 5mm;"><div style="${frame}"></div>${confetti}<div style="position:absolute;inset:3.7mm;border:.2mm solid #111;border-radius:2mm;pointer-events:none"></div>
<div style="width:${Math.min(w, h) * 0.2}mm;height:${Math.min(w, h) * 0.2}mm;margin-bottom:1mm;position:relative">${blob}<div style="position:absolute;inset:0">${svg}</div></div>
<div style="position:relative;${titleStyle}">${titleHtml}</div>${rule}${chips}${handSub}${brand}</div>`;
  }
  // center / label / sign
  return `<div style="${root}display:flex;flex-direction:column;align-items:center;justify-content:center;${centerPad}"><div style="${frame}"></div>${confetti}${motifPeek}
<div style="position:relative;${titleStyle}">${titleHtml}</div>${asChips || subText ? rule : ''}${chips}${handSub}${brand}</div>`;
}

// דף A4 עם עותקים רבים של הכרטיס — לגזירה
export function buildChuparPrintHtml(c: Chupar, pages: number, imgBase: string, name = '', values: string[] = []): string {
  const shape = SHAPES[c.print?.shape ?? 'card'] ?? SHAPES.card;
  const gap = 3;
  const cols = Math.max(1, Math.floor((194 + gap) / (shape.w + gap)));
  const rows = Math.max(1, Math.floor((281 + gap) / (shape.h + gap)));
  const perPage = cols * rows;
  const card = renderCard(c, imgBase, name, values);
  const cells = (n: number) => Array.from({ length: n }, () => `<div class="cell">${card}</div>`).join('');
  const sheets = Array.from({ length: pages }, () => `<div class="page"><div class="grid">${cells(perPage)}</div><div class="foot">${esc(c.title)} · ${perPage} עותקים בדף · גוזרים לאורך הקווים</div></div>`).join('');
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.title)} — דף להדפסה</title>
<style>
  @import url('${FONT_IMPORT}');
  * { box-sizing: border-box; }
  @page { size: A4; margin: 8mm; }
  body { margin: 0; background: #ddd; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Heebo', sans-serif; }
  .page { width: 194mm; margin: 0 auto 6mm; background: #fff; padding: 0; page-break-after: always; break-after: page; position: relative; min-height: 281mm; }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .grid { display: grid; grid-template-columns: repeat(${cols}, ${shape.w}mm); grid-auto-rows: ${shape.h}mm; gap: ${gap}mm; justify-content: center; }
  .cell { outline: .25mm dashed #888; outline-offset: ${gap / 2}mm; }
  .foot { position: absolute; bottom: 0; inset-inline: 0; text-align: center; font-size: 8px; color: #999; }
  @media print { body { background: #fff; } .page { margin: 0; } }
</style>
</head>
<body>
${sheets}
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 700); });</script>
</body>
</html>`;
}

export function copiesPerPage(c: Chupar): number {
  const shape = SHAPES[c.print?.shape ?? 'card'] ?? SHAPES.card;
  const gap = 3;
  return Math.max(1, Math.floor((194 + gap) / (shape.w + gap))) * Math.max(1, Math.floor((281 + gap) / (shape.h + gap)));
}
