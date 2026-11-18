import { useEffect, useRef, useState } from 'react';

// פתיחת קובץ PDF בתוך האתר, בחלון גדול. במסך קטן או במגע דפדפנים לא מציגים PDF בתוך הדף, ולכן שם הוא נפתח בלשונית חדשה.
function isSmallScreen(): boolean {
  return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
}

export function usePdfViewer() {
  const [viewer, setViewer] = useState<{ url: string; title: string } | null>(null);
  function open(url: string, title: string) {
    if (isSmallScreen()) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    setViewer({ url, title });
  }
  const modal = viewer ? <PdfViewerModal url={viewer.url} title={viewer.title} onClose={() => setViewer(null)} /> : null;
  return { open, modal };
}

function PdfViewerModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(25, 15, 10, .72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 980, height: '94vh', background: 'var(--paper, #fff)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--line, #e6dccb)', flexWrap: 'wrap' }}>
          <strong style={{ flex: 1, fontFamily: 'Rubik, sans-serif', fontSize: 16 }}>{title}</strong>
          <a className="btn btn-outline" href={url} download style={{ padding: '6px 14px', fontSize: 13 }}>הורדה</a>
          <a className="btn btn-outline" href={url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', fontSize: 13 }}>פתיחה בחלון חדש</a>
          <button ref={closeRef} type="button" className="btn btn-flame" onClick={onClose} style={{ padding: '6px 16px', fontSize: 13 }}>סגירה</button>
        </div>
        <iframe title={title} src={`${url}#view=FitH`} style={{ flex: 1, width: '100%', border: 'none', background: '#f3e4c6' }} />
      </div>
    </div>
  );
}
