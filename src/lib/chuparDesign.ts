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

export const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Rubik:wght@500;800;900&family=Heebo:wght@400;500;700;800&family=Suez+One&family=Secular+One&family=Amatic+SC:wght@400;700&family=Karantina:wght@700&family=Frank+Ruhl+Libre:wght@700;900&family=Varela+Round&family=Gveret+Levin&family=Playpen+Sans+Hebrew:wght@700;800&family=Alef:wght@700&family=David+Libre:wght@700&display=swap";

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
  // צורות גזורות לפי הנושא (הכרטיס עצמו הוא הצורה)
  candy: { w: 92, h: 46 },
  lollipop: { w: 50, h: 76 },
  heart: { w: 64, h: 58 },
  bubble: { w: 84, h: 56 },
  bandaid: { w: 92, h: 38 },
  pill: { w: 92, h: 36 },
  drop: { w: 60, h: 78 },
  cloud: { w: 84, h: 56 },
  balloon: { w: 54, h: 74 },
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

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

// מייצר כרטיס אחד (HTML עם סגנון inline בלבד) — גודל במ"מ לפי הצורה

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

// זוגות פונטים: כל "בגד" טיפוגרפי נבחר לפי שדה font של הצ׳ופר (ולפעמים לפי סוג הכרטיס)
const TYPE: Record<string, { family: string; weight: number; scale: number }> = {
  suez: { family: "'Suez One','Frank Ruhl Libre',serif", weight: 400, scale: 1 },
  secular: { family: "'Secular One','Rubik',sans-serif", weight: 400, scale: 1 },
  rubik: { family: "'Rubik',sans-serif", weight: 900, scale: 0.96 },
  amatic: { family: "'Gveret Levin','Amatic SC',cursive", weight: 400, scale: 1.05 },
  karantina: { family: "'Karantina','Secular One',sans-serif", weight: 700, scale: 1.2 },
  heebo: { family: "'Heebo',sans-serif", weight: 800, scale: 0.98 },
  frank: { family: "'Frank Ruhl Libre',serif", weight: 900, scale: 0.98 },
};

// ---- צורות גזורות: הכרטיס עצמו הוא הצורה (קו חיתוך שחור דק) ----
const SW = 0.5; // עובי קו חיתוך במ"מ
interface DieOut { svg: string; ins: { x: number; y: number; w: number; h: number } }
type DieFn = (w: number, h: number, c1: string, c2: string, seed: number) => DieOut;
const unionOutline = (shapes: Array<[string, string]>) =>
  `<g fill="#111" stroke="#111" stroke-width="${SW * 2}" stroke-linejoin="round" stroke-linecap="round">${shapes.map(([el]) => el).join('')}</g><g stroke="none">${shapes.map(([el, fill]) => el.replace('/>', ` fill="${fill}"/>`)).join('')}</g>`;
const pathOutline = (d: string, fill = '#fff') => `<path d="${d}" fill="${fill}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`;
const mflip = (pts: Array<[number, number]>, w: number) => pts.map(([x, y]) => [w - x, y] as [number, number]);
const poly = (pts: Array<[number, number]>) => `<polygon points="${pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')}"/>`;

