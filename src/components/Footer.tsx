import { Link } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';

export function Footer() {
  return (
    <div className="no-print" style={{ borderTop: '2px solid var(--ink)', padding: '32px 0 44px', marginTop: 60 }}>
      <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 15 }}>
            <MascotIcon size={22} />
            המדריך למדריך
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            © {new Date().getFullYear()} רוני גרוס, מנהלת האתר · כל הזכויות שמורות
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13.5, color: 'var(--ink-soft)' }}>
          <Link to="/category/activities">מאגר פעולות</Link>
          <Link to="/chuparim">צ׳ופרים</Link>
          <Link to="/ai">עוזר AI</Link>
          <Link to="/category/tools">סיטואציות בהדרכה</Link>
          <Link to="/how-to-build">נדבר ת׳כלס</Link>
          <Link to="/builder">בונה פעולה</Link>
          <Link to="/shabbat-pack">חבילת שבת</Link>
          <Link to="/favorites">הקלסר שלי</Link>
          <Link to="/whats-new">מה חדש</Link>
          <Link to="/about">אודות</Link>
          <Link to="/reviews">דירוג והמלצות</Link>
        </div>
      </div>
    </div>
  );
}
