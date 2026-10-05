import { Link, useParams } from 'react-router-dom';
import { getStaffStudy } from '../data/staffStudy';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { PrintButton } from '../components/PrintButton';
import { staffStudyToText } from '../lib/contentText';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { ViewCount } from '../components/ViewCount';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--flame)' }} />
        <h3 style={{ fontSize: 15.5, fontWeight: 800 }}>{label}</h3>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-soft)', paddingInlineStart: 16, whiteSpace: 'pre-line' }}>{children}</div>
    </div>
  );
}

export function StaffStudyDetail() {
  const { id } = useParams();
  const study = getStaffStudy(id ?? '');
  useDocumentTitle(study?.title);

  if (!study) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>המפגש לא נמצא</h1>
        <Link to="/category/staff-study" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה ללימוד צוות</Link>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span>
        <Link to="/category/staff-study">לימוד צוות</Link><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{study.title}</span>
      </div>

      <Reveal>
        <div style={{ maxWidth: 760 }}>
          <span style={{ display: 'inline-block', padding: '5px 13px', borderRadius: 999, background: 'var(--magenta-tint)', color: 'var(--magenta-ink)', fontSize: 12.5, fontWeight: 700, marginBottom: 14 }}>
            {study.topic}
          </span>
          {study.series && (
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--magenta-ink)', marginBottom: 6 }}>
              מערך: {study.series.title} · מפגש {study.series.part}{study.series.total ? `/${study.series.total}` : ''}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, marginBottom: 10, lineHeight: 1.25 }}>{study.title}</h1>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', marginBottom: 10 }}>{study.description}</p>
          <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 10 }}>{study.duration} דקות · {study.forWhom}</div>
          <div style={{ marginBottom: 20 }}><ViewCount kind="staff-study" id={study.id} /></div>

          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            <PrintButton filename={`${study.id}.html`} title={study.title} text={staffStudyToText(study)} />
            <CopyButton text={staffStudyToText(study)} label="העתקת המפגש כטקסט" copiedLabel="✓ הועתק" />
          </div>

          {study.goals?.length > 0 && (
            <Section label="מטרות">
              <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                {study.goals.map((g, i) => <li key={i} style={{ marginBottom: 6 }}>{g}</li>)}
              </ul>
            </Section>
          )}

          <Section label="פתיחה">
            <p style={{ margin: 0 }}>{study.opening}</p>
          </Section>

          <Section label="תוכן המפגש">
            <p style={{ margin: 0 }}>{study.content}</p>
          </Section>

          {study.explanation && (
            <details style={{ marginBottom: 26, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: 15.5 }}>
                הסבר מעמיק לקטע <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--ink-faint)' }}>(אופציונלי — למי שרוצה להעמיק)</span>
              </summary>
              <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.85, color: 'var(--ink-soft)', whiteSpace: 'pre-line' }}>{study.explanation}</div>
            </details>
          )}

          {study.discussion?.length > 0 && (
            <Section label="שאלות לדיון">
              <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                {study.discussion.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}
              </ul>
            </Section>
          )}

          <Section label="מה לוקחים מזה">
            <p style={{ margin: 0 }}>{study.takeaway}</p>
          </Section>

          {study.sourceLink && (
            <Section label="מקור חיצוני">
              <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px' }}>
                <a href={study.sourceLink.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--flame-ink)', textDecoration: 'underline' }}>
                  {study.sourceLink.title} ↗
                </a>
              </div>
            </Section>
          )}
        </div>
      </Reveal>
    </div>
  );
}
