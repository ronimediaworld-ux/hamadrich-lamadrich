import { useState } from 'react';
import { subscribeEmail } from '../lib/api';

// הרשמה לעדכון שבועי: פעולות פרשת השבוע למייל.
export function SubscribeBox({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('busy');
    const r = await subscribeEmail(email, '', website);
    if (r.ok) { setState('done'); setMsg(''); } else { setState('error'); setMsg(r.message ?? ''); }
  }

  if (compact) {
    return (
      <div className="no-print mt-sub-box">
        <span className="mt-ic">
          <svg viewBox="0 0 56 56" aria-hidden="true"><rect x="6" y="14" width="44" height="30" rx="5" fill="#FFFEFA" stroke="#241C11" strokeWidth="2.6" /><path d="M7 17l21 15 21-15" fill="none" stroke="#241C11" strokeWidth="2.6" strokeLinejoin="round" /><circle cx="46" cy="14" r="6" fill="#D96A2B" stroke="#241C11" strokeWidth="2.2" /></svg>
        </span>
        <h3>פעולות פרשת השבוע — ישר למייל</h3>
        <p>פעם בשבוע, לפני שבת: הפעולות של הפרשה וקטע אחד חדש מהמאגר. בלי ספאם, אפשר לבטל בכל רגע.</p>
        {state === 'done' ? (
          <div style={{ fontWeight: 800, color: 'var(--lime-ink)' }}>נרשמתם, תודה! נתראה בשבוע הבא.</div>
        ) : (
          <form onSubmit={submit} className="mt-form">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="כתובת המייל שלכם" aria-label="כתובת מייל" dir="ltr" />
            <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', width: 1, height: 1, opacity: 0 }} />
            <button type="submit" className="btn btn-flame" disabled={state === 'busy'}>{state === 'busy' ? 'רגע...' : 'הרשמה'}</button>
            {state === 'error' && <div role="alert" style={{ width: '100%', fontSize: 12.5, color: 'var(--flame-ink)' }}>{msg}</div>}
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="no-print subscribe-box">
      <div className="subscribe-env" aria-hidden="true">
        <svg viewBox="0 0 56 56"><rect x="6" y="14" width="44" height="30" rx="5" fill="#FFFEFA" stroke="#241C11" strokeWidth="2.6" /><path d="M7 17l21 15 21-15" fill="none" stroke="#241C11" strokeWidth="2.6" strokeLinejoin="round" /><circle cx="46" cy="14" r="6" fill="#D96A2B" stroke="#241C11" strokeWidth="2.2" /></svg>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>פעולות פרשת השבוע — ישר למייל</h2>
      <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', marginBottom: 16, maxWidth: '60ch' }}>פעם בשבוע, לפני שבת: הפעולות של הפרשה וקטע אחד חדש מהמאגר. בלי ספאם, אפשר לבטל בכל רגע.</p>
      {state === 'done' ? (
        <div style={{ fontWeight: 700, color: 'var(--sky-ink)' }}>נרשמתם, תודה! נתראה בשבוע הבא.</div>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 520 }}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="כתובת המייל שלכם" aria-label="כתובת מייל" dir="ltr"
            style={{ flex: '1 1 240px', padding: '11px 16px', borderRadius: 999, border: '2px solid var(--ink)', fontSize: 14.5, fontFamily: 'Heebo, sans-serif', background: 'var(--paper)' }} />
          <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', width: 1, height: 1, opacity: 0 }} />
          <button type="submit" className="btn btn-flame" disabled={state === 'busy'}>{state === 'busy' ? 'רגע...' : 'הרשמה'}</button>
          {state === 'error' && <div role="alert" style={{ width: '100%', fontSize: 13.5, color: 'var(--flame-ink)' }}>{msg}</div>}
        </form>
      )}
    </div>
  );
}
