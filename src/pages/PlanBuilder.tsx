import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { buildPlan, planToActivity, type PlanOptions, type PlanSeeds } from '../lib/planBuilder';
import { activityToText } from '../lib/contentText';
import { buildActivityPrintHtml } from '../lib/activityPrint';
import { offerHtml } from '../lib/printFile';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const GRADES: { label: string; g: [number, number] }[] = [
  { label: "א'-ג'", g: [1, 3] }, { label: "ד'-ו'", g: [4, 6] }, { label: "ז'-ח'", g: [7, 8] }, { label: "ט'-י'", g: [9, 10] }, { label: 'י״א-י״ב', g: [11, 12] },
];
const KIND_COLOR: Record<string, string> = { opening: 'var(--flame)', game: 'var(--lime)', main: 'var(--sky)', method: 'var(--yellow)', discussion: 'var(--magenta)', summary: 'var(--ink)' };

export function PlanBuilder() {
  useDocumentTitle('בונה פעולה');
  const [gradeIdx, setGradeIdx] = useState(2);
  const [minutes, setMinutes] = useState(45);
  const [domain, setDomain] = useState<PlanOptions['domain']>('הכל');
  const [keyword, setKeyword] = useState('');
  const [shabbat, setShabbat] = useState(false);
  const [seeds, setSeeds] = useState<PlanSeeds>({ base: 1, game: 1, method: 1 });

  const opts: PlanOptions = { grade: GRADES[gradeIdx].g, minutes, domain, keyword, shabbat };
  const plan = useMemo(() => buildPlan(opts, seeds), [gradeIdx, minutes, domain, keyword, shabbat, seeds]); // eslint-disable-line react-hooks/exhaustive-deps
  const activity = useMemo(() => planToActivity(plan, opts), [plan]); // eslint-disable-line react-hooks/exhaustive-deps
  const reroll = (k: keyof PlanSeeds) => setSeeds((s) => ({ ...s, [k]: s[k] + 1 }));

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 860 }}>
      <Reveal>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>בונה פעולה</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 24 }}>בוחרים גיל, זמן ונושא — והאתר מרכיב פעולה שלמה מהמאגר: פתיחה, משחק, גוף, מתודה, דיון וסיכום. לא אהבתם חלק? מחליפים רק אותו.</p>
      </Reveal>

      <Reveal delay={40}>
        <div className="card" style={{ padding: '20px 22px', marginBottom: 26 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 8 }}>גיל</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {GRADES.map((g, i) => <button key={g.label} className={`chip${gradeIdx === i ? ' is-active' : ''}`} onClick={() => setGradeIdx(i)}>כיתות {g.label}</button>)}
          </div>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 8 }}>זמן</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[20, 30, 45, 60, 75].map((m) => <button key={m} className={`chip${minutes === m ? ' is-active' : ''}`} onClick={() => setMinutes(m)}>{m} דקות</button>)}
          </div>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 8 }}>נושא</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {(['הכל', 'ערכים', 'אמונה', 'פרשת שבוע'] as const).map((d) => <button key={d} className={`chip${domain === d ? ' is-active' : ''}`} onClick={() => setDomain(d)}>{d}</button>)}
            <button className={`chip${shabbat ? ' is-active' : ''}`} onClick={() => setShabbat((v) => !v)}>מתאים לשבת</button>
          </div>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="מילת נושא (לא חובה): חברות, קנאה, אחריות..." aria-label="מילת נושא"
            style={{ width: '100%', maxWidth: 420, padding: '10px 16px', borderRadius: 999, border: '2px solid var(--ink)', fontSize: 14.5, fontFamily: 'Heebo, sans-serif' }} />
        </div>
      </Reveal>

      {!plan.base || !activity ? (
        <p style={{ color: 'var(--ink-soft)' }}>לא נמצאה פעולה שמתאימה לבחירה הזאת — נסו להסיר מסנן אחד.</p>
      ) : (
        <>
          <Reveal delay={60}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>הפעולה נבנתה סביב</div>
                <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 21 }}>
                  <Link to={`/activity/${plan.base.id}`} style={{ textDecoration: 'underline' }}>{plan.base.title}</Link>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>סה״כ כ-{plan.total} דקות · {plan.candidates} פעולות מתאימות במאגר</div>
              </div>
              <button className="btn btn-outline" onClick={() => reroll('base')}>נושא אחר</button>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {plan.steps.map((s, i) => (
              <Reveal key={`${s.label}-${i}`}>
                <div className="card" style={{ padding: '16px 20px', borderInlineStart: `6px solid ${KIND_COLOR[s.kind]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 16 }}>{i + 1}. {s.label}</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{s.minutes} דק׳{s.source ? ` · ${s.source}` : ''}</span>
                      {s.kind === 'game' && <button className="chip" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => reroll('game')}>משחק אחר</button>}
                      {s.kind === 'method' && <button className="chip" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => reroll('method')}>מתודה אחרת</button>}
                    </div>
                  </div>
                  {s.body && <div style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{s.body}</div>}
                  {s.items && <ul style={{ margin: '6px 0 0', paddingInlineStart: 20, fontSize: 14.5, color: 'var(--ink-soft)' }}>{s.items.map((x, k) => <li key={k}>{x}</li>)}</ul>}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-flame" onClick={() => void offerHtml('custom-plan.html', buildActivityPrintHtml(activity, 'בונה פעולה', 'פעולה מותאמת'))}>הורדה להדפסה</button>
            <CopyButton text={activityToText(activity)} label="העתקת הפעולה כטקסט" copiedLabel="✓ הועתק" />
            <button className="btn btn-outline" onClick={() => setSeeds({ base: seeds.base + 1, game: seeds.game + 1, method: seeds.method + 1 })}>הרכבה חדשה מההתחלה</button>
          </div>
        </>
      )}
    </div>
  );
}
