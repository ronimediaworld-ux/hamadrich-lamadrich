import { useEffect } from 'react';

// הטיה תלת־ממדית עדינה לכרטיסים (אלמנטים עם class="tilt") לפי מיקום העכבר. רק במכשיר עם עכבר, ולא כשביקשו להפחית תנועה.
export function TiltEffect() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let current: HTMLElement | null = null;

    function reset(el: HTMLElement | null) {
      if (!el) return;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }
    function onMove(e: PointerEvent) {
      const el = (e.target as Element | null)?.closest?.('.tilt') as HTMLElement | null;
      if (el !== current) {
        reset(current);
        current = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(-x * 7).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(y * 7).toFixed(2)}deg`);
    }
    function onLeave() {
      reset(current);
      current = null;
    }
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return null;
}
