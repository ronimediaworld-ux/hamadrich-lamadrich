import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { getCurrentParsha, getCurrentParshaNames } from '../lib/parsha';
import { buildCombinedPrintHtml } from '../lib/activityPrint';
import { entriesForKeys } from '../lib/binderPrint';
import { offerHtml } from '../lib/printFile';
import { favKey } from '../lib/favorites';
import { useDocumentTitle } from '../lib/useDocumentTitle';

// חבילת שבת: בוחרים פעולות וקטעי קריאה מתאימים לשבת, ומדפיסים הכול מראש ביום שישי — כקובץ אחד.
export function ShabbatPack() {
  useDocumentTitle('חבילת שבת להדפסה');
  const parsha = getCurrentParsha();
  const names = getCurrentParshaNames();

  const options = useMemo(() => {
    const fit = activities.filter((a) => a.categorySlug === 'activities' && a.shabbat !== 'חול');
    const forParsha = names.length ? fit.filter((a) => a.tags.some((t) => names.includes(t))) : [];
    const others = fit.filter((a) => !forParsha.includes(a)).slice(0, 0);
    return { forParsha, others, readings: readings.filter((r) => r.domain !== 'ערכי').slice(0, 12) };
  }, [names.join('|')]);

  const [checked, setChecked] = useState<Set<string>>(() => new Set(options.forParsha.slice(0, 2).map((a) => a.id)));
  const [q, setQ] = useState('');
  const extra = useMemo(() => {
    if (!q.trim()) return [];
    return activities.filter((a) => a.categorySlug === 'activities' && a.shabbat !== 'חול' && [a.title, ...a.tags].join(' ').includes(q.trim())).slice(0, 8);
  }, [q]);
  const [readingIds, setReadingIds] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id); else n.add(id);
    setter(n);
  };
  const total = checked.size + readingIds.size;

  function download() {
    const keys = [...checked].map((id) => favKey('activity', id)).concat([...readingIds].map((id) => favKey('reading', id)));
    const html = buildCombinedPrintHtml(parsha ? `חבילת שבת — פרשת ${parsha}` : 'חבילת שבת', 'פעולות וקטעי קריאה להדפסה מראש, מתאימים לשבת — בלי צורך בטלפון או במחשב בזמן הפעולה.', entriesForKeys(keys));
    void offerHtml('shabbat-pack.html', html);
  }

  const Row = ({ id, title, sub, set, setter }: { id: string; title: string; sub: string; set: Set<string>; setter: (s: Set<string>) => void }) => (
    <label className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', cursor: 'pointer' }}>
      <input type="checkbox" checked={set.has(id)} onChange={() => toggle(set, id, setter)} style={{ marginTop: 5, width: 18, height: 18, accentColor: 'var(--flame)' }} />
      <span><span style={{ fontWeight: 800, fontFamily: 'Rubik, sans-serif' }}>{title}</span><br /><span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{sub}</span></span>
    </label>
  );

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 760 }}>
      <Reveal>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>חבילת שבת להדפסה</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 24 }}>
          {parsha ? `פעולות מתאימות לשבת של פרשת ${parsha}` : 'פעולות מתאימות לשבת'} — בוחרים, מורידים קובץ אחד, ומדפיסים ביום שישי. בשבת עצמה אין צורך בטלפון.
        </p>
      </Reveal>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>פעולות לפרשת השבוע</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {options.forParsha.length === 0 && <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>אין כרגע פעולות שמסומנות לפרשה הזאת — אפשר לחפש למטה, או <Link to="/category/activities?domain=פרשת שבוע" style={{ textDecoration: 'underline' }}>לעבור לכל פעולות הפרשות</Link>.</p>}
        {options.forParsha.map((a) => <Row key={a.id} id={a.id} title={a.title} sub={`${a.ageLabel} · ${a.duration} דק׳`} set={checked} setter={setChecked} />)}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>עוד פעולות לשבת</h2>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש פעולה לשבת: חברות, אמונה..." aria-label="חיפוש פעולה לשבת" style={{ width: '100%', maxWidth: 420, padding: '10px 16px', borderRadius: 999, border: '2px solid var(--ink)', fontSize: 14.5, fontFamily: 'Heebo, sans-serif', marginBottom: 10 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {extra.map((a) => <Row key={a.id} id={a.id} title={a.title} sub={`${a.ageLabel} · ${a.duration} דק׳`} set={checked} setter={setChecked} />)}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>קטעי קריאה לשבת</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
        {options.readings.map((r) => <Row key={r.id} id={r.id} title={r.title} sub={r.ageLabel} set={readingIds} setter={setReadingIds} />)}
      </div>

      <button className="btn btn-flame" disabled={total === 0} onClick={download} style={{ opacity: total ? 1 : 0.5 }}>הורדת החבילה להדפסה ({total} פריטים)</button>
    </div>
  );
}
