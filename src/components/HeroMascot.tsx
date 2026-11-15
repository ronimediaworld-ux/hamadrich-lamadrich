import { MascotIcon } from './TeenAvatar';

// ניצוץ בדף הבית: הדמות המקורית של האתר, עם ריחוף עדין, קרני אור דקות וכוכבים מנצנצים בצדדים.
// בלי תזוזות עיניים ובלי סיבוב אחרי העכבר.
const STARS: { x: string; y: string; s: number; d: number }[] = [
  { x: '-30%', y: '24%', s: 0.14, d: 0 },
  { x: '-48%', y: '60%', s: 0.09, d: 1.4 },
  { x: '124%', y: '30%', s: 0.12, d: 2.1 },
  { x: '142%', y: '66%', s: 0.08, d: 0.7 },
];

export function HeroMascot({ size = 120 }: { size?: number }) {
  return (
    <div className="hm" style={{ width: size, height: size + 18 }} aria-hidden="true">
      <div className="hm-rays" style={{ width: size * 2.1, height: size * 2.1, marginLeft: -size * 1.05, marginTop: -size * 1.05 }} />
      {STARS.map((st, i) => (
        <svg key={i} className="hm-star" viewBox="0 0 24 24" style={{ left: st.x, top: st.y, width: size * st.s, height: size * st.s, animationDelay: `${st.d}s` }}>
          <path d="M12 0 14.6 9.4 24 12 14.6 14.6 12 24 9.4 14.6 0 12 9.4 9.4Z" fill="#FFE59A" />
        </svg>
      ))}
      <div className="hm-flame"><MascotIcon size={size} /></div>
      <div className="hm-shadow" />
    </div>
  );
}
