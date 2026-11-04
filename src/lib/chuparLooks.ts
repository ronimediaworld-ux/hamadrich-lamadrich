// קומפוזיציות לכרטיסי צ׳ופר מלבניים — בהשראת העיצובים המקוריים:
// רקע לבן, מסגרת שחורה דקה, כיתוב שחור עבה, גושי צבע שטוחים (ריבועים מוטים, כתמים, תוויות מרקר).
// כל "לוק" מחזיר ציור SVG (ביחידות מ"מ) ואזור טקסט; ההרכבה עצמה נעשית ב-renderCard.

export interface Box { x: number; y: number; w: number; h: number }

export interface LookOut {
  svg: string;
  box?: Box;
  titleBox?: Box; // כשהכותרת והמשנה נפרדות (סרט)
  subBox?: Box;
  bg?: string;
  ink?: string;
  rule?: string;
  hl?: string[]; // צבעי מרקר מאחורי שורות הכותרת
  maxF?: number;
}

export interface LookCtx {
  w: number;
  h: number;
  c: [string, string, string]; // שני צבעים בהירים וצבע כהה
  hh: number;
  hasSub: boolean;
  poem: boolean;
  // ציור קטן מתוך הספרייה, במיקום ובגודל במ"מ
  icon: (x: number, y: number, size: number, pal?: { fg: string; acc: string; acc2: string }, rot?: number) => string;
}

export type LookFn = (X: LookCtx) => LookOut;

const FR = 1.6; // שוליים של המסגרת
const n2 = (n: number) => +n.toFixed(2);

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- אבני בניין ל-SVG ----
const frame = (w: number, h: number, col = '#111', sw = 0.35, dash = '') =>
  `<rect x="${FR}" y="${FR}" width="${n2(w - 2 * FR)}" height="${n2(h - 2 * FR)}" fill="none" stroke="${col}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

const rect = (x: number, y: number, w: number, h: number, fill: string, rot = 0, stroke = '', sw = 0.3) =>
  `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''}${rot ? ` transform="rotate(${rot} ${n2(x + w / 2)} ${n2(y + h / 2)})"` : ''}/>`;

const circ = (cx: number, cy: number, r: number, fill: string, stroke = '', sw = 0.3, dash = '') =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

const polyg = (pts: Array<[number, number]>, fill: string, stroke = '', sw = 0.3) =>
  `<polygon points="${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ')}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;

const line = (x1: number, y1: number, x2: number, y2: number, col = '#111', sw = 0.3, cap = 'butt') =>
  `<path d="M${n2(x1)} ${n2(y1)}L${n2(x2)} ${n2(y2)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="${cap}" fill="none"/>`;

function blob(cx: number, cy: number, r: number, fill: string, seed: number): string {
  const rnd = rng(seed);
  const n = 8;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.74 + rnd() * 0.36);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = `M${n2(pts[0][0])} ${n2(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${n2(p1[0] + (p2[0] - p0[0]) / 6)} ${n2(p1[1] + (p2[1] - p0[1]) / 6)} ${n2(p2[0] - (p3[0] - p1[0]) / 6)} ${n2(p2[1] - (p3[1] - p1[1]) / 6)} ${n2(p2[0])} ${n2(p2[1])}`;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
}

const plus = (cx: number, cy: number, r: number, col: string, sw = 0.7) =>
  `<path d="M${n2(cx - r)} ${n2(cy)}H${n2(cx + r)}M${n2(cx)} ${n2(cy - r)}V${n2(cy + r)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;

const star4 = (cx: number, cy: number, r: number, fill: string) =>
  `<path d="M${n2(cx)} ${n2(cy - r)}Q${n2(cx + r * 0.18)} ${n2(cy - r * 0.18)} ${n2(cx + r)} ${n2(cy)}Q${n2(cx + r * 0.18)} ${n2(cy + r * 0.18)} ${n2(cx)} ${n2(cy + r)}Q${n2(cx - r * 0.18)} ${n2(cy + r * 0.18)} ${n2(cx - r)} ${n2(cy)}Q${n2(cx - r * 0.18)} ${n2(cy - r * 0.18)} ${n2(cx)} ${n2(cy - r)}Z" fill="${fill}"/>`;

function squiggle(x: number, y: number, len: number, amp: number, col: string, sw = 0.6, waves = 4): string {
  const step = len / (waves * 2);
  let d = `M${n2(x)} ${n2(y)}`;
  for (let i = 0; i < waves * 2; i++) d += `q${n2(step / 2)} ${n2(i % 2 ? amp : -amp)} ${n2(step)} 0`;
  return `<path d="${d}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
}

