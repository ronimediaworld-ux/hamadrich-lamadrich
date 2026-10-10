import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../data/types';
import { planForSelection, planForTarget, timedSteps, type TimePlan } from '../lib/timePlan';

const PRESETS = [20, 30, 40, 45, 60, 90];

interface Props {
  activity: Activity;
  onPlan: (plan: TimePlan | null) => void;
}

export function TimePlanner({ activity, onPlan }: Props) {
  const steps = timedSteps(activity);
  const [target, setTarget] = useState<number | null>(null);
  const [optionalOn, setOptionalOn] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTarget(null);
    setMessage('');
    setOptionalOn(new Set((steps ?? []).filter((s) => !s.core).map((s) => s.index)));
    onPlan(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id]);

  if (!steps) {
    return (
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '0 0 22px' }}>
        לפעולה הזו אין עדיין חלוקת זמנים מפורטת לשלבים, ולכן אי אפשר להתאים את המשך שלה. אפשר למצוא פעולה לפי הזמן שיש לך ב<Link to="/now" style={{ textDecoration: 'underline' }}>"אני צריכה פעולה עכשיו"</Link>.
      </p>
    );
  }

  const full = steps.reduce((s, t) => s + t.minutes, 0);
  const coreTotal = steps.filter((t) => t.core).reduce((s, t) => s + t.minutes, 0);
  const optional = steps.filter((t) => !t.core);

  function pick(minutes: number | null) {
    setTarget(minutes);
    if (minutes === null) {
      setOptionalOn(new Set(optional.map((t) => t.index)));
      setMessage('');
      onPlan(null);
      return;
    }
    const p = planForTarget(activity, minutes);
    if (!p) return;
    setOptionalOn(new Set(optional.filter((t) => p.include.has(t.index)).map((t) => t.index)));
    setMessage(p.message);
    onPlan(p.status === 'too-short-impossible' ? planForSelection(activity, new Set()) : p);
  }

  function toggle(index: number) {
    const next = new Set(optionalOn);
    if (next.has(index)) next.delete(index); else next.add(index);
    setOptionalOn(next);
    setTarget(null);
    const p = planForSelection(activity, next);
    setMessage(p ? `${p.total} דקות לפי הבחירה שלך` : '');
    onPlan(p && next.size === optional.length ? null : p);
  }

  const chosen = planForSelection(activity, optionalOn);

  return (
    <section className="no-print" aria-labelledby="time-planner" style={{ border: '2px solid var(--ink)', borderRadius: 16, padding: '16px 20px', margin: '0 0 26px', background: 'var(--paper)' }}>
      <h2 id="time-planner" style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px' }}>התאמת משך הפעולה</h2>
      <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 12px', lineHeight: 1.7 }}>
        בוחרים כמה זמן יש, או מסמנים אילו חלקים לכלול. החלקים המרכזיים נשארים תמיד, ואין קיצור של זמנים אלא ויתור על הרחבות בלבד.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <button type="button" className={`chip${target === null && chosen && chosen.total === full ? ' is-active' : ''}`} onClick={() => pick(null)}>המשך המלא ({full} דק׳)</button>
        {PRESETS.map((m) => (
          <button key={m} type="button" className={`chip${target === m ? ' is-active' : ''}`} onClick={() => pick(m)}>{m} דקות</button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0, display: 'grid', gap: 6 }}>
        {steps.map((t) => {
          const on = t.core || optionalOn.has(t.index);
          return (
            <li key={t.index}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: on ? 1 : 0.55, cursor: t.core ? 'default' : 'pointer' }}>
                <input type="checkbox" checked={on} disabled={t.core} onChange={() => toggle(t.index)} style={{ width: 17, height: 17 }} />
                <span style={{ flex: 1 }}>{t.step.label.replace(/\s*\(\d+(?:\s*[–-]\s*\d+)?\s*דק[׳']*\)/, '')}</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>{t.minutes ? `${t.minutes} דק׳` : ''}</span>
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: '1px 8px', borderRadius: 99, background: t.core ? '#E4EEF8' : 'var(--yellow-tint)' }}>{t.core ? 'ליבה' : 'אפשר לוותר'}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }} aria-live="polite">
        סה״כ: {chosen?.total ?? full} דקות (מינימום הגיוני: {coreTotal})
      </p>
      {message && <p style={{ margin: '6px 0 0', fontSize: 13.5, color: target !== null && message.startsWith('אי אפשר') ? '#9A3412' : 'var(--ink-soft)' }} aria-live="polite">{message}</p>}
    </section>
  );
}
