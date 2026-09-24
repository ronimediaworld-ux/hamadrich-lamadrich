import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChupar } from '../data/chuparim';
import { TeenAvatar } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { PrintButton } from '../components/PrintButton';
import { chuparToText } from '../lib/contentText';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { ChuparDesign } from '../components/ChuparDesign';
import { buildChuparPrintHtml, getFields } from '../lib/chuparDesign';
import { offerHtml } from '../lib/printFile';

export function ChuparDetail() {
  const { id } = useParams();
  const chupar = getChupar(id ?? '');
  useDocumentTitle(chupar?.title);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [vals, setVals] = useState<string[]>([]);
  useEffect(() => { setName(''); setVals([]); }, [id]);

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

          <div className="card" style={{ padding: 18, marginBottom: 20 }}>
            <ChuparDesign chupar={chupar} maxWidth={520} name={name} values={vals} />
            {getFields(chupar).length > 0 && (
              <div className="no-print" style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '100%', textAlign: 'center', fontSize: 13, color: 'var(--ink-faint)' }}>אפשר למלא שמות ופרטים לפני ההורדה (או להשאיר ריק ולכתוב בעט):</div>
                {getFields(chupar).map((f, i) => (
                  <label key={i} style={{ fontSize: 13.5, fontWeight: 700 }}>
                    {f.label}:{' '}
                    <input
                      value={vals[i] ?? ''}
                      onChange={(e) => setVals((prev) => { const next = [...prev]; next[i] = e.target.value.slice(0, 22); return next; })}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--line)', fontSize: 14.5, width: 150 }}
                    />
                  </label>
                ))}
              </div>
            )}
            {chupar.print?.customName && (
              <div className="no-print" style={{ marginTop: 16, textAlign: 'center' }}>
                <label style={{ fontSize: 14, fontWeight: 700 }}>
                  הוסיפו את השם שלכם:{' '}
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 14))}
                    placeholder={chupar.print.customName.placeholder}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)', fontSize: 15, width: 180 }}
                  />
                </label>
                <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 6 }}>
                  השם מתווסף אחרי "{chupar.print.customName.prefix}" — למשל "{chupar.print.customName.example}". אפשר גם להשאיר ריק ולכתוב בעט אחרי ההדפסה.
                </div>
              </div>
            )}
            <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-flame"
                disabled={busy}
                onClick={async () => { setBusy(true); await offerHtml(`${chupar.id}.html`, buildChuparPrintHtml(chupar, 1, window.location.origin, name, vals)); setBusy(false); }}
              >
                {busy ? 'רגע...' : 'הורדה להדפסה'}
              </button>
            </div>
          </div>

          {chupar.print?.customName && chupar.designImage && (
            <div className="card no-print" style={{ padding: 16, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>דוגמה — כך רוני עשתה את זה: "{chupar.print.customName.example}"</div>
              <img src={chupar.designImage} alt="דוגמה" style={{ maxWidth: '100%', maxHeight: 220 }} />
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
            <span><b>תקציב: </b>{chupar.budget}</span>
            <span><b>הכנה: </b>{chupar.prepTime}</span>
            <span><b>למי: </b>{chupar.forWhom}</span>
          </div>

          <div className="card" style={{ padding: '20px 24px', marginBottom: 24, fontSize: 15.5, lineHeight: 1.85, whiteSpace: 'pre-line' }}>
            {chupar.tip}
          </div>

          {chupar.canvaTemplateUrl && (
            <div className="no-print" style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--sky-tint)', fontSize: 13, marginBottom: 16 }}>
              <b>רוצים לערוך ולהתאים את העיצוב?</b> לוחצים על הכפתור, ובקנבה פותחים את תפריט <b>File</b> (למעלה משמאל) ובוחרים <b>Make a copy</b> — זה יוצר לכם עותק אישי לעריכה, בלי לגעת בעיצוב המקורי.
            </div>
          )}

          <div className="no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {chupar.canvaTemplateUrl && (
              <a href={chupar.canvaTemplateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-flame">
                פתיחת העיצוב בקנבה ↗
              </a>
            )}
            <PrintButton filename={`${chupar.id}.html`} title={chupar.title} text={chuparToText(chupar)} />
            <CopyButton text={chuparToText(chupar)} label="העתקת הצ׳ופר כטקסט" copiedLabel="✓ הועתק" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
