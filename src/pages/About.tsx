import { Link } from 'react-router-dom';
import { MascotIcon } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { activities } from '../data/activities';
import { chuparim } from '../data/chuparim';
import { situations } from '../data/situations';
import { methods } from '../data/methods';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';

const stats = [
  { label: 'פעולות ומערכים', getCount: () => activities.length },
  { label: 'מתודות', getCount: () => methods.length },
  { label: 'קטעי קריאה', getCount: () => readings.length },
  { label: 'רעיונות לצ׳ופרים', getCount: () => chuparim.length },
  { label: 'סיטואציות בהדרכה', getCount: () => situations.length },
  { label: 'מפגשי לימוד צוות', getCount: () => staffStudy.length },
];

const features = [
  { title: 'פעולות במבנה קבוע וברור', body: 'מטרה, פתיחה, מהלך שלב־שלב עם זמנים, דיון, הסבר למדריך וסיכום — כדי להעביר בביטחון, ולא רק להקריא סיסמאות.' },
  { title: 'צ׳ופרים מעוצבים, מוכנים להדפסה', body: 'כמה עותקים בדף, רק לגזור ולחלק. וכל מדריך או מדריכה מוסיפים את השם שלהם.' },
  { title: 'ניצוץ — עוזר שמחפש קודם במאגר', body: 'קודם בודק מה כבר יש באתר, ורק אחר כך עוזר לבנות פעולה חדשה. פעולה בשבילכם בתוך שניות.' },
  { title: 'גם לצוות, לא רק לחניכים', body: 'לימוד צוות, סיטואציות אמיתיות מההדרכה וכלים מעשיים — כי גם מדריכים צריכים מקום ללמוד.' },
];

function Step({ children, tone }: { children: React.ReactNode; tone?: 'gold' }) {
  return (
    <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 'clamp(22px, 3.4vw, 30px)', lineHeight: 1.3, color: tone === 'gold' ? 'var(--flame-ink)' : 'var(--ink)' }}>
      {children}
    </div>
  );
}

export function About() {
  useDocumentTitle('אודות');
  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 820 }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <MascotIcon size={56} />
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 900, lineHeight: 1.12, margin: '14px 0 10px' }}>
            נבנה על ידי מדריכה,<br />בשביל מדריכים
          </h1>
          <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', maxWidth: '46ch', margin: '0 auto' }}>
            המדריך למדריך — מאגר פעולות איכותי, כדי שלא תצטרכו להתחיל מאפס.
          </p>
        </div>
      </Reveal>

      {/* כרטיס המנהלת */}
      <Reveal delay={40}>
        <div className="card" style={{ padding: '26px 28px', display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap', marginBottom: 34, background: 'var(--flame-tint)', border: '2px solid var(--ink)' }}>
          <div style={{ flex: 'none', width: 84, height: 84, borderRadius: '50%', background: 'var(--paper)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MascotIcon size={56} />
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--flame-ink)', marginBottom: 2 }}>מנהלת האתר</div>
            <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 30, lineHeight: 1.1, marginBottom: 8 }}>רוני גרוס</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--paper)', border: '1.5px solid var(--ink)', fontSize: 13, fontWeight: 700 }}>שמיניסטית</span>
              <span style={{ padding: '4px 12px', borderRadius: 999, background: 'var(--paper)', border: '1.5px solid var(--ink)', fontSize: 13, fontWeight: 700 }}>הדרכתי שנתיים שכבת גדולות</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }} aria-label="שנתיים של הדרכה: כיתה ח׳ וכיתה ט׳">
            <span style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 28, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 14, padding: '2px 14px' }}>ח׳</span>
            <span aria-hidden="true" style={{ fontWeight: 900, color: 'var(--flame)', fontSize: 26 }}>←</span>
            <span style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 28, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 14, padding: '2px 14px' }}>ט׳</span>
          </div>
        </div>
      </Reveal>

      {/* הסיפור */}
      <Reveal delay={60}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 34 }}>
          <Step>ערב שישי. מחר יש פעולה.<br />ואין לך כלום מוכן.</Step>
          <p style={{ fontSize: 16.5, lineHeight: 1.95, color: 'var(--ink-soft)', margin: 0 }}>
            שנתיים הדרכתי שכבת גדולות, ובכל שבוע ראיתי את אותו סיפור: קבוצות וואטסאפ, קבצי PDF סרוקים,
            ושעה שלמה של חיפושים — ובסוף מעבירים משהו חצי־מוכן.
          </p>
          <Step tone="gold">והיה חסר לי מקום אחד שייתן…</Step>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['פעולות איכותיות', 'רעיונות', 'כלים'].map((t) => (
              <span key={t} style={{ padding: '8px 18px', borderRadius: 14, background: 'var(--paper)', border: '2px dashed var(--ink)', fontWeight: 800, fontFamily: 'Rubik, sans-serif', fontSize: 15.5 }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize: 16.5, lineHeight: 1.95, color: 'var(--ink-soft)', margin: 0 }}>
            אז בניתי אותו. "המדריך למדריך" הוא מקום אחד, מסודר ומונגש, עם תוכן אמיתי שאפשר לקחת ולהעביר —
            ולהתאים לקבוצה שלכם. האתר ממשיך לגדול: תוכן חדש נוסף כל הזמן, כולל פעולות לכל פרשות השבוע,
            לגילאים שונים ולתחומים מגוונים — ערכים, אמונה, גיבוש ועוד.
          </p>
        </div>
      </Reveal>

      {/* מה יש כאן */}
      <Reveal delay={80}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>מה תמצאו כאן</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14, marginBottom: 34 }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 6, fontFamily: 'Rubik, sans-serif' }}>{f.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14, marginBottom: 34 }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--flame-ink)' }}>{s.getCount()}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div style={{ background: 'var(--ink)', color: '#F3ECDD', borderRadius: 22, padding: '28px 32px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>יש לך פעולה טובה, קטע קריאה, או רעיון לצ׳ופר?</h2>
          <p style={{ fontSize: 14.5, color: '#CBBFA6', marginBottom: 18 }}>
            אשמח לקבל תוכן ממדריכים — כל הצעה עוברת בדיקת איכות קצרה לפני שהיא מתפרסמת.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/submit" className="btn btn-flame">שליחת פעולה</Link>
            <Link to="/reviews" className="btn" style={{ background: '#F3ECDD', color: 'var(--ink)' }}>דירוג והמלצות</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