const sticker = (X: LookCtx, cx: number, cy: number, r: number, rot = 0) =>
  `${circ(cx, cy, r, '#fff', '#111', 0.35)}${X.icon(cx - r * 0.66, cy - r * 0.66, r * 1.32, undefined, rot)}`;

// פאנל לצד הטקסט: לרוחב — בצד אחד; לגובה — למעלה
function split(X: LookCtx, frac = 0.36, maxP = 32) {
  const { w, h } = X;
  const horiz = w >= h * 1.15;
  if (horiz) {
    const pw = Math.min(w * frac, maxP);
    const right = X.hh % 3 === 0;
    const px = right ? w - FR - pw : FR;
    const box: Box = { x: right ? FR + 3 : FR + pw + 2, y: FR + 2, w: w - 2 * FR - pw - 5, h: h - 2 * FR - 4 };
    return { horiz, px, py: FR, pw, ph: h - 2 * FR, box, right };
  }
  const ph = Math.min(h * frac, maxP);
  return { horiz, px: FR, py: FR, pw: w - 2 * FR, ph, box: { x: FR + 3, y: FR + ph + 1, w: w - 2 * FR - 6, h: h - 2 * FR - ph - 3 } as Box, right: false };
}

const WHITE_ICON = (X: LookCtx) => ({ fg: '#fff', acc: X.c[1], acc2: X.c[0] });

