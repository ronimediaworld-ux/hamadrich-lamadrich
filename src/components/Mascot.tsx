import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';

const routeMessages: { test: (path: string) => boolean; text: string }[] = [
  { test: (p) => p === '/', text: 'היי, אני ניצוץ! בואו נמצא לכם פעולה מושלמת הערב' },
  { test: (p) => p.startsWith('/ai'), text: 'ספרו לי מה אתם צריכים — אני מחפש קודם במאגר, ורק אז מציע ליצור' },
  { test: (p) => p.startsWith('/category/activities'), text: 'ערכים, אמונה ופרשת שבוע — כולם כאן, במקום אחד' },
  { test: (p) => p.startsWith('/category/games'), text: 'קרחונים ומשחקים לכל גודל קבוצה' },
  { test: (p) => p.startsWith('/category/methods'), text: 'מתודות שאפשר לשלב בכל פעולה' },
  { test: (p) => p.startsWith('/category/readings') || p.startsWith('/reading/'), text: 'סיפורים ומשלים, מוכרים ומקוריים, לכל גיל' },
  { test: (p) => p.startsWith('/category/staff-study'), text: 'קצת זמן להתפתחות שלכם, הצוות' },
  { test: (p) => p.startsWith('/category/tools'), text: 'תשובות מהירות לרגעים לא פשוטים בהדרכה' },
  { test: (p) => p.startsWith('/category/social-nights'), text: 'ערבי שיא וגיבוש שנשארים בזיכרון' },
  { test: (p) => p.startsWith('/activity/'), text: 'לחצו על "הורדה להדפסה" כדי לקחת את זה איתכם' },
  { test: (p) => p.startsWith('/chuparim'), text: 'הרגע להפתיע את החניכים' },
  { test: (p) => p.startsWith('/search'), text: 'ננסה למצוא בדיוק את מה שאתם צריכים' },
];

const clickLines = [
  'ביני לבינכם — קשה לבחור רק פעולה אחת מכל אלה',
  'טיפ קטן: כל פעולה אפשר להוריד ולהדפיס בלחיצה אחת',
  'לא מוצאים בדיוק מה שרוצים? תבקשו ממני עזרה בעוזר ה-AI',
  'כל פעולה כאן כתובה לפי מבנה קבוע — קל להעביר אותה גם בלי הכנה מראש',
];

export function Mascot() {
  const location = useLocation();
  const [override, setOverride] = useState<string | null>(null);
  const [bounce, setBounce] = useState(false);
  const [clickIndex, setClickIndex] = useState(0);

  const routeText = routeMessages.find((m) => m.test(location.pathname))?.text
    ?? 'ניצוץ כאן, בכל עמוד — לחצו עלי אם תצטרכו טיפ';
  const text = override ?? routeText;

  function onClick() {
    setBounce(true);
    setTimeout(() => setBounce(false), 500);
    setOverride(clickLines[clickIndex % clickLines.length]);
    setClickIndex((i) => i + 1);
  }

  return (
    <div className="no-print" style={{ position: 'fixed', left: 22, bottom: 22, zIndex: 80, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <div
        style={{
          maxWidth: 220,
          background: 'var(--paper)',
          color: 'var(--ink)',
          border: '2px solid var(--ink)',
          borderRadius: '16px 16px 16px 4px',
          padding: '11px 15px',
          fontSize: 13,
          lineHeight: 1.5,
          fontWeight: 600,
          boxShadow: '0 14px 26px -14px rgba(36,28,17,0.5)',
        }}
      >
        {text}
      </div>
      <div
        role="button"
        aria-label="ניצוץ, עוזר ה-AI"
        onClick={onClick}
        className={`mascot-avatar${bounce ? ' bounce' : ''}`}
        style={{
          flex: 'none',
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'var(--paper)',
          border: '2.5px solid var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 14px 26px -14px rgba(36,28,17,0.55)',
        }}
      >
        <MascotIcon size={38} />
      </div>
    </div>
  );
}
