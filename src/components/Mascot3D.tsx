import { useEffect, useRef } from 'react';

// ניצוץ בתלת מימד: שכבות SVG בעומקים שונים בתוך סצנה עם פרספקטיבה.
// הגוף מסתובב קלות אחרי העכבר או האצבע, כשאין תנועה הוא מתנדנד לבד, ובגלילה הוא זז מעט (פרלקסה).
const FLAME = 'M50 4C53 26 88 42 88 78c0 24-18 38-38 38S12 102 12 78c0-22 18-30 24-50 4 12 10 8 14-24Z';
const INNER = 'M50 52c3 12 22 20 22 36 0 13-10 21-22 21S28 101 28 88c0-12 12-18 22-36Z';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function Mascot3D({ size = 180 }: { size?: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = stage.current;
    const mesh = body.current;
    if (!el || !mesh) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = true;
    let lastMove = -9999;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(window.innerWidth, 1);
      const dy = (e.clientY - (r.top + r.height / 2)) / Math.max(window.innerHeight, 1);
      ty = clamp(dx * 80, -32, 32);
      tx = clamp(-dy * 64, -24, 24);
      lastMove = performance.now();
    };
    const loop = (t: number) => {
      if (visible) {
        if (t - lastMove > 2500) { ty = Math.sin(t / 1400) * 16; tx = Math.cos(t / 1900) * 8; }
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        const shift = clamp(window.scrollY * 0.12, 0, 60);
        mesh.style.transform = `translateY(${shift}px) rotateX(${cx}deg) rotateY(${cy}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const w = size;
  const h = Math.round(size * 1.2);
  return (
    <div ref={stage} className="m3d" style={{ width: w, height: h + 26 }} aria-hidden="true">
      <div className="m3d-spark" style={{ ['--x' as string]: '12%', ['--d' as string]: '0s' }} />
      <div className="m3d-spark" style={{ ['--x' as string]: '82%', ['--d' as string]: '1.1s' }} />
      <div className="m3d-spark" style={{ ['--x' as string]: '28%', ['--d' as string]: '2.2s' }} />
      <div className="m3d-spark" style={{ ['--x' as string]: '66%', ['--d' as string]: '3.1s' }} />
      <div className="m3d-body" ref={body} style={{ width: w, height: h }}>
        <div className="m3d-glow" />
        <svg className="m3d-layer" viewBox="0 0 100 120" style={{ transform: 'translateZ(-26px) scale(1.04)' }}>
          <path d={FLAME} fill="#D2631F" opacity=".55" />
        </svg>
        <svg className="m3d-layer" viewBox="0 0 100 120" style={{ transform: 'translateZ(0)' }}>
          <defs>
            <radialGradient id="m3dBody" cx="36%" cy="38%" r="82%">
              <stop offset="0%" stopColor="#FFD878" />
              <stop offset="42%" stopColor="#F58D2F" />
              <stop offset="100%" stopColor="#D2581A" />
            </radialGradient>
            <linearGradient id="m3dShade" x1="0.2" y1="0.1" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#5A1E00" stopOpacity="0" />
              <stop offset="100%" stopColor="#5A1E00" stopOpacity=".28" />
            </linearGradient>
          </defs>
          <path d={FLAME} fill="url(#m3dBody)" />
          <path d={FLAME} fill="url(#m3dShade)" />
        </svg>
        <svg className="m3d-layer" viewBox="0 0 100 120" style={{ transform: 'translateZ(16px)' }}>
          <defs>
            <linearGradient id="m3dInner" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#FFF6C6" />
              <stop offset="100%" stopColor="#F6B93B" />
            </linearGradient>
          </defs>
          <path d={INNER} fill="url(#m3dInner)" />
        </svg>
        <svg className="m3d-layer" viewBox="0 0 100 120" style={{ transform: 'translateZ(30px)' }}>
          <g className="m3d-eyes">
            <ellipse cx="39" cy="84" rx="4.2" ry="5.4" fill="#5A2A12" />
            <ellipse cx="61" cy="84" rx="4.2" ry="5.4" fill="#5A2A12" />
            <circle cx="40.6" cy="81.8" r="1.7" fill="#fff" />
            <circle cx="62.6" cy="81.8" r="1.7" fill="#fff" />
          </g>
          <circle cx="29" cy="94" r="5.2" fill="#FF7A6B" opacity=".45" />
          <circle cx="71" cy="94" r="5.2" fill="#FF7A6B" opacity=".45" />
          <path d="M41 95q9 8 18 0" fill="none" stroke="#5A2A12" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg className="m3d-layer" viewBox="0 0 100 120" style={{ transform: 'translateZ(42px)' }}>
          <defs>
            <linearGradient id="m3dGloss" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="31" cy="58" rx="7.5" ry="19" transform="rotate(-18 31 58)" fill="url(#m3dGloss)" />
          <circle cx="24" cy="76" r="2.6" fill="#fff" opacity=".6" />
        </svg>
      </div>
      <div className="m3d-shadow" />
    </div>
  );
}
