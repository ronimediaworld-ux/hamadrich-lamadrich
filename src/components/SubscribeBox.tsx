import { useState } from 'react';
import { subscribeEmail } from '../lib/api';

// הרשמה לעדכון שבועי: פעולות פרשת השבוע למייל.
export function SubscribeBox() {
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

  return (
    <div className="no-print" style={{ background: 'var(--sky-tint)', border: '1px solid var(--sky)', borderRadius: 18, padding: '24px 30px' }}>
      <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 6 }}>פעולות פרשת השבוע — ישר למייל</h2>
      <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 14 }}>פעם בשבוע, לפני שבת: הפעולות של הפרשה וקטע אחד חדש מהמאגר. בלי ספאם, אפשר לבטל בכל רגע.</p>
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
