import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chuparim } from '../data/chuparim';
import { TeenAvatar } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { buildChuparSheetHtml } from '../lib/chuparSheet';
import { offerHtml } from '../lib/printFile';

const budgetColor: Record<string, string> = {
  'חינם': 'var(--lime-ink)',
  '₪': 'var(--sky-ink)',
  '₪₪': 'var(--flame-ink)',
  '₪₪₪': 'var(--magenta-ink)',
};

export function Chuparim() {
  useDocumentTitle('רעיונות לצ׳ופרים');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const kinds = Array.from(new Set(chuparim.map((c) => c.kind)));

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function downloadSheet() {
    const items = chuparim.filter((c) => picked.has(c.id));
    if (!items.length || busy) return;
    setBusy(true);
    await offerHtml('chuparim-sheet.html', buildChuparSheetHtml(items, window.location.origin));
    setBusy(false);
  }

  const chipStyle: React.CSSProperties = { padding: '6px 14px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 13, fontWeight: 600, cursor: 'pointer' };

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>רעיונות לצ׳ופרים</h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14.5, marginBottom: 28 }}>{chuparim.length} רעיונות במאגר — ממתנה של דקה ועד חוויה שנשארת שנה שלמה</p>
        <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 24, padding: '12px 16px', borderRadius: 12, background: 'var(--yellow-tint)' }}>
          <b style={{ fontSize: 13.5 }}>דף צ׳ופרים להדפסה (6 בעמוד, כל צ׳ופר מעוצב וחתיך):</b>
          <button type="button" style={chipStyle} onClick={() => setPicked(new Set(chuparim.map((c) => c.id)))}>בחירת הכל</button>
          {kinds.map((k) => (
            <button key={k} type="button" style={chipStyle} onClick={() => setPicked(new Set(chuparim.filter((c) => c.kind === k).map((c) => c.id)))}>{k}</button>
          ))}
          <button type="button" style={chipStyle} onClick={() => setPicked(new Set())}>ניקוי</button>
          <button type="button" className="btn btn-flame" disabled={picked.size === 0 || busy} onClick={downloadSheet} style={{ marginInlineStart: 'auto' }}>
            {busy ? 'רגע...' : `הורדת דף (${picked.size} נבחרו)`}
          </button>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {chuparim.map((c, i) => (
          <Reveal key={c.id} delay={(i % 6) * 40}>
            <Link to={`/chupar/${c.id}`} className="card" style={{ display: 'block', padding: 20, position: 'relative', outline: picked.has(c.id) ? '2px solid var(--flame)' : undefined }}>
              <button
                type="button"
                aria-label={picked.has(c.id) ? 'הסרה מהדף' : 'הוספה לדף'}
                aria-pressed={picked.has(c.id)}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(c.id); }}
                style={{ position: 'absolute', top: 10, insetInlineEnd: 10, zIndex: 2, width: 28, height: 28, borderRadius: 8, border: '2px solid var(--flame)', background: picked.has(c.id) ? 'var(--flame)' : 'var(--paper)', color: '#fff', fontWeight: 800, cursor: 'pointer', lineHeight: 1 }}
              >{picked.has(c.id) ? '✓' : ''}</button>
              {c.designImage && (
                <div style={{ margin: '-20px -20px 14px', borderRadius: '18px 18px 0 0', overflow: 'hidden' }}>
                  <img src={c.designImage} alt="" style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
                </div>
              )}
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
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
