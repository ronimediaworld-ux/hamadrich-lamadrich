import { useState } from 'react';
import { MascotIcon } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const CONTACT_EMAIL = 'rotemgross10@gmail.com';

export function Contact() {
  useDocumentTitle('יצירת קשר');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const mailBody = [message, '', `שם: ${name || '—'}`].join('\n');
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || 'פנייה מהאתר — המדריך למדריך')}&body=${encodeURIComponent(mailBody)}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 600 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <MascotIcon size={44} />
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>יצירת קשר</h1>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-faint)', marginBottom: 30 }}>
          שאלה, הצעת תוכן, או משוב על האתר — נשמח לשמוע. מילוי הטופס יפתח הודעת מייל מוכנה אליי.
        </p>
      </Reveal>

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
            נושא
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="לדוגמה: הצעת פעולה חדשה"
              style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
            הודעה
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="כתבו כאן..."
              rows={6}
              required
              style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none', resize: 'vertical' }}
            />
          </label>

          <button type="submit" className="btn btn-flame" style={{ alignSelf: 'flex-start' }}>שליחה במייל</button>
        </form>
      </Reveal>

      <Reveal delay={80}>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 24 }}>
          אפשר גם לפנות ישירות: <a href={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: 'underline', fontWeight: 700 }}>{CONTACT_EMAIL}</a>
        </p>
      </Reveal>
    </div>
  );
}
