import { Link } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';

export function Footer() {
  return (
    <div className="no-print" style={{ borderTop: '2px solid var(--ink)', padding: '32px 0 44px', marginTop: 60 }}>
      <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 15 }}>
          <MascotIcon size={22} />
          המדריך למדריך · רוני גרוס
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13.5, color: 'var(--ink-soft)' }}>
          <Link to="/category/activities">מאגר פעולות</Link>
          <Link to="/chuparim">צ׳ופרים</Link>
          <Link to="/ai">עוזר AI</Link>
          <Link to="/category/tools">סיטואציות בהדרכה</Link>
          <Link to="/about">אודות</Link>
          <Link to="/contact">יצירת קשר</Link>
        </div>
      </div>
    </div>
  );
}
