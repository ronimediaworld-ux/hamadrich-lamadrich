// רקע איורי רך לדף הבית: שמיים בצבעי פסטל, ענני נייר, נצנוצים, דגלוני מחנה וגבעות עם אוהל קטן.
// קישוט בלבד, בלי טקסט, ולכן מוסתר מקוראי מסך.
const SPARKLE = 'M12 0 14.2 9.8 24 12 14.2 14.2 12 24 9.8 14.2 0 12 9.8 9.8Z';

function Cloud({ x, y, s = 1, o = 0.95 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={o}>
      <circle cx="0" cy="0" r="30" />
      <circle cx="38" cy="-12" r="38" />
      <circle cx="84" cy="2" r="30" />
      <rect x="-30" y="0" width="144" height="30" rx="15" />
    </g>
  );
}

function Bunting({ x1, x2, y, drop, colors }: { x1: number; x2: number; y: number; drop: number; colors: string[] }) {
  const mid = (x1 + x2) / 2;
  const d = `M${x1} ${y} Q${mid} ${y + drop} ${x2} ${y}`;
  const flags = colors.map((c, i) => {
    const t = (i + 1) / (colors.length + 1);
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mid + t * t * x2;
    const yy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + drop) + t * t * y;
    return <path key={i} d={`M${x - 11} ${yy} L${x + 11} ${yy} L${x} ${yy + 24}Z`} fill={c} />;
  });
  return (
    <g>
      <path d={d} fill="none" stroke="#B9AFA3" strokeWidth="1.6" />
      {flags}
    </g>
  );
}

export function HeroScene() {
  return (
    <svg className="hero-scene-art" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <Cloud x={250} y={170} s={1.05} />
      <Cloud x={1040} y={130} s={0.9} />
      <circle cx="1210" cy="270" r="38" fill="#FFE9A8" opacity=".9" />
      <Bunting x1={0} x2={420} y={18} drop={46} colors={['#FFD1BD', '#F7E6A6', '#BFE3D0', '#C9D6F5', '#F6C4D3', '#FFD1BD']} />
      <Bunting x1={1020} x2={1440} y={18} drop={46} colors={['#C9D6F5', '#F6C4D3', '#F7E6A6', '#BFE3D0', '#FFD1BD', '#C9D6F5']} />
      {[[420, 320, 0.7], [1010, 330, 0.55], [560, 120, 0.4], [880, 110, 0.5], [190, 330, 0.5], [1280, 130, 0.6]].map(([x, y, s], i) => (
        <path key={i} d={SPARKLE} transform={`translate(${x} ${y}) scale(${s})`} fill="#F8D774" opacity=".85" />
      ))}
      {/* גבעות */}
      <path d="M0 470 C180 420 330 440 520 462 C720 486 900 430 1100 450 C1260 466 1360 440 1440 430 L1440 560 L0 560Z" fill="#D8EEDD" />
      <path d="M0 510 C220 470 420 500 640 506 C860 512 1060 470 1240 490 C1340 500 1400 496 1440 488 L1440 560 L0 560Z" fill="#FFE6D6" />
      <path d="M0 536 C240 512 520 540 760 540 C1020 540 1220 516 1440 530 L1440 560 L0 560Z" fill="#FFFAF4" />
      {/* אוהל וצמחייה קטנה */}
      <g transform="translate(1060 436)">
        <path d="M0 78 L44 8 L88 78Z" fill="#FFF7EE" />
        <path d="M44 8 L44 78 L88 78Z" fill="#F6D9C4" />
        <path d="M30 78 L44 44 L58 78Z" fill="#E9B896" />
        <path d="M44 8 V-14" stroke="#B9AFA3" strokeWidth="2" />
        <path d="M44 -14 L62 -9 L44 -3Z" fill="#EE7B4D" />
      </g>
      <g fill="#B7DCC1">
        <path d="M236 486 l16 -44 l16 44z" /><path d="M262 490 l12 -32 l12 32z" fill="#C8E6D0" />
        <path d="M820 488 l14 -38 l14 38z" />
      </g>
    </svg>
  );
}
