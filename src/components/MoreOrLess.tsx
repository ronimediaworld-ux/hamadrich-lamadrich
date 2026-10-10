import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../data/types';
import { quickGames, type QuickGame } from '../data/quickGames';
import { bridgeCandidates, fillTopic, isSensitive } from '../data/gameBridges';
import { timedSteps } from '../lib/timePlan';

// בסוף הפעולה: על מה אפשר לוותר כשאין זמן, ואילו משחקים אפשר להוסיף כשיש, ואיך מקשרים כל משחק לנושא הפעולה.
const byId = new Map(quickGames.map((g) => [g.id, g] as const));
const noEquip = (g: QuickGame) => g.needs === 'ללא' || g.needs === 'אין';

export function MoreOrLess({ activity }: { activity: Activity }) {
  const steps = timedSteps(activity);
  const skippable = (steps ?? []).filter((t) => !t.core && t.minutes > 0);
  const sensitive = isSensitive(activity);

  const options = useMemo(() => {
    const shabbat = activity.shabbat === 'שבת';
    return bridgeCandidates(activity)
      .map((c) => ({ ...c, g: byId.get(c.game.id) }))
      .filter((c): c is typeof c & { g: QuickGame } => !!c.g)
      .filter((c) => (shabbat ? noEquip(c.g) : true));
  }, [activity]);

  const [offset, setOffset] = useState(0);
  if (!sensitive && options.length === 0 && skippable.length === 0) return null;
  const shown = sensitive ? [] : [0, 1, 2].map((i) => options[(offset + i) % options.length]).filter(Boolean);
  const uniqueShown = shown.filter((c, i) => shown.findIndex((x) => x.g.id === c.g.id) === i);

  return (
    <section className="no-print" style={{ margin: '34px 0 10px', padding: '16px 20px', border: '1px solid var(--line)', borderRadius: 14, background: 'var(--paper)' }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 10px' }}>לפי הזמן שיש</h2>

      {skippable.length > 0 && (
        <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.7 }}>
          <b>אין הרבה זמן? </b>
          אפשר לוותר על: {skippable.map((t) => `${t.step.label.replace(/\s*\(\d+(?:\s*[–-]\s*\d+)?\s*דק[׳']*\)/, '')} (${t.minutes} דק׳)`).join(' · ')}.
        </p>
      )}

      {sensitive ? (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
          <b>יש עוד זמן? </b>זו פעולה על זיכרון, ולכן לא מציעים להוסיף משחק. עדיף להאריך את השיחה, לתת לכל חניכה לשתף בשקט, או לקרוא יחד קטע נוסף.
        </p>
      ) : uniqueShown.length > 0 && (
        <>
          <p style={{ margin: '0 0 8px', fontSize: 14 }}>
            <b>יש עוד זמן? </b>אפשר להוסיף משחק מוכר שקשור לנושא{activity.shabbat === 'שבת' ? ' (בלי ציוד, מתאים לשבת)' : ''}:
          </p>
          <ul style={{ listStyle: 'none', margin: '0 0 10px', padding: 0, display: 'grid', gap: 12 }}>
            {uniqueShown.map((c) => (
              <li key={c.g.id} style={{ fontSize: 13.5, lineHeight: 1.65 }}>
                <b>{c.g.name}</b> <span style={{ color: 'var(--ink-faint)' }}>· {c.g.kind} · {c.g.players}{c.theme ? ` · מתאים ל${c.theme}` : ''}</span>
                <div style={{ color: 'var(--ink-soft)' }}>{c.g.description}</div>
                <div style={{ marginTop: 3, background: 'var(--flame-tint)', borderRadius: 8, padding: '5px 10px' }}>
                  <b>איך מקשרים: </b>{fillTopic(c.game.how, activity)}
                </div>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="button" className="chip" onClick={() => setOffset((o) => o + 3)}>עוד משחקים</button>
            <Link to="/category/games" style={{ fontSize: 13, textDecoration: 'underline' }}>לכל המשחקים באתר</Link>
          </div>
        </>
      )}
    </section>
  );
}