const DIE: Record<string, DieFn> = {
  candy: (w, h, _c1, c2) => {
    const m = SW + 0.3;
    const wl: Array<[number, number]> = [[w * 0.2, h * 0.3], [m, h * 0.06], [w * 0.075, h * 0.5], [m, h * 0.94], [w * 0.2, h * 0.7]];
    const wr = mflip(wl, w);
    const body = `<rect x="${w * 0.17}" y="${h * 0.08}" width="${w * 0.66}" height="${h * 0.84}" rx="${h * 0.3}"/>`;
    return {
      svg: unionOutline([[poly(wl), c2], [poly(wr), c2], [body, '#fff']]),
      ins: { x: w * 0.25, y: h * 0.17, w: w * 0.5, h: h * 0.66 },
    };
  },
  lollipop: (w, h, c1, c2) => {
    const r = w / 2 - SW - 0.3;
    const stick = `<rect x="${w / 2 - 1.6}" y="${w - 3}" width="3.2" height="${h - w + 3 - SW - 0.3}" rx="1.6"/>`;
    const head = `<circle cx="${w / 2}" cy="${w / 2}" r="${r}"/>`;
    return {
      svg: unionOutline([[stick, c2], [head, '#fff']]) + `<circle cx="${w / 2}" cy="${w / 2}" r="${r * 0.9}" fill="none" stroke="${c1}" stroke-width="1.3"/>`,
      ins: { x: w / 2 - r * 0.68, y: w / 2 - r * 0.68, w: r * 1.36, h: r * 1.36 },
    };
  },
  heart: (w, h) => {
    const d = `M${w / 2} ${h * 0.94}C${w * 0.08} ${h * 0.64} ${w * 0.01} ${h * 0.36} ${w * 0.1} ${h * 0.2}C${w * 0.2} ${h * 0.03} ${w * 0.44} ${h * 0.03} ${w / 2} ${h * 0.24}C${w * 0.56} ${h * 0.03} ${w * 0.8} ${h * 0.03} ${w * 0.9} ${h * 0.2}C${w * 0.99} ${h * 0.36} ${w * 0.92} ${h * 0.64} ${w / 2} ${h * 0.94}Z`;
    return { svg: pathOutline(d), ins: { x: w * 0.2, y: h * 0.22, w: w * 0.6, h: h * 0.42 } };
  },
  bubble: (w, h) => {
    const r = 7, b = h - 9;
    const d = `M${r + 1} 1H${w - r - 1}Q${w - 1} 1 ${w - 1} ${r + 1}V${b - r}Q${w - 1} ${b} ${w - r - 1} ${b}H${w * 0.4}L${w * 0.26} ${h - 1}L${w * 0.3} ${b}H${r + 1}Q1 ${b} 1 ${b - r}V${r + 1}Q1 1 ${r + 1} 1Z`;
    return { svg: pathOutline(d), ins: { x: 5, y: 4, w: w - 10, h: b - 8 } };
  },
  bandaid: (w, h) => {
    const m = SW + 0.3;
    const body = `<rect x="${m}" y="${m}" width="${w - 2 * m}" height="${h - 2 * m}" rx="${(h - 2 * m) / 2}"/>`;
    const dots = (x0: number) => [0, 1, 2].map((r) => [0, 1, 2].map((c2) => `<circle cx="${x0 + c2 * 2.6}" cy="${h / 2 - 2.6 + r * 2.6}" r=".55" fill="#111"/>`).join('')).join('');
    return {
      svg: unionOutline([[body, '#F6D7B8']]) +
        `<rect x="${w * 0.3}" y="${m + 0.6}" width="${w * 0.4}" height="${h - 2 * m - 1.2}" fill="#fff" stroke="#111" stroke-width="${SW * 0.7}"/>` + dots(w * 0.08) + dots(w * 0.8) ,
      ins: { x: w * 0.3 + 1.2, y: m + 2, w: w * 0.4 - 2.4, h: h - 2 * m - 4 },
    };
  },
  pill: (w, h, c1, _c2, seed) => {
    const m = SW + 0.3;
    const id = `pc${seed}`;
    const cap = `<rect x="${m}" y="${m}" width="${w - 2 * m}" height="${h - 2 * m}" rx="${(h - 2 * m) / 2}"/>`;
    return {
      svg: `<defs><clipPath id="${id}">${cap}</clipPath></defs>${unionOutline([[cap, '#fff']])}<rect x="0" y="0" width="${w * 0.3}" height="${h}" fill="${c1}" clip-path="url(#${id})"/><path d="M${w * 0.3} ${m}V${h - m}" stroke="#111" stroke-width="${SW * 0.7}"/>`,
      ins: { x: w * 0.33, y: 3, w: w * 0.62, h: h - 6 },
    };
  },
  drop: (w, h) => {
    const d = `M${w / 2} 1C${w * 0.5} ${h * 0.2} ${w - 1} ${h * 0.42} ${w - 1} ${h * 0.66}C${w - 1} ${h * 0.88} ${w * 0.76} ${h - 1} ${w / 2} ${h - 1}C${w * 0.24} ${h - 1} 1 ${h * 0.88} 1 ${h * 0.66}C1 ${h * 0.42} ${w * 0.5} ${h * 0.2} ${w / 2} 1Z`;
    return { svg: pathOutline(d), ins: { x: w * 0.18, y: h * 0.4, w: w * 0.64, h: h * 0.44 } };
  },
  cloud: (w, h) => {
    const base = `<rect x="${w * 0.08}" y="${h * 0.5}" width="${w * 0.84}" height="${h * 0.42}" rx="${h * 0.21}"/>`;
    const c = (cx: number, cy: number, r: number) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    return {
      svg: unionOutline([[base, '#fff'], [c(w * 0.3, h * 0.52, h * 0.24), '#fff'], [c(w * 0.5, h * 0.4, h * 0.3), '#fff'], [c(w * 0.7, h * 0.5, h * 0.25), '#fff']]),
      ins: { x: w * 0.2, y: h * 0.3, w: w * 0.6, h: h * 0.52 },
    };
  },
  balloon: (w, h, c1, c2) => {
    const m = SW + 0.3;
    const ell = `<ellipse cx="${w / 2}" cy="${h * 0.4}" rx="${w / 2 - m}" ry="${h * 0.4 - m}"/>`;
    const knot = poly([[w / 2 - 2.4, h * 0.82], [w / 2 + 2.4, h * 0.82], [w / 2, h * 0.78]]);
    return {
      svg: unionOutline([[ell, '#fff'], [knot, c1]]) + `<path d="M${w / 2} ${h * 0.82}C${w * 0.34} ${h * 0.88} ${w * 0.66} ${h * 0.92} ${w / 2} ${h - 1.2}" fill="none" stroke="#111" stroke-width="${SW * 0.8}" stroke-linecap="round"/><ellipse cx="${w / 2}" cy="${h * 0.4}" rx="${w / 2 - m - 1.6}" ry="${h * 0.4 - m - 1.6}" fill="none" stroke="${c2}" stroke-width="1.2"/>`,
      ins: { x: w * 0.2, y: h * 0.2, w: w * 0.6, h: h * 0.4 },
    };
  },
};

