import { useEffect, useRef, useState } from 'react';
import type { Chupar } from '../data/types';
import { renderCard, SHAPES } from '../lib/chuparDesign';

const MM = 3.7795;

export function ChuparDesign({ chupar, maxWidth }: { chupar: Chupar; maxWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState(240);
  const shape = SHAPES[chupar.print?.shape ?? 'card'] ?? SHAPES.card;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setAvail(el.clientWidth || 240);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const natural = shape.w * MM;
  const target = Math.min(avail, maxWidth ?? avail);
  const scale = Math.min(1.6, target / natural);

  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: natural * scale, height: shape.h * MM * scale, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,.18)', flex: 'none', direction: 'ltr' }}>
        <div
          style={{ width: natural, height: shape.h * MM, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          dangerouslySetInnerHTML={{ __html: renderCard(chupar, window.location.origin) }}
        />
      </div>
    </div>
  );
}
