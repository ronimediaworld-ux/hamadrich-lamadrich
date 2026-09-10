import { useState } from 'react';
import { MascotIcon } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const SUBMIT_EMAIL = 'ronimediaworldd@gmail.com';

// כשיהיה טופס Google מוכן — מדביקים כאן את כתובת ה-embed
// (Google Forms → שליחה → < > → "הטמעת HTML" → מעתיקים רק את ה-src מתוך ה-iframe).
// כל עוד השדה ריק, העמוד מציג טופס מייל עם הנחיה לצרף קובץ.
const FORM_EMBED_URL = '';

export function SubmitActivity() {
  useDocumentTitle('שליחת פעולה');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const mailBody = [
    `שם: ${name || '—'}`,
    `דרך ליצירת קשר (טלפון/מייל): ${contact || '—'}`,
    `שם הפעולה: ${title || '—'}`,
    '',
    'תיאור הפעולה:',
    body,
    '',
    '— אל תשכחו לצרף להודעה את קובץ הפעולה (Word / PDF / תמונה) לפני השליחה —',
  ].join('\n');
  const mailtoHref = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent(
    `הצעת פעולה לאתר — ${title || 'ללא שם'}`,
  )}&body=${encodeURIComponent(mailBody)}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 680 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <MascotIcon size={44} />
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>שליחת פעולה</h1>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-faint)', marginBottom: 28 }}>
          יש לכם פעולה מטורפת? שתפו אותה. אפשר לצרף קובץ (Word, PDF או תמונה). כל הצעה עוברת בדיקת איכות
          קצרה לפני שהיא מתפרסמת במאגר.
        </p>
      </Reveal>

      {FORM_EMBED_URL ? (
        <Reveal delay={40}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <iframe
              src={FORM_EMBED_URL}
              title="טופס שליחת פעולה"
              style={{ width: '100%', height: 900, border: 'none' }}
            >
              טוען טופס…
            </iframe>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal delay={40}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
                שם
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך"
                  style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
                טלפון או מייל לחזרה
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="כדי שנוכל לחזור אליך"
                  style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
                שם הפעולה
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="לדוגמה: פעולת גיבוש לפתיחת שנה"
                  style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
                תיאור הפעולה
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="מהלך, גילאים, נושא, ציוד..."
                  rows={7}
                  required
                  style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none', resize: 'vertical' }}
                />
              </label>

              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--yellow-tint)', fontSize: 13.5, lineHeight: 1.7 }}>
                <b>לצירוף קובץ:</b> הכפתור פותח הודעת מייל מוכנה. לפני השליחה, גררו לתוך המייל את קובץ הפעולה
                (Word / PDF / תמונה) — הוא יגיע אלינו יחד עם הפרטים.
              </div>

              <button type="submit" className="btn btn-flame" style={{ alignSelf: 'flex-start' }}>פתיחת מייל עם הפרטים</button>
            </form>
          </Reveal>

          <Reveal delay={80}>
            <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 22 }}>
              אפשר גם לשלוח ישירות עם הקובץ מצורף אל{' '}
              <a href={`mailto:${SUBMIT_EMAIL}`} style={{ textDecoration: 'underline', fontWeight: 700 }}>{SUBMIT_EMAIL}</a>
            </p>
          </Reveal>
        </>
      )}
    </div>
  );
}
