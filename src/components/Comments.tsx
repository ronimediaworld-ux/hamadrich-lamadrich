import { useEffect, useState } from 'react';
import { fetchComments, postComment, type PublicComment, type ViewKind } from '../lib/api';

// תגובות על תוכן: מוצגות רק אחרי אישור של מנהלת האתר.
export function Comments({ kind, targetId }: { kind: ViewKind; targetId: string }) {
  const [list, setList] = useState<PublicComment[] | null>(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setList(null);
    let alive = true;
    fetchComments(kind, targetId).then((c) => { if (alive) setList(c); });
    return () => { alive = false; };
  }, [kind, targetId]);

  if (list === null) return null; // אין שרת/לא נטען — לא מציגים כלום

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const r = await postComment(kind, targetId, name, text, website);
    setBusy(false);
    if (r.ok) {
      setText('');
      setMsg({ ok: true, text: 'תודה! התגובה נשלחה ותופיע אחרי אישור.' });
    } else {
      setMsg({ ok: false, text: r.message || 'משהו השתבש.' });
    }
  }

  return (
    <section className="no-print" style={{ marginTop: 40 }} aria-label="תגובות">
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
        תגובות {list.length > 0 && <span style={{ color: 'var(--ink-faint)', fontWeight: 600, fontSize: 14 }}>({list.length})</span>}
      </h2>

      {list.length === 0 && (
        <p style={{ fontSize: 14, color: 'var(--ink-faint)', marginBottom: 14 }}>עדיין אין תגובות. העברתם את הפעולה? ספרו איך היה — זה עוזר למדריכים אחרים.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {list.map((c) => (
          <div key={c.id} className="card" style={{ padding: '12px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{c.name}
              <span style={{ fontWeight: 500, color: 'var(--ink-faint)', marginInlineStart: 8, fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString('he-IL')}</span>
            </div>
            <div style={{ fontSize: 14.5, whiteSpace: 'pre-line', color: 'var(--ink-soft)' }}>{c.text}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="שם (אפשר גם בלי)" aria-label="שם"
          style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid var(--ink)', fontSize: 14, fontFamily: 'Heebo, sans-serif' }} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={600} rows={3} required placeholder="איך הלכה הפעולה? מה כדאי לשנות?" aria-label="התגובה שלך"
          style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid var(--ink)', fontSize: 14, fontFamily: 'Heebo, sans-serif', resize: 'vertical' }} />
        <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', width: 1, height: 1, opacity: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-flame" disabled={busy}>{busy ? 'שולח...' : 'שליחת תגובה'}</button>
          {msg && <span style={{ fontSize: 13.5, color: msg.ok ? 'var(--lime-ink)' : 'var(--flame-ink)' }}>{msg.text}</span>}
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>התגובות מופיעות אחרי אישור של מנהלת האתר. בלי קישורים ובלי פרטים אישיים.</p>
      </form>
    </section>
  );
}
