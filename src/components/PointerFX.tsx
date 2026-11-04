import { useEffect } from 'react';

// הטיה תלת ממדית קלה של אריחים וכרטיסים לפי מיקום העכבר. בנגיעה ובמצב "הפחתת תנועה" לא עושה כלום.
const SEL = '.cat-tile, .new-card, .chup-mini, .parsha-row';

export function PointerFX() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => { if (el) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); } };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(SEL) as HTMLElement | null;
      if (el !== current) { reset(current); current = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(px * -9).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(py * 9).toFixed(2)}deg`);
    };
    const onLeave = () => { reset(current); current = null; };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return null;
}
