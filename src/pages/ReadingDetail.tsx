import { Link, useParams } from 'react-router-dom';
import { getReading } from '../data/readings';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { PrintButton } from '../components/PrintButton';
import { readingToText } from '../lib/contentText';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const domainColor: Record<string, { bg: string; fg: string }> = {
  'אמוני': { bg: 'var(--sky-tint)', fg: 'var(--sky-ink)' },
  'ערכי': { bg: 'var(--lime-tint)', fg: 'var(--lime-ink)' },
  'שניהם': { bg: 'var(--magenta-tint)', fg: 'var(--magenta-ink)' },
};

export function ReadingDetail() {
  const { id } = useParams();
  const reading = getReading(id ?? '');
  useDocumentTitle(reading?.title);

  if (!reading) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>הקטע לא נמצא</h1>
        <Link to="/category/readings" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה לקטעי קריאה</Link>
      </div>
    );
  }

  const colors = domainColor[reading.domain];

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span>
        <Link to="/category/readings">קטעי קריאה</Link><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{reading.title}</span>
      </div>

      <Reveal>
        <div style={{ maxWidth: 720 }}>
          <span style={{ display: 'inline-block', padding: '5px 13px', borderRadius: 999, background: colors.bg, color: colors.fg, fontSize: 12.5, fontWeight: 700, marginBottom: 14 }}>
            {reading.domain === 'שניהם' ? 'אמוני וערכי' : reading.domain}
          </span>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, marginBottom: 10, lineHeight: 1.25 }}>{reading.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 8 }}>{reading.description}</p>
          <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 28 }}>{reading.ageLabel} · מקור: {reading.source}</div>

          <div className="card" style={{ padding: '28px 32px', marginBottom: 24, fontSize: 16.5, lineHeight: 1.95, whiteSpace: 'pre-line' }}>
            {reading.text}
          </div>

          <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--yellow-tint)', fontSize: 14.5, marginBottom: 24 }}>
            <b>איך משתמשים בזה בפעולה: </b>{reading.howToUse}
          </div>

          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrintButton filename={`${reading.id}.html`} title={reading.title} text={readingToText(reading)} />
            <CopyButton text={readingToText(reading)} label="העתקת הקטע כטקסט" copiedLabel="✓ הועתק" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
