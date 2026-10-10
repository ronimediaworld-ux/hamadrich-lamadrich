import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { ACTIVITY_KINDS, activityKind, findNow, type ActivityKind } from '../lib/activityFilter';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const GRADE_NAMES = ['', 'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב'];
const MINUTES = [15, 20, 30, 40, 45, 60, 75, 90];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
      {label}
      {children}
    </label>
  );
}

const SELECT: React.CSSProperties = { padding: '10px 12px', borderRadius: 12, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif', fontSize: 15 };

export function NeedNow() {
  useDocumentTitle('אני צריכה פעולה עכשיו');
  const [grade, setGrade] = useState(8);
  const [minutes, setMinutes] = useState(40);
  const [kind, setKind] = useState<ActivityKind | 'הכל'>('הכל');
  const [place, setPlace] = useState<'הכל' | 'פנים' | 'חוץ'>('הכל');
  const [noEquip, setNoEquip] = useState(false);
  const [shabbat, setShabbat] = useState(false);
  const [asked, setAsked] = useState(false);

  const results = useMemo(() => (asked ? findNow({ grade, minutes, kind, place, noEquip, shabbat }) : []), [asked, grade, minutes, kind, place, noEquip, shabbat]);
  const top = results.slice(0, 5);
  const best = top[0];
  const exact = top.filter((r) => r.notes.length === 0);

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 760 }}>
      <Reveal>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>אני צריכה פעולה עכשיו</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 22px', lineHeight: 1.8 }}>
          בוחרות כיתה, זמן וסוג פעילות, ומקבלות הצעות מתוך המאגר. ההתאמה לפי נתוני הפעולות עצמן (גיל, משך, מקום וציוד), ולא לפי הכותרת.
        </p>
      </Reveal>

      <form
        onSubmit={(e) => { e.preventDefault(); setAsked(true); }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, padding: '20px 22px', border: '2px solid var(--ink)', borderRadius: 18, background: 'var(--paper)', marginBottom: 26 }}
      >
        <Field label="כיתה">
          <select value={grade} onChange={(e) => { setGrade(Number(e.target.value)); setAsked(false); }} style={SELECT}>
            {GRADES.map((g) => <option key={g} value={g}>{GRADE_NAMES[g]}</option>)}
          </select>
        </Field>
        <Field label="כמה זמן יש?">
          <select value={minutes} onChange={(e) => { setMinutes(Number(e.target.value)); setAsked(false); }} style={SELECT}>
            {MINUTES.map((m) => <option key={m} value={m}>{m} דקות</option>)}
          </select>
        </Field>
        <Field label="סוג פעילות">
          <select value={kind} onChange={(e) => { setKind(e.target.value as ActivityKind | 'הכל'); setAsked(false); }} style={SELECT}>
            <option value="הכל">הכל</option>
            {ACTIVITY_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </Field>
        <Field label="פנים או חוץ">
          <select value={place} onChange={(e) => { setPlace(e.target.value as 'הכל' | 'פנים' | 'חוץ'); setAsked(false); }} style={SELECT}>
            <option value="הכל">לא משנה</option>
            <option value="פנים">בפנים</option>
            <option value="חוץ">בחוץ</option>
          </select>
        </Field>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={noEquip} onChange={(e) => { setNoEquip(e.target.checked); setAsked(false); }} style={{ width: 18, height: 18 }} />
            בלי ציוד
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={shabbat} onChange={(e) => { setShabbat(e.target.checked); setAsked(false); }} style={{ width: 18, height: 18 }} />
            מתאימה לשבת
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" className="btn btn-flame" style={{ width: '100%' }}>תמצאי לי פעולה</button>
        </div>
      </form>

      {asked && (
        <div aria-live="polite">
          {top.length === 0 ? (
            <p style={{ color: 'var(--ink-soft)' }}>
              לא מצאתי פעולה לכיתה הזו. נסי כיתה סמוכה, או חפשי ב<Link to="/category/activities" style={{ textDecoration: 'underline' }}>מאגר הפעולות</Link>.
            </p>
          ) : (
            <>
              {exact.length === 0 && best && (
                <p style={{ background: 'var(--yellow-tint)', borderRadius: 12, padding: '10px 14px', fontSize: 14, margin: '0 0 16px' }}>
                  אין התאמה מלאה לכל התנאים. אלה ההצעות הקרובות ביותר, ומתחת לכל אחת כתוב מה שונה.
                </p>
              )}
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 12px' }}>{top.length} הצעות ({results.length} פעולות מתאימות לגיל)</h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {top.map((r, i) => (
                  <li key={r.activity.id} className="card" style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Link to={`/activity/${r.activity.id}`} style={{ fontWeight: 800, fontSize: 17, textDecoration: 'none' }}>
                        {i + 1}. {r.activity.title}
                      </Link>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--flame-ink)' }}>
                        {r.activity.ageLabel} · {r.activity.duration} דק׳ · {activityKind(r.activity)}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '6px 0 8px', lineHeight: 1.7 }}>{r.activity.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {r.reasons.map((x) => (
                        <span key={x} style={{ background: '#E3F3E9', borderRadius: 99, padding: '2px 10px', fontSize: 12.5 }}>✓ {x}</span>
                      ))}
                      {r.notes.map((x) => (
                        <span key={x} style={{ background: 'var(--yellow-tint)', borderRadius: 99, padding: '2px 10px', fontSize: 12.5 }}>שימי לב: {x}</span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
}
