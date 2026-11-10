import ideasData from '../data/wallIdeas.json';
import guideData from '../data/gluphotGuide.json';
import { matchesQuery } from '../lib/textFilter';
import { Reveal } from './Reveal';

interface Idea { id: string; title: string; kind: string; summary: string; steps: string[]; materials: string[]; time: string; budget: string; difficulty: string; tip: string }
const ideas = ideasData.ideas as Idea[];
const process = ideasData.process as [string, string][];
const guide = guideData as { types: { name: string; how: string; examples: string[]; tip: string }[]; steps: [string, string][]; checklist: string[]; print: string[] };

const DIFF: Record<string, string> = { 'קל': 'var(--lime-tint)', 'בינוני': 'var(--yellow-tint)', 'מאתגר': 'var(--flame-tint)' };

export function WallIdeasSection({ query }: { query: string }) {
  const shown = ideas.filter((i) => matchesQuery([i.title, i.kind, i.summary, i.steps, i.materials], query));
  const showGuide = matchesQuery(['גלופה', 'איך כותבים', 'הדפסה', guide.types.map((t) => `${t.name} ${t.how}`)], query);

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '44px 0 6px' }}>רעיונות לקירות בסניף</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: '0 0 16px' }}>{shown.length} רעיונות, עם צעדים, חומרים וטיפ לכל אחד.</p>
      {shown.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>לא נמצא רעיון שמתאים.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {shown.map((i) => (
          <Reveal key={i.id}>
            <details className="card" style={{ padding: '16px 18px' }}>
              <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-faint)' }}>{i.kind}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 800, padding: '2px 10px', borderRadius: 999, background: DIFF[i.difficulty] ?? 'var(--bg)' }}>{i.difficulty} · {i.budget}</span>
                </div>
                <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{i.title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{i.summary}</div>
              </summary>
              <div style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.7 }}>
                <b>איך עושים:</b>
                <ol style={{ margin: '4px 0 10px', paddingInlineStart: 20 }}>{i.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <div><b>חומרים:</b> {i.materials.join(' · ')}</div>
                <div><b>זמן:</b> {i.time}</div>
                <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--yellow-tint)', borderRadius: 10 }}><b>טיפ: </b>{i.tip}</div>
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '36px 0 10px' }}>איך עושים קיר, שלב אחרי שלב</h2>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {process.map(([t, d]) => (
          <li key={t} className="card" style={{ padding: '14px 16px' }}>
            <b style={{ display: 'block', marginBottom: 4 }}>{t}</b><span style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{d}</span>
          </li>
        ))}
      </ol>

      {showGuide && (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '44px 0 6px' }}>איך כותבים גלופה טובה</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: '0 0 16px' }}>שבע שיטות, חמישה צעדים ורשימת בדיקה. הדוגמאות הן משפטים שכבר באתר.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {guide.types.map((t) => (
              <div key={t.name} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 16.5, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 8 }}>{t.how}</div>
                <ul style={{ margin: '0 0 8px', paddingInlineStart: 18, fontSize: 13.5, fontWeight: 700 }}>{t.examples.map((e) => <li key={e}>{e}</li>)}</ul>
                <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{t.tip}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginTop: 14 }}>
            <div className="card" style={{ padding: '16px 18px' }}>
              <b>חמישה צעדים</b>
              <ol style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
                {guide.steps.map(([t, d]) => <li key={t}><b>{t}</b>: {d}</li>)}
              </ol>
            </div>
            <div className="card" style={{ padding: '16px 18px' }}>
              <b>לפני שמדפיסים, בודקים</b>
              <ul style={{ margin: '8px 0 12px', paddingInlineStart: 18, fontSize: 13.5, lineHeight: 1.7 }}>{guide.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
              <b>טיפים להדפסה</b>
              <ul style={{ margin: '8px 0 0', paddingInlineStart: 18, fontSize: 13.5, lineHeight: 1.7 }}>{guide.print.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}
