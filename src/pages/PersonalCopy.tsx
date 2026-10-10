import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getActivity } from '../data/activities';
import { CopyButton } from '../components/CopyButton';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { offerHtml } from '../lib/printFile';
import {
  buildPersonalPrintHtml, copyFromActivity, deleteCopy, getCopy, newTemplate, personalText, saveCopy,
  type PersonalCopy as Copy,
} from '../lib/personalCopies';

const FIELD: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 12, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif', fontSize: 15, lineHeight: 1.7 };

// עורכים עותק אישי של פעולה (או תבנית שבעת החלקים). הכול נשמר בדפדפן שלך בלבד.
export function PersonalCopy() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [copy, setCopy] = useState<Copy | null>(null);
  const [saved, setSaved] = useState(false);
  const creating = useRef(false); // מונע יצירה כפולה של תבנית (React מריץ אפקט פעמיים בפיתוח)
  useDocumentTitle(copy?.title ? `עותק אישי: ${copy.title}` : 'עותק אישי');

  useEffect(() => {
    if (id === 'new') {
      if (creating.current) return;
      creating.current = true;
      const t = newTemplate();
      saveCopy(t);
      navigate(`/my/${t.id}`, { replace: true });
      return;
    }
    const existing = getCopy(id.startsWith('copy-') || id.startsWith('template-') ? id : `copy-${id}`);
    if (existing) { setCopy(existing); return; }
    const base = getActivity(id.replace(/^copy-/, ''));
    if (base) { const c = copyFromActivity(base); saveCopy(c); setCopy(c); }
  }, [id, navigate]);

  function update(next: Copy) {
    setCopy(next);
    saveCopy(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  if (!copy) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>לא נמצא עותק או פעולה</h1>
        <Link to="/favorites" className="btn btn-outline" style={{ marginTop: 16 }}>לקלסר שלי</Link>
      </div>
    );
  }

  const base = copy.baseId ? getActivity(copy.baseId) : null;
  const setStep = (i: number, patch: Partial<Copy['steps'][number]>) => update({ ...copy, steps: copy.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= copy.steps.length) return;
    const steps = [...copy.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    update({ ...copy, steps });
  };

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 780 }}>
      <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '0 0 6px' }}>
        {copy.kind === 'copy' ? 'עותק אישי' : 'תבנית אישית לפי שיטת שבעת החלקים'} · נשמר רק בדפדפן שלך, ולא משנה את המקור
        {saved && <span style={{ color: '#2F7A4B', fontWeight: 700 }}> · נשמר ✓</span>}
      </p>
      <input aria-label="שם הפעולה" value={copy.title} onChange={(e) => update({ ...copy, title: e.target.value })} style={{ ...FIELD, fontSize: 24, fontWeight: 800, marginBottom: 14 }} />

      <label style={{ display: 'block', fontWeight: 800, fontSize: 14, margin: '0 0 4px' }}>מטרות (שורה לכל מטרה)</label>
      <textarea value={copy.goals} onChange={(e) => update({ ...copy, goals: e.target.value })} rows={3} style={{ ...FIELD, marginBottom: 18 }} />

      <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
        {copy.steps.map((s, i) => (
          <section key={i} style={{ borderInlineStart: `6px solid ${s.color || 'var(--flame)'}`, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 16px 14px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: s.color || 'var(--flame)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
              <input aria-label={`כותרת שלב ${i + 1}`} value={s.label} onChange={(e) => setStep(i, { label: e.target.value })} style={{ ...FIELD, flex: 1, minWidth: 160, fontWeight: 800, padding: '6px 10px' }} />
              <button type="button" className="chip" aria-label="הזזה למעלה" onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="chip" aria-label="הזזה למטה" onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="chip" aria-label="מחיקת שלב" onClick={() => update({ ...copy, steps: copy.steps.filter((_, j) => j !== i) })}>מחיקה</button>
            </div>
            <textarea
              aria-label={`תוכן שלב ${i + 1}`}
              value={s.body}
              placeholder={s.hint}
              onChange={(e) => setStep(i, { body: e.target.value })}
              rows={Math.min(14, Math.max(4, s.body.split('\n').length + 1))}
              style={FIELD}
            />
          </section>
        ))}
        <button type="button" className="btn btn-outline" onClick={() => update({ ...copy, steps: [...copy.steps, { label: 'שלב חדש', body: '' }] })}>הוספת שלב</button>
      </div>

      <label style={{ display: 'block', fontWeight: 800, fontSize: 14, margin: '0 0 4px' }}>הערות אישיות למדריכה (מודפסות בסוף)</label>
      <textarea value={copy.notes} onChange={(e) => update({ ...copy, notes: e.target.value })} rows={4} placeholder="מה לשנות בפעם הבאה, שמות של חניכות, זמנים שהתאימו לקבוצה שלי..." style={{ ...FIELD, marginBottom: 20 }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <button type="button" className="btn btn-flame" onClick={() => void offerHtml(`${copy.id}.html`, buildPersonalPrintHtml(copy))}>הדפסה מסודרת</button>
        <CopyButton variant="mini" text={personalText(copy)} label="העתקה כטקסט" />
        {base && <Link to={`/activity/${base.id}`} className="btn btn-outline">לפעולה המקורית</Link>}
        {base && (
          <button type="button" className="btn btn-outline" onClick={() => { if (window.confirm('לאפס את העותק לפעולה המקורית? העריכות שלך יימחקו.')) { const c = copyFromActivity(base); saveCopy(c); setCopy(c); } }}>איפוס לפעולה המקורית</button>
        )}
        <button type="button" className="btn btn-outline" onClick={() => { if (window.confirm('למחוק את העותק האישי הזה?')) { deleteCopy(copy.id); navigate('/favorites'); } }}>מחיקת העותק</button>
      </div>
    </div>
  );
}