export const isDieShape = (shape: string): boolean => shape in DIE;

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
<div style="width:13mm;height:13mm">${pop}</div>
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
<div style="position:absolute;inset:1.8mm;border:.3mm solid #111;pointer-events:none"></div>
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
  const ip: Palette = { bg: '#fff', fg: '#111', acc: f1, acc2: f2 };
  const F = TYPE[pr.font] ?? TYPE.secular;
  const dieFont = DIE[pr.shape] != null;
  const isCert = pr.shape === 'cert' || pr.layout === 'seal';
  const titleFamily = isCert && pr.font === 'secular' ? TYPE.frank.family : F.family;
  const titleWeight = isCert && pr.font === 'secular' ? TYPE.frank.weight : F.weight;
  const titleScale = isCert && pr.font === 'secular' ? TYPE.frank.scale : F.scale;
  const hand = hh % 2 === 0 ? "'Gveret Levin', 'Amatic SC', cursive" : "'Amatic SC', 'Gveret Levin', cursive";
  const text = esc(pr.text).replace(/\n/g, '<br>');
  const isPoem = pr.layout === 'poem';
  const subParts = (pr.sub ?? '').split(/\s*·\s*|\n/).map((x) => x.trim()).filter(Boolean);
  const asChips = !isPoem && subParts.length >= 2 && subParts.every((x) => x.length <= 24 && !/_/.test(x));
  const subText = asChips ? '' : (pr.sub ?? '');
  const svgIcon = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">${motif(pr.motif, ip)}</svg>`;
  // סטיקר: עיגול לבן עם קו שחור וצל קשיח
  const sticker = (size: number) => `<div style="width:${size}mm;height:${size}mm;border-radius:50%;background:#fff;border:.5mm solid #111;box-shadow:.8mm .8mm 0 #111;display:flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;padding:${size * 0.17}mm">${svgIcon}</div>`;
  const stripes = `background-color:${f1};background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.3) 0 1.1mm,transparent 1.1mm 2.6mm);`;

  const fitFs = (uw: number, uh: number, maxFs: number): number => {
    const lines = (t: string, size: number) => t.split('\n').reduce((n, seg) => n + Math.max(1, Math.ceil((seg.length * size * titleScale * 0.56) / uw)), 0);
    const chipRows = asChips ? Math.ceil((subParts.reduce((n, x) => n + x.length + 3, 0) * 4.2 * 0.5) / uw) : 0;
    let fs = maxFs;
    const fits = (size: number) => {
      const subSize = Math.max(size * 0.85, 4.2);
      const subH = subText ? lines(subText, subSize * 0.8) * subSize * 1.18 + 1.6 : 0;
      return lines(pr.text, size) * size * titleScale * 1.2 + subH + chipRows * 6.8 + (asChips || subText ? 3 : 0) <= uh;
    };
    while (fs > 2.3 && !fits(fs)) fs -= 0.25;
    return fs;
  };
  const baseMax = (n: number) => (n < 24 ? 8.2 : n < 48 ? 6.6 : n < 90 ? 5.2 : n < 160 ? 4 : 3.2);

  const chipsHtml = (fs: number) => asChips
    ? `<div style="display:flex;flex-wrap:wrap;gap:1.3mm;justify-content:center;margin-top:1.4mm">${subParts.map((t, i) => {
        const col = CHIP_COLORS[(i + hh) % CHIP_COLORS.length];
        const dark = col === '#C137D6';
        return `<span style="background:${col};color:${dark ? '#fff' : '#111'};font-family:${hand};font-weight:700;font-size:${Math.max(4.2, fs * 0.8)}mm;line-height:1;padding:.55mm 2mm .85mm;border:.3mm solid #111;box-shadow:.4mm .4mm 0 #111">${esc(t)}</span>`;
      }).join('')}</div>`
    : '';
  const subHtml = (fs: number) => subText
    ? `<div style="font-family:${hand};font-weight:700;font-size:${Math.max(fs * 0.9, 4.4)}mm;line-height:1.05;margin-top:1.1mm;color:#222">${esc(subText).replace(/\n/g, '<br>')}</div>`
    : '';
  const ruleHtml = (fs: number) => (asChips || subText
    ? `<div style="height:${Math.max(.9, fs * 0.11)}mm;background:${f1};border:.3mm solid #111;border-radius:1mm;width:${Math.min(22, 8 + fs * 1.6)}mm;margin:${fs * 0.22}mm auto ${fs * 0.26}mm"></div>`
    : '');
  const titleHtml = (fs: number) => `<div style="font-family:${titleFamily};font-weight:${titleWeight};font-size:${fs * titleScale}mm;line-height:1.1;color:#111">${text}</div>`;
  const textBlock = (fs: number) => (isPoem
    ? `<div style="font-family:${hand};font-weight:700;font-size:${fs}mm;line-height:1.05;color:#111">${text}${subText ? `<div style="font-family:'Rubik',sans-serif;font-weight:900;font-size:${Math.max(fs * 0.6, 3)}mm;margin-top:1.4mm">${esc(subText)}</div>` : ''}</div>`
    : `${titleHtml(fs)}${ruleHtml(fs)}${chipsHtml(fs)}${subHtml(fs)}`);

  // כרטיס בצורה גזורה לפי הנושא (סוכריה, לב, בלון...)
  const dieFn = DIE[pr.shape];
  if (dieFn && dieFont) {
    const d = dieFn(w, h, f1, f2, hh);
    const maxF = isPoem ? 6.2 : Math.min(baseMax(pr.text.length), Math.min(d.ins.w, d.ins.h) / 3.2);
    const fs = fitFs(d.ins.w, d.ins.h, maxF);
    return `<div style="width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:transparent;color:#111;direction:rtl;text-align:center">
<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:${w}mm;height:${h}mm">${d.svg}</svg>
<div style="position:absolute;left:${d.ins.x}mm;top:${d.ins.y}mm;width:${d.ins.w}mm;height:${d.ins.h}mm;display:flex;flex-direction:column;align-items:center;justify-content:center">${textBlock(fs)}</div></div>`;
  }

  // כרטיסים מלבניים: "פוסטר" עם מסגרת שחורה וצל קשיח, וארבע תבניות הרכב
  const minSide = Math.min(w, h);
  const root = `width:${w}mm;height:${h}mm;box-sizing:border-box;position:relative;overflow:hidden;background:#fff;color:#111;direction:rtl;text-align:center;`;
  const shadow = `<div style="position:absolute;left:2.9mm;top:2.9mm;right:1.3mm;bottom:1.3mm;background:#111"></div>`;
  const pBox = `position:absolute;left:1.3mm;top:1.3mm;right:2.9mm;bottom:2.9mm;background:#fff;border:.5mm solid #111;overflow:hidden;box-sizing:border-box;`;
  const PW = w - 4.2 - 1; // רוחב פנימי של הפוסטר במ"מ (בערך)
  const PH = h - 4.2 - 1;

  let tpl: 'banner' | 'side' | 'badge' | 'frame';
  if (pr.layout === 'poem') tpl = 'frame';
  else if (pr.layout === 'split' || (pr.layout === 'label' && w >= 56)) tpl = 'side';
  else if (pr.layout === 'seal') tpl = 'badge';
  else if (pr.layout === 'sign') tpl = w < 52 ? 'badge' : 'banner';
  else if (w < 50) tpl = hh % 2 ? 'badge' : 'frame';
  else tpl = (['banner', 'badge', 'frame'] as const)[hh % 3];
  if (pr.layout === 'ticket') tpl = 'side';

  if (tpl === 'side') {
    const panelW = Math.min(PW * 0.34, 30);
    const uw = PW - panelW - 8;
    const uh = PH - 6;
    const fs = fitFs(uw, uh, isPoem ? 6.4 : baseMax(pr.text.length));
    const dashed = pr.layout === 'ticket' ? 'border-inline-end:.5mm dashed #111;' : 'border-inline-end:.5mm solid #111;';
    return `<div style="${root}">${shadow}<div style="${pBox}display:flex;align-items:stretch">
<div style="${stripes}${dashed}width:${panelW}mm;flex:none;display:flex;align-items:center;justify-content:center">${sticker(Math.min(panelW * 0.78, PH * 0.6))}</div>
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2mm 3.4mm">${textBlock(fs)}</div></div></div>`;
  }
  if (tpl === 'badge') {
    const bd = Math.min(minSide * 0.28, 17);
    const uw = PW - 8;
    const uh = PH - bd - 5;
    const fs = fitFs(uw, uh, isPoem ? 6.4 : baseMax(pr.text.length));
    return `<div style="${root}">${shadow}<div style="${pBox}display:flex;flex-direction:column;align-items:center">
<div style="${stripes}width:100%;height:${bd * 0.62}mm;border-bottom:.5mm solid #111;flex:none"></div>
<div style="margin-top:${-bd * 0.5}mm;flex:none">${sticker(bd)}</div>
<div style="flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1mm 4mm 2mm">${textBlock(fs)}</div></div></div>`;
  }
  if (tpl === 'banner') {
    const bh = Math.min(Math.max(PH * 0.26, 10), 15);
    const uw = PW - 9;
    const uh = PH - bh - 4;
    const fs = fitFs(uw, uh, isPoem ? 6.4 : baseMax(pr.text.length));
    return `<div style="${root}">${shadow}<div style="${pBox}display:flex;flex-direction:column">
<div style="${stripes}height:${bh}mm;border-bottom:.5mm solid #111;flex:none;display:flex;align-items:center;justify-content:center;gap:3mm">
<div style="flex:1;height:.4mm;background:#111;opacity:.0"></div>${sticker(bh * 1.18)}</div>
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2mm 4.5mm 3mm;margin-top:${bh * 0.2}mm">${textBlock(fs)}</div></div></div>`;
  }
  // frame: מסגרת כפולה, ריבועי פינה, ועיטור עם אייקון קטן
  const orn = Math.min(minSide * 0.17, 11);
  const uw = PW - 12;
  const uh = PH - orn - 8;
  const fs = fitFs(uw, uh, isPoem ? 7.4 : baseMax(pr.text.length));
  const corner = (pos: string) => `<div style="position:absolute;${pos};width:2.6mm;height:2.6mm;background:${f1};border:.3mm solid #111"></div>`;
  return `<div style="${root}">${shadow}<div style="${pBox}">
<div style="position:absolute;inset:1.6mm;border:.3mm dashed #111;pointer-events:none"></div>
${corner('left:.9mm;top:.9mm')}${corner('right:.9mm;top:.9mm')}${corner('left:.9mm;bottom:.9mm')}${corner('right:.9mm;bottom:.9mm')}
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4mm 6mm 3mm">
<div style="width:100%">${textBlock(fs)}</div>
<div style="display:flex;align-items:center;gap:2mm;width:78%;margin-top:${isPoem ? 1.6 : 2.2}mm"><div style="flex:1;height:.4mm;background:#111"></div><div style="width:${orn}mm;height:${orn}mm;flex:none">${svgIcon}</div><div style="flex:1;height:.4mm;background:#111"></div></div></div></div></div>`;
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
  .cell { ${isDieShape(c.print?.shape ?? 'card') ? '' : `outline: .25mm dashed #888; outline-offset: ${gap / 2}mm;`} }
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
