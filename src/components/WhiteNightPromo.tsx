import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePdfViewer } from './PdfViewerModal';

// קידום זמני בעמוד הבית: מדריך "לילה לבן". מוצג רק בטווח התאריכים, ונעלם לבד אחר כך.
const FROM = new Date('2026-11-18T00:00:00');
const TO = new Date('2026-11-25T23:59:59');
const EVENTS_URL = '/category/special-events';
const PDF_URL = '/files/lila-lavan.pdf';
const PDF_TITLE = 'מדריך לילה לבן בחודש ארגון';
const SEEN_KEY = 'wn-popup-day';

const KRAFT = '#F3E4C6';
const INK = '#2b2540';

function active(): boolean {
  const now = new Date();
  return now >= FROM && now <= TO;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function Moon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" aria-hidden="true" style={{ flex: 'none', transform: 'rotate(8deg)' }}>
      <path d="M52 8a36 36 0 1 0 34 52A30 30 0 1 1 52 8z" fill="#FFD23F" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M94 16l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#FF5FA2" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M104 54l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#4AA3FF" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

const paper: React.CSSProperties = {
  background: '#FFFCF2',
  border: `2.5px solid ${INK}`,
  borderRadius: '255px 18px 225px 18px / 18px 225px 18px 255px',
  boxShadow: '5px 6px 0 rgba(43, 37, 64, .16)',
};

export function WhiteNightPromo() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const on = active();
  const { open: openPdf, modal: pdfModal } = usePdfViewer();

  useEffect(() => {
    if (!on) return;
    let seen = '';
    try { seen = localStorage.getItem(SEEN_KEY) ?? ''; } catch { /* מצב פרטי */ }
    if (seen === today()) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, [on]);

  useEffect(() => {
    if (!open) return;
    btnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, today()); } catch { /* מצב פרטי */ }
  }

  if (!on) return null;

  return (
    <>
      {/* באנר קבוע בראש הדף לאורך השבוע */}
      <div style={{ background: KRAFT, borderBottom: `2px dashed ${INK}55`, padding: '12px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Moon size={54} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 17, color: INK }}>מדריך חדש לחודש ארגון: איך מקיימים לילה לבן</div>
            <div style={{ fontSize: 13.5, color: '#5a5170' }}>שיחות אישיות, גיבוש בין הקבוצות, רגע משמעותי וניצוצות לכל הלילה</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" onClick={() => openPdf(PDF_URL, PDF_TITLE)} className="btn btn-flame" style={{ padding: '9px 18px', fontSize: 14 }}>לפתיחת המדריך</button>
            <a href={PDF_URL} download className="btn btn-outline" style={{ padding: '9px 16px', fontSize: 14 }}>להורדה (PDF)</a>
          </div>
        </div>
      </div>

      {pdfModal}
      {open && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(40, 24, 10, .55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wn-title"
            onClick={(e) => e.stopPropagation()}
            style={{ ...paper, position: 'relative', maxWidth: 440, width: '100%', padding: '30px 28px 24px', textAlign: 'center', transform: 'rotate(-0.6deg)' }}
          >
            <span aria-hidden="true" style={{ position: 'absolute', top: -12, right: 46, width: 90, height: 24, background: 'rgba(255, 210, 63, .7)', transform: 'rotate(-4deg)' }} />
            <span aria-hidden="true" style={{ position: 'absolute', top: -12, left: 46, width: 90, height: 24, background: 'rgba(255, 95, 162, .5)', transform: 'rotate(5deg)' }} />
            <button type="button" onClick={close} aria-label="סגירה" style={{ position: 'absolute', top: 10, left: 14, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: '#7a7090' }}>✕</button>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Moon size={92} /></div>
            <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700, fontSize: 13.5, color: '#B34E14', marginBottom: 4 }}>חדש באתר</div>
            <h2 id="wn-title" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 25, lineHeight: 1.25, color: INK, margin: '0 0 10px' }}>
              איך מקיימים <span style={{ background: 'linear-gradient(176deg, transparent 52%, #FFD23F 52% 92%, transparent 92%)', padding: '0 6px' }}>לילה לבן</span> בחודש ארגון
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4a4160', margin: '0 0 18px' }}>
              מדריך קצר ומעשי: שיחה אישית עם כל חניך, גיבוש בין הקבוצות בסניף, רגע משמעותי, הכרת תודה וניצוצות לכל הלילה.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <button ref={btnRef} type="button" className="btn btn-flame" onClick={() => { close(); openPdf(PDF_URL, PDF_TITLE); }}>לפתיחת המדריך</button>
              <a href={PDF_URL} download onClick={close} className="chip" style={{ fontSize: 13.5 }}>להורדה כקובץ להדפסה (PDF)</a>
              <Link to={EVENTS_URL} onClick={close} className="chip" style={{ fontSize: 13 }}>לכל האירועים המיוחדים ←</Link>
              <button type="button" onClick={close} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#7a7090', textDecoration: 'underline' }}>אחר כך</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
