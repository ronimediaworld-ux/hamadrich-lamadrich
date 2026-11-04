import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';

const KIND_PALETTE: Record<string, [string, string]> = {
  'פעולה': ['#D96A2B', '#FBE4D2'],
  'קטע קריאה': ['#6B4A9B', '#ECE4F5'],
  'לימוד צוות': ['#3E7EA6', '#DCEAF2'],
  'צ׳ופר': ['#C99411', '#FBF0CE'],
};

interface Row { to: string; title: string; kind: string; sub: string }

const TOTAL = activities.length + readings.length + staffStudy.length + chuparim.length;
const SEEN_KEY = 'hlm-seen-total';

// "מה חדש באתר" בדף הבית: כרטיסים של התכנים האחרונים, ועל גבי זה באנר "חדש!" אחרי ביקור קודם.
export function WhatsNewHome() {
  const [fresh, setFresh] = useState(0);

  useEffect(() => {
    try {
      const seen = Number(localStorage.getItem(SEEN_KEY));
      if (seen && TOTAL > seen) setFresh(TOTAL - seen);
      if (!seen) localStorage.setItem(SEEN_KEY, String(TOTAL));
    } catch { /* אין localStorage */ }
  }, []);

  function dismiss() {
    setFresh(0);
    try { localStorage.setItem(SEEN_KEY, String(TOTAL)); } catch { /* */ }
  }

  const rows: Row[] = [
    ...activities.slice(-4).reverse().map((a) => ({ to: `/activity/${a.id}`, title: a.title, kind: 'פעולה', sub: `${a.ageLabel} · ${a.duration} דק׳` })),
    ...readings.slice(-2).reverse().map((r) => ({ to: `/reading/${r.id}`, title: r.title, kind: 'קטע קריאה', sub: r.ageLabel })),
    ...staffStudy.slice(-1).map((s) => ({ to: `/staff-study/${s.id}`, title: s.title, kind: 'לימוד צוות', sub: s.topic })),
    ...chuparim.slice(-1).map((c) => ({ to: `/chupar/${c.id}`, title: c.title, kind: 'צ׳ופר', sub: c.kind })),
  ];

  return (
    <div className="wrap" style={{ paddingBottom: 44 }}>
      {fresh > 0 && (
        <div role="status" className="new-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--flame)', color: '#FFF6EE', borderRadius: 14, padding: '12px 18px', marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800 }}>חדש באתר! נוספו {fresh} תכנים מאז הביקור האחרון שלכם</span>
          <span style={{ display: 'flex', gap: 10 }}>
            <Link to="/whats-new" onClick={dismiss} style={{ background: '#FFF6EE', color: 'var(--ink)', borderRadius: 999, padding: '6px 16px', fontWeight: 700, fontSize: 13.5 }}>לראות מה חדש</Link>
            <button type="button" onClick={dismiss} aria-label="סגירה" style={{ background: 'transparent', border: '1px solid #FFF6EE', color: '#FFF6EE', borderRadius: 999, padding: '5px 14px', fontSize: 13 }}>סגירה</button>
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900 }}>מה חדש באתר</h2>
        <Link to="/whats-new" style={{ display: 'inline-block', padding: '8px 4px', fontSize: 14, fontWeight: 600, color: 'var(--ink-faint)' }}>לכל החדשים ←</Link>
      </div>
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: 12 }}>
        {rows.map((r) => {
          const pal = KIND_PALETTE[r.kind] ?? KIND_PALETTE['פעולה'];
          return (
            <Link key={r.to} to={r.to} className="card new-card" style={{ ['--c' as string]: pal[0], ['--t' as string]: pal[1] }}>
              <span className="k">{r.kind}</span>
              <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 15.5, lineHeight: 1.28 }}>{r.title}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)' }}>{r.sub}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
