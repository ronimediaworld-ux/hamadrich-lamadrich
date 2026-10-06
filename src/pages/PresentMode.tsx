import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getActivity } from '../data/activities';
import type { Activity, FlowStep } from '../data/types';
import { useDocumentTitle } from '../lib/useDocumentTitle';

interface Slide { kind: 'title' | 'step' | 'end'; label: string; minutes?: number; body?: string; items?: string[]; note?: string; link?: { title: string; url: string } }

function buildSlides(a: Activity): Slide[] {
  const slides: Slide[] = [{ kind: 'title', label: a.title, body: a.description, items: a.equipment.length ? [`ציוד: ${a.equipment.join(', ')}`] : undefined }];
  const steps: FlowStep[] = a.flow && a.flow.length ? a.flow : [
    { label: 'פתיחה', body: a.opening },
    ...(a.game ? [{ label: 'משחק', body: a.game }] : []),
    { label: 'מתודה', body: a.method },
    ...(a.discussion?.length ? [{ label: 'דיון', items: a.discussion }] : []),
    { label: 'סיכום', body: a.summary },
  ];
  for (const s of steps) {
    const m = s.label.match(/^(.*?)\s*\((\d+)\s*דק[׳']\)\s*$/);
    slides.push({ kind: 'step', label: m ? m[1] : s.label, minutes: m ? Number(m[2]) : undefined, body: s.body, items: s.items, note: s.note, link: s.link });
  }
  slides.push({ kind: 'end', label: 'סיימנו — כל הכבוד!', body: a.tip ? `טיפ למדריך: ${a.tip}` : undefined });
  return slides;
}

function fmt(sec: number): string {
  const s = Math.max(0, sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// מצב "בפעולה": מסך גדול וקריא, שלב אחרי שלב, עם שעון לכל שלב — כדי להעביר מהטלפון או מהמחשב בלי לגלול.
export function PresentMode() {
  const { id } = useParams();
  const activity = getActivity(id ?? '');
  useDocumentTitle(activity ? `${activity.title} — מצב בפעולה` : 'מצב בפעולה');
  const slides = useMemo(() => (activity ? buildSlides(activity) : []), [activity]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  const slide = slides[i];
  const go = useCallback((d: number) => setI((x) => Math.min(slides.length - 1, Math.max(0, x + d))), [slides.length]);

  useEffect(() => {
    setLeft(slide?.minutes ? slide.minutes * 60 : null);
    setRunning(false);
  }, [i, slide?.minutes]);

  useEffect(() => {
    if (!running || left === null) return;
    const t = window.setInterval(() => setLeft((x) => (x === null ? x : x - 1)), 1000);
    return () => window.clearInterval(t);
  }, [running, left === null]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // בעברית הכיוון הפוך: חץ שמאלה = הבא
      if (e.key === 'ArrowLeft' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(-1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // מסך לא נכבה בזמן פעולה (אם הדפדפן תומך)
  useEffect(() => {
    const nav = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request('screen').then((l) => { wake.current = l; }).catch(() => { /* לא נתמך */ });
    return () => { wake.current?.release().catch(() => { /* */ }); };
  }, []);

  if (!activity || !slide) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>הפעולה לא נמצאה</h1>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה לדף הבית</Link>
      </div>
    );
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }

  const overtime = left !== null && left < 0;
  return (
    <div className="present" style={{ minHeight: '100vh', background: '#1E1710', color: '#F7EBD2', display: 'flex', flexDirection: 'column', padding: 'clamp(16px, 3vw, 36px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Link to={`/activity/${activity.id}`} style={{ color: '#CBBFA6', fontSize: 14 }}>→ חזרה לפעולה</Link>
        <div style={{ display: 'flex', gap: 6 }} aria-label={`שלב ${i + 1} מתוך ${slides.length}`}>
          {slides.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`שלב ${k + 1}`} style={{ width: k === i ? 28 : 12, height: 12, borderRadius: 999, border: 'none', cursor: 'pointer', background: k === i ? 'var(--flame)' : k < i ? '#8C7F6B' : '#4A3E2E', transition: 'width .2s' }} />
          ))}
        </div>
        <button type="button" onClick={toggleFullscreen} style={{ background: 'transparent', border: '1px solid #6B5A44', color: '#F7EBD2', borderRadius: 999, padding: '6px 14px', fontSize: 13 }}>מסך מלא</button>
      </div>

      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 980, width: '100%', margin: '0 auto', animation: 'cardIn .35s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: slide.kind === 'title' ? 'clamp(34px, 6vw, 64px)' : 'clamp(26px, 4.4vw, 46px)', color: slide.kind === 'step' ? '#F2C85B' : '#fff', lineHeight: 1.15, marginBottom: 18 }}>
          {slide.kind === 'step' && <span style={{ color: '#8C7F6B', marginInlineEnd: 12 }}>{i}.</span>}
          {slide.label}
        </div>
        {slide.body && (
          <div style={{ fontSize: 'clamp(19px, 2.8vw, 30px)', lineHeight: 1.65, whiteSpace: 'pre-line', color: '#F7EBD2' }}>{slide.body}</div>
        )}
        {slide.items && slide.items.length > 0 && (
          <ul style={{ margin: '16px 0 0', paddingInlineStart: 28, fontSize: 'clamp(18px, 2.6vw, 28px)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slide.items.map((it, k) => <li key={k}>{it}</li>)}
          </ul>
        )}
        {slide.link && (
          <a href={slide.link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 20, color: '#F2C85B', fontWeight: 700, fontSize: 20, textDecoration: 'underline' }}>{slide.link.title} ↗</a>
        )}
        {slide.note && <div style={{ marginTop: 18, fontSize: 17, color: '#CBBFA6' }}>{slide.note}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-flame" onClick={() => go(-1)} disabled={i === 0} style={{ opacity: i === 0 ? 0.35 : 1 }}>→ הקודם</button>
        {left !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 'clamp(30px, 5vw, 52px)', color: overtime ? '#FF8A7A' : '#fff', fontVariantNumeric: 'tabular-nums', direction: 'ltr' }}>{overtime ? '-' : ''}{fmt(Math.abs(left))}</span>
            <button type="button" onClick={() => setRunning((r) => !r)} style={{ background: '#F7EBD2', color: '#1E1710', border: 'none', borderRadius: 999, padding: '9px 20px', fontWeight: 800, fontSize: 15 }}>{running ? 'עצירה' : 'התחלה'}</button>
            <button type="button" onClick={() => { setLeft(slide.minutes ? slide.minutes * 60 : null); setRunning(false); }} style={{ background: 'transparent', border: '1px solid #6B5A44', color: '#F7EBD2', borderRadius: 999, padding: '8px 16px', fontSize: 13 }}>איפוס</button>
          </div>
        )}
        <button type="button" className="btn btn-flame" onClick={() => go(1)} disabled={i === slides.length - 1} style={{ opacity: i === slides.length - 1 ? 0.35 : 1 }}>הבא ←</button>
      </div>
    </div>
  );
}
