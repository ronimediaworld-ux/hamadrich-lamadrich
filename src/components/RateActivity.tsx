import { useEffect, useState } from 'react';
import { getRating, rateContent, type ViewKind } from '../lib/api';
import { StarIcon } from './Icons';

const LABELS = ['לא ממש עבד', 'בסדר', 'טוב', 'עבד יפה', 'מצוין!'];

// "העברתם את הפעולה? איך הלך?" — דירוג מהיר של מדריכים, והממוצע של כל המדריכים.
export function RateActivity({ kind, id }: { kind: ViewKind; id: string }) {
  const [info, setInfo] = useState<{ avg: number; count: number } | null | undefined>(undefined);
  const [chosen, setChosen] = useState<number | null>(null);
  const [hover, setHover] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let alive = true;
    setChosen(null);
    setMsg('');
    try { if (localStorage.getItem(`rated:${kind}:${id}`)) setChosen(-1); } catch { /* */ }
    getRating(kind, id).then((r) => { if (alive) setInfo(r); });
    return () => { alive = false; };
  }, [kind, id]);

  if (info === null) return null; // אין שרת — לא מציגים

  async function pick(n: number) {
    if (chosen !== null) return;
    setChosen(n);
    const r = await rateContent(kind, id, n);
    if (r.ok) {
      setInfo({ avg: r.avg ?? n, count: r.count ?? 1 });
      setMsg('תודה! הדירוג נשמר.');
      try { localStorage.setItem(`rated:${kind}:${id}`, String(n)); } catch { /* */ }
    } else {
      setChosen(null);
      setMsg(r.message ?? '');
    }
  }

  const done = chosen !== null;
  return (
    <div className="no-print card" style={{ padding: '16px 20px', marginTop: 30, maxWidth: 560 }}>
      <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 8 }}>{done ? 'תודה שדירגתם' : 'העברתם את הפעולה? איך הלך?'}</div>
      {!done && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }} onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" aria-label={`${n} כוכבים — ${LABELS[n - 1]}`} onMouseEnter={() => setHover(n)} onClick={() => pick(n)}
              style={{ border: 'none', background: 'transparent', padding: 3, cursor: 'pointer' }}>
              <StarIcon size={30} color={n <= hover ? 'var(--flame)' : 'var(--line-strong)'} />
            </button>
          ))}
          <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginInlineStart: 8, minHeight: 20 }}>{hover ? LABELS[hover - 1] : ''}</span>
        </div>
      )}
      {msg && <div style={{ fontSize: 13.5, color: 'var(--lime-ink)' }}>{msg}</div>}
      {info && info.count > 0 && (
        <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 6 }}>
          ממוצע {info.avg.toFixed(1)} מתוך 5 · {info.count} {info.count === 1 ? 'מדריך דירג' : 'מדריכים דירגו'}
        </div>
      )}
    </div>
  );
}
