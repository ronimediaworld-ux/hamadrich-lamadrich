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
            אני רוני גרוס, שמיניסטית. סיימתי שנתיים של הדרכת שכבת גדולות, ובמהלכן ראיתי מקרוב
            את אותו סיפור חוזר: מדריכה יושבת בערב שישי, צריכה פעולה למחר, ומבזבזת שעה בין קבוצות
            וואטסאפ, קבצים סרוקים ו־PDFים ישנים — ובסוף מעבירה משהו חצי־מוכן.
          </p>
          <p style={{ marginBottom: 16 }}>
            "המדריך למדריך" נבנה כדי לפתור בדיוק את זה: מקום אחד, מונגש, עם תוכן אמיתי ואיכותי.
            כל פעולה בנויה במבנה קבוע וברור — מטרה אחת, פתיחה, מהלך שלב־שלב, דיון, הסבר למדריך
            וסיכום — כדי שגם מי שחדשה בתפקיד תוכל להעביר אותה בביטחון, ולא רק להקריא סיסמאות.
          </p>
          <p>
            שמתי דגש על הנגשה: התאמה לטלפון, סינון לפי גיל וזמן, כפתור העתקה בכל תוכן כדי שאפשר
            לערוך ולהתאים לקבוצה, ועוזר AI שמחפש קודם במאגר ואז עוזר לבנות. האתר ממשיך לגדול —
            תוכן חדש נוסף כל הזמן, כולל פעולות לפרשת השבוע, לגילאים שונים ולתחומים מגוונים:
            ערכים, אמונה, גיבוש ועוד.
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

      <Reveal delay={140}>
        <div style={{ background: 'var(--flame-tint)', borderRadius: 18, padding: '26px 30px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>יש לך פעולה טובה, קטע קריאה, או רעיון לצ׳ופר?</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 18 }}>
            אשמח לקבל תוכן ממדריכים — כל הצעה עוברת בדיקת איכות קצרה לפני שהיא מתפרסמת.
          </p>
          <Link to="/submit" className="btn btn-flame">שליחת פעולה</Link>
        </div>
      </Reveal>
    </div>
  );
}
