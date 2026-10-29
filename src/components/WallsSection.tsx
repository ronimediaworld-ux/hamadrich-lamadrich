import { movementNames } from '../data/movementNames';
import { matchesQuery } from '../lib/textFilter';
import { CopyButton } from './CopyButton';
import { Reveal } from './Reveal';

export function WallsSection({ query }: { query: string }) {
  const movements = movementNames.filter((m) => m.id !== 'general').filter((m) =>
    matchesQuery([m.movement, m.intro, m.groups.map((g) => `${g.name} ${g.grade}`), m.fixed, m.notes], query),
  );
  const gluphot = movementNames.flatMap((m) =>
    m.groups.flatMap((g) => g.slogans.map((text) => ({ text, name: g.name, movement: m.movement }))),
  ).filter((x) => matchesQuery([x.text, x.name, x.movement], query));

  return (
    <>
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, background: 'var(--sky-tint)', fontSize: 13.5, lineHeight: 1.7 }}>
        <b>לפני שמדפיסים משהו: </b>
        שמות משתנים משנה לשנה ומסניף לסניף, ולכן תמיד בודקים מול הרכז או הסניף לפני גלופה, שלט או קיר.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {movements.map((m) => (
          <Reveal key={m.id}>
            <div className="card" style={{ padding: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{m.movement}</h2>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 14px' }}>{m.intro}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {m.groups.map((g) => (
                  <span key={g.name} style={{ padding: '5px 13px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--paper)', fontSize: 14, fontWeight: 800 }}>
                    {g.name} <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-faint)' }}>כיתה {g.grade}</span>
                  </span>
                ))}
              </div>

              {m.fixedTitle && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 6 }}>{m.fixedTitle}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {m.fixed.map((f) => (
                      <span key={f} style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--magenta-tint)', color: 'var(--magenta-ink)', fontSize: 12.5, fontWeight: 700 }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                {m.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '40px 0 6px' }}>גלופות ומשפטים</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: '0 0 16px' }}>{gluphot.length} משפטים. אפשר לחפש לפי שם השכבה או התנועה.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
        {gluphot.map((x) => (
          <div key={x.text} className="card" style={{ padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18, lineHeight: 1.4 }}>{x.text}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{x.movement === 'לכל השכבות' ? x.movement : `${x.movement} · ${x.name}`}</span>
              <CopyButton variant="mini" text={x.text} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
