// אפקטים קטנים ומתוחכמים: פיצוץ קונפטי מנקודה (בשמירה למועדפים), בלי ספריות חיצוניות.
const COLORS = ['#D96A2B', '#E8B93C', '#C24270', '#3E7EA6', '#7A9A3E'];

export function burst(origin: Element, count = 16) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = origin.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    const size = 6 + Math.random() * 6;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    Object.assign(el.style, {
      position: 'fixed', left: `${cx}px`, top: `${cy}px`, width: `${size}px`, height: `${size * (Math.random() > 0.5 ? 1 : 0.5)}px`,
      background: COLORS[i % COLORS.length], borderRadius: Math.random() > 0.5 ? '50%' : '2px', zIndex: '9999', pointerEvents: 'none',
      transition: 'transform .75s cubic-bezier(.15,.8,.3,1), opacity .75s ease-out', opacity: '1', transform: 'translate(-50%,-50%)',
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist - 20}px)) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 800);
  }
}
