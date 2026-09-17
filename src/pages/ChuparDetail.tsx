import { Link, useParams } from 'react-router-dom';
import { getChupar } from '../data/chuparim';
import { TeenAvatar } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { PrintButton } from '../components/PrintButton';
import { chuparToText } from '../lib/contentText';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function ChuparDetail() {
  const { id } = useParams();
  const chupar = getChupar(id ?? '');
  useDocumentTitle(chupar?.title);

  if (!chupar) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>הצ׳ופר לא נמצא</h1>
        <Link to="/chuparim" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה לצ׳ופרים</Link>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span>
        <Link to="/chuparim">צ׳ופרים</Link><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{chupar.title}</span>
      </div>

      <Reveal>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--line)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TeenAvatar character={chupar.character} size={38} />
            </div>
            <span style={{ padding: '5px 13px', borderRadius: 999, background: 'var(--flame-tint)', color: 'var(--flame-ink)', fontSize: 12.5, fontWeight: 700 }}>
              {chupar.kind}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.25 }}>{chupar.title}</h1>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', marginBottom: 20 }}>{chupar.description}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <span><b>תקציב: </b>{chupar.budget}</span>
            <span><b>הכנה: </b>{chupar.prepTime}</span>
            <span><b>למי: </b>{chupar.forWhom}</span>
          </div>

          <div className="card" style={{ padding: '20px 24px', marginBottom: 24, fontSize: 15.5, lineHeight: 1.85, whiteSpace: 'pre-line' }}>
            {chupar.tip}
          </div>

          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrintButton filename={`${chupar.id}.html`} title={chupar.title} text={chuparToText(chupar)} />
            <CopyButton text={chuparToText(chupar)} label="העתקת הצ׳ופר כטקסט" copiedLabel="✓ הועתק" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
