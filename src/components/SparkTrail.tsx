import { useRef } from 'react';

const COLORS = ['#D96A2B', '#E8B93C', '#C24270'];

// עטיפה שמשאירה "ניצוצות" קטנים אחרי העכבר — רק באזור הנעטף, ורק במכשיר עם עכבר.
export function SparkTrail({ children }: { children: React.ReactNode }) {
  const last = useRef(0);
  const enabled = useRef<boolean | null>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (enabled.current === null) {
      enabled.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    if (!enabled.current) return;
    const now = performance.now();
    if (now - last.current < 45) return;
    last.current = now;
    const el = document.createElement('span');
    const size = 5 + Math.random() * 7;
    Object.assign(el.style, {
      position: 'fixed', left: `${e.clientX}px`, top: `${e.clientY}px`, width: `${size}px`, height: `${size}px`, pointerEvents: 'none', zIndex: '40',
      background: COLORS[Math.floor(Math.random() * COLORS.length)], clipPath: 'polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)',
      transform: 'translate(-50%,-50%) scale(1)', opacity: '0.9', transition: 'transform .7s ease-out, opacity .7s ease-out',
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${(Math.random() - 0.5) * 30}px), calc(-50% + ${10 + Math.random() * 26}px)) scale(0.2) rotate(${Math.random() * 180}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 750);
  }

  return <div onPointerMove={onMove}>{children}</div>;
}
