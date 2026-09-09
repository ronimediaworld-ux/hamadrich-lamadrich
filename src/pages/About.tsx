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

export function About() {
  useDocumentTitle('אודות');
  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 760 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <MascotIcon size={48} />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>אודות המדריך למדריך</h1>
            <p style={{ fontSize: 13.5, color: 'var(--ink-faint)' }}>נבנה על ידי רוני גרוס</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div style={{ fontSize: 16, lineHeight: 1.9, color: 'var(--ink-soft)', marginBottom: 30 }}>
          <p style={{ marginBottom: 16 }}>
            "המדריך למדריך" נולד מתוך צורך פשוט: לתת למדריכות ולמדריכים בתנועות הנוער מקום אחד, אמיתי ואיכותי, שבו אפשר למצוא פעולה טובה בלי לחפש שעה ברשת, בלי להוריד PDF מיושן, ובלי להתפשר על תוכן שטחי.
          </p>
          <p style={{ marginBottom: 16 }}>
            כל פעולה באתר בנויה במבנה קבוע וברור — מטרות, פתיחה, מתודה, דיון, הסבר למדריך וסיכום — כדי שגם מדריך/ה חדש/ה בתפקיד יוכל/תוכל להעביר אותה בביטחון, ולא רק להעתיק סיסמאות.
          </p>
          <p>
            האתר ממשיך לגדול — תוכן חדש נוסף באופן שוטף, כולל התאמות לשבת, לגילאים שונים, ולתחומים מגוונים: ערכים, אמונה, פרשת שבוע, גיבוש, ועוד.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 34 }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--flame-ink)' }}>{s.getCount()}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div style={{ background: 'var(--flame-tint)', borderRadius: 18, padding: '26px 30px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>יש לך פעולה טובה, קטע קריאה, או רעיון לצ׳ופר?</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 18 }}>
            נשמח לקבל תוכן ממדריכים — כל הצעה עוברת בדיקת איכות קצרה לפני שהיא מתפרסמת.
          </p>
          <Link to="/contact" className="btn btn-flame">יצירת קשר</Link>
        </div>
      </Reveal>
    </div>
  );
}