export const LOOKS: Record<string, LookFn> = {
  // כמו "אקמולרוני": כתם + ריבועים מוטים וריבוע פחם עם ציור, כותרת עבה וקו עבה
  blobs: (X) => {
    const s = split(X);
    const cx = s.px + s.pw / 2, cy = s.py + s.ph / 2;
    const b = Math.min(s.pw, s.ph);
    const sq = b * 0.62;
    const dark = X.c[2];
    return {
      svg: frame(X.w, X.h) + blob(cx, cy, b * 0.6, X.c[0], X.hh)
        + rect(cx - sq / 2 - b * 0.04, cy - sq / 2 - b * 0.06, sq, sq, dark, 14)
        + rect(cx - b * 0.3, cy - b * 0.3, b * 0.46, b * 0.46, '#404040')
        + rect(cx - b * 0.02, cy + b * 0.02, b * 0.3, b * 0.3, '#404040')
        + X.icon(cx - b * 0.27, cy - b * 0.27, b * 0.4, WHITE_ICON(X)),
      box: s.box,
      rule: '#404040',
    };
  },

  // מרקר: שורות הכותרת על פסי צבע, מדבקה בפינה
  highlight: (X) => {
    const r = Math.max(4, Math.min(6, Math.min(X.w, X.h) * 0.1));
    const left = X.hh % 2 === 0;
    const sx = left ? FR + r + 1.2 : X.w - FR - r - 1.2;
    return {
      svg: frame(X.w, X.h) + circ(sx, FR + r + 1.2, r + 1.4, X.c[0]) + sticker(X, sx, FR + r + 1.2, r)
        + star4(X.w - sx, X.h - FR - 4.2, 2.4, X.c[1]) + circ(X.w - sx + 5, X.h - FR - 3, 0.9, X.c[2])
        + squiggle(left ? X.w - 24 : 8, FR + 4, 14, 0.9, X.c[2], 0.5, 3),
      box: { x: 6, y: 6.5 + (X.h > 50 ? 3 : 0), w: X.w - 12, h: X.h - 13 - (X.h > 50 ? 3 : 0) },
      hl: [X.c[1], X.c[0], X.c[1], X.c[0]],
    };
  },

  // פס צבע לאורך הצד עם עיגולים וציור
  stripe: (X) => {
    const s = split(X, 0.2, 18);
    const dark = X.c[2];
    let art = '';
    if (s.horiz) {
      const cx = s.px + s.pw / 2;
      art = rect(s.px, s.py, s.pw, s.ph, X.c[0]) + rect(s.right ? s.px - 2.4 : s.px + s.pw, s.py, 2.4, s.ph, X.c[1]);
      const n = Math.max(2, Math.floor((s.ph - 22) / 5));
      for (let i = 0; i < n; i++) art += circ(cx, s.py + 3 + i * 4.4, 0.8, dark);
      art += sticker(X, cx, s.py + s.ph / 2, Math.min(s.pw * 0.42, 7.4));
      art += circ(cx, s.py + s.ph - 3, 0.8, dark);
    } else {
      const cy = s.py + s.ph / 2;
      art = rect(s.px, s.py, s.pw, s.ph, X.c[0]) + rect(s.px, s.py + s.ph, s.pw, 2.2, X.c[1]);
      for (let i = 0; i < 6; i++) art += circ(s.px + 5 + i * 5, cy + (i % 2 ? 4 : -4), 0.7, dark);
      art += sticker(X, s.px + s.pw / 2, cy, Math.min(s.ph * 0.4, 7.4));
    }
    return { svg: frame(X.w, X.h) + art, box: s.box, rule: X.c[2] };
  },

  // שלושה דפים זה על זה, בשכבות מוטות
  layers: (X) => {
    const { w, h } = X;
    const rot = X.hh % 2 ? 1 : -1;
    const r = Math.max(4, Math.min(6.4, Math.min(w, h) * 0.1));
    const sx = X.hh % 3 === 0 ? w - 7 : 7;
    return {
      svg: rect(2.6, 2.6, w - 5.2, h - 5.2, X.c[0], -2.6 * rot) + rect(2.2, 2.2, w - 4.4, h - 4.4, X.c[1], 2.1 * rot)
        + rect(FR + 1.4, FR + 1.4, w - 2 * FR - 2.8, h - 2 * FR - 2.8, '#fff', 0, '#111', 0.35)
        + sticker(X, sx, 7, r, -8 * rot),
      box: { x: 6.4, y: 7.5 + (h > 52 ? 2 : 0), w: w - 12.8, h: h - 14 - (h > 52 ? 2 : 0) },
    };
  },

  // קונפטי בפינות: עיגולים, משולשים, פלוסים וכתם עם ציור
  confetti: (X) => {
    const { w, h } = X;
    const rnd = rng(X.hh + 7);
    const [a, b, d] = X.c;
    let art = frame(X.w, X.h);
    const corners: Array<[number, number, number, number]> = [[1, 1, 1, 1], [-1, 1, 1, 1], [1, -1, 1, 1], [-1, -1, 1, 1]];
    corners.forEach(([sx, sy], idx) => {
      const ox = sx > 0 ? FR + 3 : w - FR - 3;
      const oy = sy > 0 ? FR + 3 : h - FR - 3;
      if (idx === 0) {
        art += blob(ox + 4.5 * sx, oy + 4.5 * sy, 8, b, X.hh) + X.icon(ox - 0.8, oy - 0.8, 10, undefined, -8);
        return;
      }
      art += circ(ox + sx * (2 + rnd() * 4), oy + sy * (7 + rnd() * 4), 1.6 + rnd(), a);
      art += polyg([[ox + sx * 8, oy + sy * 2], [ox + sx * 12, oy + sy * 2], [ox + sx * 10, oy + sy * 6]], b, '#111', 0.25);
      art += plus(ox + sx * (3 + rnd() * 3), oy + sy * 3, 1.8, d, 0.6);
      art += circ(ox + sx * (13 + rnd() * 3), oy + sy * (7 + rnd() * 2), 1.1, 'none', '#111', 0.35);
    });
    art += squiggle(w / 2 - 7, FR + 3.5, 14, 0.8, a, 0.6, 3);
    return { svg: art, box: { x: 12, y: 7, w: w - 24, h: h - 14 } };
  },

  // דבק נייר בפינות ודף עם רקע בהיר
  tape: (X) => {
    const { w, h } = X;
    const t = (cx: number, cy: number, rot: number, col: string) =>
      `<g transform="rotate(${rot} ${n2(cx)} ${n2(cy)})"><rect x="${n2(cx - 8.5)}" y="${n2(cy - 2.6)}" width="17" height="5.2" fill="${col}" fill-opacity=".88" stroke="#111" stroke-width=".2"/>${line(cx - 4, cy - 2.6, cx - 4, cy + 2.6, '#fff', 0.35)}${line(cx + 4, cy - 2.6, cx + 4, cy + 2.6, '#fff', 0.35)}</g>`;
    return {
      svg: `<rect x="${FR + 1}" y="${FR + 1.6}" width="${n2(w - 2 * FR - 2)}" height="${n2(h - 2 * FR - 2.2)}" fill="${X.c[1]}" fill-opacity=".34" stroke="#111" stroke-width=".35"/>`
        + t(FR + 6, FR + 3.2, -32, X.c[0]) + t(w - FR - 6, FR + 3.2, 32, X.c[2] === '#404040' ? X.c[1] : X.c[0])
        + sticker(X, w - FR - 7, h - FR - 7, Math.max(3.6, Math.min(5.4, Math.min(w, h) * 0.09)), 8),
      box: { x: 6, y: 8, w: w - 12, h: h - 15 },
    };
  },

  // סרט שמכריז על הכותרת באמצע הכרטיס
  ribbon: (X) => {
    const { w, h } = X;
    const y0 = h * 0.33, rh = h * 0.36;
    const x0 = FR + 6;
    const tail = (left: boolean) => {
      const xo = left ? FR + 0.4 : w - FR - 0.4;
      const xi = left ? x0 + 3.6 : w - x0 - 3.6;
      const xn = left ? FR + 4.4 : w - FR - 4.4;
      return polyg([[xo, y0 + 3], [xi, y0 + 3], [xi, y0 + rh + 3], [xo, y0 + rh + 3], [xn, y0 + rh / 2 + 3]], X.c[2], '#111', 0.3);
    };
    const r = Math.min(y0 - FR - 1, 6.2);
    return {
      svg: frame(w, h) + tail(true) + tail(false)
        + rect(x0, y0, w - 2 * x0, rh, X.c[0], 0, '#111', 0.35)
        + polyg([[x0, y0 + rh], [x0 + 3.6, y0 + rh], [x0 + 3.6, y0 + rh + 3]], '#111')
        + polyg([[w - x0, y0 + rh], [w - x0 - 3.6, y0 + rh], [w - x0 - 3.6, y0 + rh + 3]], '#111')
        + sticker(X, w / 2, y0 - r - 0.6, r)
        + star4(FR + 7, FR + 6, 2.4, X.c[1]) + star4(w - FR - 7, FR + 6, 2.4, X.c[1]),
      titleBox: { x: x0 + 3.5, y: y0 + 0.8, w: w - 2 * x0 - 7, h: rh - 1.6 },
      subBox: { x: FR + 5, y: y0 + rh + 4, w: w - 2 * FR - 10, h: h - y0 - rh - FR - 5 },
    };
  },

  // עיגול ענק מאחורי הכיתוב
  circle: (X) => {
    const { w, h } = X;
    const r = Math.min(h * 0.46, w * 0.38);
    const cx = w / 2, cy = h / 2;
    const s = r * 1.62;
    return {
      svg: frame(w, h) + circ(cx, cy, r, X.c[1]) + circ(cx, cy, r + 1.8, 'none', X.c[2], 0.45, '1.2 1.2')
        + circ(cx - r * 1.12, cy - r * 0.55, 1.8, X.c[0]) + circ(cx + r * 1.15, cy + r * 0.3, 2.6, X.c[0]) + circ(cx + r * 0.95, cy - r * 0.78, 1.1, X.c[2])
        + circ(cx - r * 0.98, cy + r * 0.78, 1.2, '#111') + plus(cx + r * 1.3, cy - r * 0.6, 1.6, '#111', 0.5)
        + sticker(X, cx + r * 0.78, cy + r * 0.84, Math.max(3.6, Math.min(5.4, r * 0.3)), 10),
      box: { x: cx - s * 0.46, y: cy - s * 0.44, w: s * 0.92, h: s * 0.88 },
    };
  },

  // פס אלכסוני בצבעים עם ציור
  diag: (X) => {
    const s = split(X, 0.38, 34);
    const dark = X.c[2];
    let art = '';
    if (s.horiz) {
      const x = s.px, w = s.pw, y = s.py, h = s.ph;
      const cut = w * 0.6;
      const pts: Array<[number, number]> = s.right ? [[x + w, y], [x, y], [x + w - cut, y + h], [x + w, y + h]] : [[x, y], [x + w, y], [x + cut, y + h], [x, y + h]];
      const st = s.right ? [[x, y], [x - 3, y], [x + w - cut - 3, y + h], [x + w - cut, y + h]] as Array<[number, number]> : [[x + w, y], [x + w + 3, y], [x + cut + 3, y + h], [x + cut, y + h]] as Array<[number, number]>;
      art = polyg(st, X.c[1]) + polyg(pts, X.c[0]) + sticker(X, s.right ? x + w - cut * 0.5 - 1 : x + cut * 0.5 + 1, y + h / 2, Math.min(w * 0.3, 7.6));
      art += circ(x + (s.right ? w - 5 : 5), y + 5, 1.1, dark) + circ(x + (s.right ? w - 5 : 5), y + h - 5, 1.1, dark);
    } else {
      const x = s.px, w = s.pw, y = s.py, h = s.ph;
      const cut = h * 0.62;
      art = polyg([[x, y + h + 2.4], [x + w, y + cut + 2.4], [x + w, y + cut + 5.4], [x, y + h + 5.4]].map(([a, b]) => [a, Math.min(b, y + h + 3)] as [number, number]), X.c[1])
        + polyg([[x, y], [x + w, y], [x + w, y + cut], [x, y + h]], X.c[0]) + sticker(X, x + w / 2, y + h * 0.42, Math.min(h * 0.32, 7.6));
    }
    return { svg: frame(X.w, X.h) + art, box: s.box };
  },

  // קשתות בצבעים עם ציור בתוך הקשת
  arch: (X) => {
    const s = split(X, 0.44, 42);
    const R = Math.min(s.pw * 0.5, s.ph * 0.86);
    const cx = s.px + s.pw / 2, by = s.py + s.ph;
    const half = (r: number, fill: string) => `<path d="M${n2(cx - r)} ${n2(by)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(cx + r)} ${n2(by)}Z" fill="${fill}"/>`;
    const ic = R * 0.5;
    return {
      svg: frame(X.w, X.h) + half(R, X.c[0]) + half(R * 0.74, X.c[1]) + half(R * 0.5, '#fff')
        + `<path d="M${n2(cx - R)} ${n2(by)}A${n2(R)} ${n2(R)} 0 0 1 ${n2(cx + R)} ${n2(by)}" fill="none" stroke="#111" stroke-width=".35"/>`
        + X.icon(cx - ic * 0.86, by - ic * 1.5, ic * 1.72, undefined)
        + circ(cx - R - 0.2 > s.px + 2 ? cx - R * 1.0 : s.px + 3, by - 4, 0.9, X.c[2]) + star4(s.px + 4.2, s.py + 4.5, 2.2, X.c[1]),
      box: s.box,
    };
  },

  // מוזאיקה של ריבועי צבע, אחד מהם עם הציור
  grid: (X) => {
    const s = split(X, 0.34, 30);
    const cols = s.horiz ? 2 : 4;
    const rows = s.horiz ? 3 : 1;
    const g = 1.2;
    const cell = Math.min((s.pw - g * (cols + 1)) / cols, (s.ph - g * (rows + 1)) / rows);
    const ox = s.px + (s.pw - (cell * cols + g * (cols - 1))) / 2;
    const oy = s.py + (s.ph - (cell * rows + g * (rows - 1))) / 2;
    const cols3 = [X.c[0], X.c[1], X.c[2], '#fff', X.c[1], X.c[0], X.c[2], X.c[1]];
    const iconAt = s.horiz ? 3 : 1;
    let art = '';
    for (let i = 0; i < cols * rows; i++) {
      const cx0 = ox + (i % cols) * (cell + g), cy0 = oy + Math.floor(i / cols) * (cell + g);
      art += rect(cx0, cy0, cell, cell, cols3[i], 0, i === iconAt ? '#111' : '', 0.35);
      if (i === iconAt) art += X.icon(cx0 + cell * 0.12, cy0 + cell * 0.12, cell * 0.76);
    }
    return { svg: frame(X.w, X.h) + art, box: s.box };
  },

  // דגלונים תלויים בחוט
  bunting: (X) => {
    const { w, h } = X;
    const n = Math.max(5, Math.floor((w - 8) / 9));
    const step = (w - 2 * FR - 4) / n;
    const cols = [X.c[0], X.c[1], X.c[2], '#fff'];
    let art = frame(w, h);
    art += `<path d="M${FR + 1.5} ${FR + 2.2}Q${w / 2} ${FR + 6.6} ${w - FR - 1.5} ${FR + 2.2}" stroke="#111" stroke-width=".3" fill="none"/>`;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const x = FR + 2 + step * (i + 0.5);
      const y = FR + 2.2 + (1 - (2 * t - 1) ** 2) * 2.2;
      art += polyg([[x - step * 0.4, y], [x + step * 0.4, y], [x, y + 6.4]], cols[(i + X.hh) % 4], '#111', 0.3);
    }
    art += sticker(X, X.hh % 2 ? FR + 6.4 : w - FR - 6.4, h - FR - 6.4, Math.max(3.6, Math.min(5.2, Math.min(w, h) * 0.09)), -8)
      + star4(X.hh % 2 ? w - FR - 5 : FR + 5, h - FR - 5, 2.2, X.c[1]);
    return { svg: art, box: { x: 6, y: 13, w: w - 12, h: h - 19.5 } };
  },

  // רצועת נקודות (חצי-טון) בתחתית עם מדבקה
  dots: (X) => {
    const { w, h } = X;
    const rows = 4;
    let art = frame(w, h);
    for (let r = 0; r < rows; r++) {
      const y = h - FR - 1.6 - r * 2.3;
      const rad = 1.05 - r * 0.2;
      for (let x = FR + 1.4; x < w - FR - 0.8; x += 2.9) art += circ(x + (r % 2 ? 1.45 : 0), y, rad, X.c[r % 2 ? 1 : 0]);
    }
    const sr = Math.max(4, Math.min(6, Math.min(w, h) * 0.1));
    art += sticker(X, X.hh % 2 ? w - FR - sr - 2 : FR + sr + 2, h - FR - 9.5 - sr * 0.2, sr, -6);
    art += rect(w / 2 - 6, FR + 3, 12, 1, X.c[2]);
    return { svg: art, box: { x: 6, y: 7, w: w - 12, h: h - 22 } };
  },

  // לוח גיר
  chalk: (X) => {
    const { w, h } = X;
    const wh = '#F4F1E6';
    return {
      bg: '#2B3A33',
      ink: wh,
      rule: '#F4D35E',
      svg: `<rect x="1.4" y="1.4" width="${n2(w - 2.8)}" height="${n2(h - 2.8)}" rx="1.6" fill="none" stroke="${wh}" stroke-width=".45" stroke-dasharray="2.2 1.4"/>`
        + star4(FR + 6, FR + 6, 3, '#F4D35E') + star4(w - FR - 6, h - FR - 6, 2.4, '#8FD1B5') + plus(w - FR - 6, FR + 6, 1.8, '#F27FE0', 0.6)
        + squiggle(FR + 4, h - FR - 4, 14, 0.8, '#8FD1B5', 0.6, 3) + circ(FR + 6, h * 0.5, 0.9, '#F27FE0')
        + X.icon(w - FR - 13, FR + 2.4, 10, { fg: wh, acc: '#F4D35E', acc2: '#8FD1B5' }, 8),
      box: { x: 8, y: 7.5, w: w - 16, h: h - 14 },
    };
  },
};

export const LOOK_NAMES = Object.keys(LOOKS);
