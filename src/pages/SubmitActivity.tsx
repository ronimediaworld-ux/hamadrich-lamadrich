import { useState } from 'react';
import { MascotIcon } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { fileToBase64, postSubmission } from '../lib/api';

const SUBMIT_EMAIL = 'ronimediaworldd@gmail.com';
const MAX_FILE = 700 * 1024;
const FIELD: React.CSSProperties = { padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' };
const LABEL: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 };

export function SubmitActivity() {
  useDocumentTitle('שליחת פעולה');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const mailBody = [
    `שם: ${name || '—'}`,
    `דרך ליצירת קשר: ${contact || '—'}`,
    `שם הפעולה: ${title || '—'}`,
    '',
    'תיאור הפעולה:',
    body,
  ].join('\n');
  const mailtoHref = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent(`הצעת פעולה לאתר — ${title || 'ללא שם'}`)}&body=${encodeURIComponent(mailBody)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (file && file.size > MAX_FILE) {
      setError('הקובץ גדול מדי (עד כ-700KB). אפשר לשלוח אותו במייל.');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name, contact, title, body, website,
        ...(file ? { file: { name: file.name, type: file.type || 'application/octet-stream', data: await fileToBase64(file) } } : {}),
      };
      const r = await postSubmission(payload);
      if (r.ok) {
        setState('sent');
        setName(''); setContact(''); setTitle(''); setBody(''); setFile(null);
      } else {
        setState('error');
        setError(r.message || 'לא הצלחנו לשלוח.');
      }
    } catch {
      setState('error');
      setError('לא הצלחנו לקרוא את הקובץ — נסו קובץ אחר.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 680 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <MascotIcon size={44} />
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>שליחת פעולה</h1>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-faint)', marginBottom: 28 }}>
          יש לכם פעולה מטורפת? שתפו אותה — אפשר לצרף קובץ (Word, PDF או תמונה). כל הצעה עוברת בדיקת איכות
          קצרה לפני שהיא מתפרסמת במאגר.
        </p>
      </Reveal>

      {state === 'sent' ? (
        <Reveal delay={40}>
          <div className="card" style={{ padding: '30px 28px', textAlign: 'center', background: 'var(--lime-tint)' }}>
            <div style={{ fontFamily: 'Rubik, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>הפעולה התקבלה, תודה!</div>
            <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
              נעבור עליה, ואם צריך נחזור אליכם לפרטים שהשארתם. פעולות שעוברות את הבדיקה מתפרסמות באתר.
            </p>
            <button type="button" className="btn btn-outline" onClick={() => setState('idle')}>שליחת פעולה נוספת</button>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={40}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={LABEL}>
              שם
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="השם שלך" maxLength={80} style={FIELD} />
            </label>
            <label style={LABEL}>
              טלפון או מייל לחזרה
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="כדי שנוכל לחזור אליך" required maxLength={120} style={FIELD} />
            </label>
            <label style={LABEL}>
              שם הפעולה
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="לדוגמה: פעולת גיבוש לפתיחת שנה" maxLength={140} style={FIELD} />
            </label>
            <label style={LABEL}>
              תיאור הפעולה
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="מהלך, גילאים, נושא, ציוד..." rows={7} required minLength={10} maxLength={8000} style={{ ...FIELD, resize: 'vertical' }} />
            </label>
            <label style={LABEL}>
              קובץ מצורף (לא חובה)
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ ...FIELD, padding: '10px 12px', fontSize: 13.5 }} />
              <span style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--ink-faint)' }}>
                PDF, Word, תמונה או טקסט, עד כ-700KB. לקבצים גדולים יותר — שלחו במייל.
              </span>
            </label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

            {error && <div role="alert" style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--flame-tint)', color: 'var(--flame-ink)', fontSize: 14 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="submit" className="btn btn-flame" disabled={busy}>{busy ? 'שולח...' : 'שליחת הפעולה'}</button>
              {state === 'error' && (
                <a href={mailtoHref} className="btn btn-outline">שליחה במייל במקום</a>
              )}
            </div>
          </form>
        </Reveal>
      )}

      <Reveal delay={80}>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 22 }}>
          אפשר גם לשלוח ישירות במייל אל{' '}
          <a href={`mailto:${SUBMIT_EMAIL}`} style={{ textDecoration: 'underline', fontWeight: 700 }}>{SUBMIT_EMAIL}</a>
        </p>
      </Reveal>
    </div>
  );
}
