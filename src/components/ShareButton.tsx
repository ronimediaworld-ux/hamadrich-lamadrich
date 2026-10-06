import { useState } from 'react';

// שיתוף קישור לדף: תפריט השיתוף של המכשיר אם קיים, אחרת העתקה ללוח.
export function ShareButton({ title, label = 'שיתוף קישור', style }: { title: string; label?: string; style?: React.CSSProperties }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      return; // המשתמש ביטל
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* */ }
      document.body.removeChild(ta);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 2500);
  }
  return (
    <button type="button" className="btn btn-outline no-print" onClick={share} style={{ justifyContent: 'center', ...style }}>
      {done ? '✓ הקישור הועתק' : label}
    </button>
  );
}
