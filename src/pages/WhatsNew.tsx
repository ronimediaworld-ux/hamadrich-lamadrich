import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';
import { situations } from '../data/situations';
import { methods } from '../data/methods';
import { useDocumentTitle } from '../lib/useDocumentTitle';

interface Row { to: string; title: string; sub: string }

// "מה חדש": התכנים האחרונים שנוספו (לפי סדר ההוספה למאגר).
const SECTIONS: { title: string; rows: Row[]; more: { to: string; label: string } }[] = [
  { title: 'פעולות חדשות', more: { to: '/category/activities', label: 'לכל הפעולות' }, rows: activities.slice(-12).reverse().map((a) => ({ to: `/activity/${a.id}`, title: a.title, sub: `${a.ageLabel} · ${a.duration} דק׳` })) },
  { title: 'קטעי קריאה חדשים', more: { to: '/category/readings', label: 'לכל קטעי הקריאה' }, rows: readings.slice(-8).reverse().map((r) => ({ to: `/reading/${r.id}`, title: r.title, sub: r.ageLabel })) },
  { title: 'לימוד צוות חדש', more: { to: '/category/staff-study', label: 'לכל לימוד הצוות' }, rows: staffStudy.slice(-6).reverse().map((s) => ({ to: `/staff-study/${s.id}`, title: s.title, sub: `${s.topic} · ${s.duration} דק׳` })) },
  { title: 'צ׳ופרים חדשים', more: { to: '/chuparim', label: 'לכל הצ׳ופרים' }, rows: chuparim.slice(-6).reverse().map((c) => ({ to: `/chupar/${c.id}`, title: c.title, sub: c.kind })) },
  { title: 'סיטואציות ומתודות', more: { to: '/category/tools', label: 'לסיטואציות בהדרכה' }, rows: [...situations.slice(-3).reverse().map((s) => ({ to: `/category/tools?q=${encodeURIComponent(s.title)}`, title: s.title, sub: 'סיטואציה בהדרכה' })), ...methods.slice(-3).reverse().map((m) => ({ to: `/category/methods?q=${encodeURIComponent(m.title)}`, title: m.title, sub: 'מתודה' }))] },
];

export function WhatsNew() {
  useDocumentTitle('מה חדש באתר');
  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 860 }}>
      <Reveal>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>מה חדש באתר</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 28 }}>התכנים האחרונים שנוספו למאגר — כדי שלא תפספסו.</p>
      </Reveal>
      {SECTIONS.map((sec) => (
        <Reveal key={sec.title}>
          <section style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>{sec.title}</h2>
              <Link to={sec.more.to} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-faint)' }}>{sec.more.label} ←</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
              {sec.rows.map((r) => (
                <Link key={r.to} to={r.to} className="card" style={{ display: 'block', padding: '12px 16px' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'Rubik, sans-serif', fontSize: 15 }}>{r.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{r.sub}</div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
