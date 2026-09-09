import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MascotIcon } from '../components/TeenAvatar';
import { ActivityCard } from '../components/ActivityCard';
import { searchActivities } from '../lib/search';
import { generateActivity, type GeneratedActivity } from '../lib/aiGenerate';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Activity } from '../data/types';

type Stage = 'idle' | 'searched' | 'generating' | 'generated' | 'error';

export function AIAssistant() {
  useDocumentTitle('עוזר AI');
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [matches, setMatches] = useState<Activity[]>([]);
  const [generated, setGenerated] = useState<GeneratedActivity | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [stage, setStage] = useState<Stage>('idle');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const results = searchActivities(query, 4);
    setMatches(results);
    setLastQuery(query);
    setGenerated(null);
    setStage('searched');
  }

  async function handleGenerate() {
    setStage('generating');
    setErrorMessage('');
    const result = await generateActivity(lastQuery);
    if (result.ok) {
      setGenerated(result.activity);
      setStage('generated');
    } else {
      setErrorMessage(result.message);
      setStage('error');
    }
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <MascotIcon size={40} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>עוזר AI — ניצוץ</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-faint)' }}>קודם מחפש במאגר הקיים, ורק אם באמת אין — עוזר ליצור פעולה חדשה.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginTop: 24, marginBottom: 30 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="לדוגמה: פעולה אמונית לכיתה ח' לשבת"
          style={{ flex: 1, padding: '13px 18px', borderRadius: 999, border: '2.5px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif', fontSize: 15, outline: 'none' }}
        />
        <button type="submit" className="btn btn-flame">חיפוש</button>
      </form>

      {stage === 'searched' && (
        <div>
          {matches.length > 0 ? (
            <>
              <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 14 }}>מצאתי {matches.length} פעולות מהמאגר שמתאימות:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 22 }}>
                {matches.map((a) => <ActivityCard key={a.id} activity={a} />)}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 10 }}>לא בדיוק מה שחיפשתם?</p>
            </>
          ) : (
            <p style={{ fontSize: 14.5, marginBottom: 18 }}>לא מצאתי במאגר פעולה שמתאימה בדיוק ל"{lastQuery}".</p>
          )}
          <button className="btn btn-outline" onClick={handleGenerate}>
            צור פעולה חדשה עם ניצוץ (AI)
          </button>
        </div>
      )}

      {stage === 'generating' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-faint)', fontSize: 14.5 }}>
          <MascotIcon size={24} className="doodle-wiggle" />
          ניצוץ חושב על פעולה...
        </div>
      )}

      {stage === 'error' && (
        <div style={{ background: 'var(--magenta-tint)', color: 'var(--magenta-ink)', borderRadius: 12, padding: '14px 18px', fontSize: 14 }}>
          {errorMessage}
        </div>
      )}

      {stage === 'generated' && generated && (
        <div className="card" style={{ padding: 26 }}>
          <span style={{ display: 'inline-block', padding: '4px 11px', borderRadius: 999, background: 'var(--flame-tint)', color: 'var(--flame-ink)', fontSize: 11.5, fontWeight: 700, marginBottom: 10 }}>
            נוצר על ידי AI — טרם נבדק
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{generated.title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 13, color: 'var(--ink-faint)', marginBottom: 16 }}>
            <span>{generated.ageLabel}</span>
            <span>{generated.duration} דק׳</span>
            <span>{generated.groupSize}</span>
            <span>{generated.shabbat}</span>
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 18 }}>{generated.description}</p>

          <Field label="מטרות"><ul style={{ margin: 0, paddingInlineStart: 18 }}>{generated.goals.map((g, i) => <li key={i}>{g}</li>)}</ul></Field>
          <Field label="פתיחה"><p style={{ margin: 0 }}>{generated.opening}</p></Field>
          {generated.game && <Field label="משחק"><p style={{ margin: 0 }}>{generated.game}</p></Field>}
          <Field label="מתודה"><p style={{ margin: 0 }}>{generated.method}</p></Field>
          <Field label="דיון"><ul style={{ margin: 0, paddingInlineStart: 18 }}>{generated.discussion.map((d, i) => <li key={i}>{d}</li>)}</ul></Field>
          <Field label="הסבר למדריך"><p style={{ margin: 0 }}>{generated.guideNotes}</p></Field>
          <Field label="סיכום"><p style={{ margin: 0 }}>{generated.summary}</p></Field>

          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--yellow-tint)', fontSize: 13.5, marginTop: 8 }}>
            <b>טיפ: </b>{generated.tip}
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 18 }}>
            זו טיוטה שנוצרה על ידי AI ולא עברה בדיקת איכות — כדאי לעבור עליה ולהתאים לפני שמעבירים אותה בפועל.
          </p>
        </div>
      )}

      {stage === 'idle' && (
        <p style={{ fontSize: 13.5, color: 'var(--ink-faint)' }}>
          לדוגמה: "פעולה על חברות לכיתה ז'", "משחק גיבוש בלי ציוד", "20 דקות על אחריות אישית". רוצים לחזור למאגר? <Link to="/category/activities" style={{ textDecoration: 'underline' }}>לכל הפעולות</Link>.
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--flame-ink)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{children}</div>
    </div>
  );
}
