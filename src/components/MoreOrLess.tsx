import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../data/types';
import { quickGames, type QuickGame } from '../data/quickGames';
import { timedSteps } from '../lib/timePlan';

// בסוף הפעולה: מה אפשר להוריד כשאין זמן, ואילו משחקים אפשר להוסיף כשיש. קצר, בלי חישובים.
const KINDS_BY_ENERGY: Record<string, string[]> = {
  גבוהה: ['ריצה', 'תופסת', 'הצגה', 'ראווה', 'קבוצתי'],
  בינונית: ['מעגל', 'קבוצתי', 'הצגה', 'ראווה', 'חשיבה'],
  נמוכה: ['רגיעה', 'חשיבה', 'מעגל'],
};

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function pool(a: Activity): QuickGame[] {
  const kinds = KINDS_BY_ENERGY[a.energy] ?? KINDS_BY_ENERGY['בינונית'];
  const noEquip = (g: QuickGame) => g.needs === 'ללא' || g.needs === 'אין';
  const open = (g: QuickGame) => noEquip(g) || (a.place !== 'פנים' && /שטח|סימון/.test(g.needs));
  return quickGames.filter((g) => kinds.includes(g.kind) && (a.shabbat === 'שבת' ? noEquip(g) : open(g)) && !(a.ageMax <= 4 && (g.kind === 'כוח' || g.kind === 'חשיבה')));
}

export function MoreOrLess({ activity }: { activity: Activity }) {
  const steps = timedSteps(activity);
  const skippable = (steps ?? []).filter((t) => !t.core && t.minutes > 0);
  const games = useMemo(() => pool(activity), [activity]);
  const [offset, setOffset] = useState(0);
  if (games.length === 0 && skippable.length === 0) return null;
  const start = hash(activity.id) % Math.max(games.length, 1);
  const shown = [0, 1, 2].map((i) => games[(start + offset + i) % games.length]).filter(Boolean);

  return (
    <section className="no-print" style={{ margin: '34px 0 10px', padding: '16px 20px', border: '1px solid var(--line)', borderRadius: 14, background: 'var(--paper)' }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 10px' }}>לפי הזמן שיש</h2>
      {skippable.length > 0 && (
        <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.7 }}>
          <b>אין הרבה זמן? </b>
          אפשר לוותר על: {skippable.map((t) => `${t.step.label.replace(/\s*\(\d+(?:\s*[–-]\s*\d+)?\s*דק[׳']*\)/, '')} (${t.minutes} דק׳)`).join(' · ')}.
        </p>
      )}
      {shown.length > 0 && (
        <>
          <p style={{ margin: '0 0 8px', fontSize: 14 }}>
            <b>יש עוד זמן? </b>אפשר להוסיף משחק מוכר{activity.shabbat === 'שבת' ? ' (בלי ציוד, מתאים לשבת)' : ''}:
          </p>
          <ul style={{ listStyle: 'none', margin: '0 0 10px', padding: 0, display: 'grid', gap: 8 }}>
            {shown.map((g) => (
              <li key={g.id} style={{ fontSize: 13.5, lineHeight: 1.65 }}>
                <b>{g.name}</b> <span style={{ color: 'var(--ink-faint)' }}>· {g.kind} · {g.players}</span>
                <div style={{ color: 'var(--ink-soft)' }}>{g.description}</div>
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
