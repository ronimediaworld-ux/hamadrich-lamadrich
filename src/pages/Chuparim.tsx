import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chuparim } from '../data/chuparim';
import { TeenAvatar } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { ChuparDesign } from '../components/ChuparDesign';
import { buildChuparPrintHtml } from '../lib/chuparDesign';
import { offerHtml } from '../lib/printFile';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { PageSearch } from '../components/PageSearch';
import { matchesQuery } from '../lib/textFilter';

const budgetColor: Record<string, string> = {
  'חינם': 'var(--lime-ink)',
  '₪': 'var(--sky-ink)',
  '₪₪': 'var(--flame-ink)',
  '₪₪₪': 'var(--magenta-ink)',
};

export function Chuparim() {
  useDocumentTitle('רעיונות לצ׳ופרים');
  const [pq, setPq] = useState('');
  const shown = chuparim.filter((c) => matchesQuery([c.title, c.description, c.kind, c.forWhom, c.tip], pq));
  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>רעיונות לצ׳ופרים</h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14.5, marginBottom: 28 }}>{chuparim.length} רעיונות במאגר — ממתנה של דקה ועד חוויה שנשארת שנה שלמה</p>
      </Reveal>

      <PageSearch value={pq} onChange={setPq} placeholder="חיפוש בצ׳ופרים..." />
      {shown.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>לא נמצא צ׳ופר שמתאים — נסו מילה אחרת.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {shown.map((c, i) => (
          <Reveal key={c.id} delay={(i % 6) * 40}>
            <Link to={`/chupar/${c.id}`} className="card" style={{ display: 'block', padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <ChuparDesign chupar={c} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 'none', width: 44, height: 44, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <TeenAvatar character={c.character} size={32} />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: budgetColor[c.budget] ?? 'var(--ink-faint)' }}>{c.kind}</span>
              </div>
              <h3 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 16.5, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>{c.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 12 }}>
                <span>תקציב: {c.budget}</span>
                <span>הכנה: {c.prepTime}</span>
                <span>{c.forWhom}</span>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--yellow-tint)', fontSize: 13 }}>
                <b>טיפ: </b>{c.tip}
              </div>
              <button
                type="button"
                className="btn btn-outline no-print"
                style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); void offerHtml(`${c.id}.html`, buildChuparPrintHtml(c, 1, window.location.origin)); }}
              >
                הורדה להדפסה
              </button>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
