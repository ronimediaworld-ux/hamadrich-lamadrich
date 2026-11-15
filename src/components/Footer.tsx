import { Link } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';
import { SOCIAL } from '../data/social';

export function Footer() {
  return (
    <footer className="no-print" style={{ borderTop: '1.5px solid var(--stroke)', padding: '32px 0 44px', marginTop: 60 }}>
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
          <Link to="/category/walls">קירות וגלופות</Link>
          <Link to="/ai">עוזר AI</Link>
          <Link to="/category/tools">סיטואציות בהדרכה</Link>
          <Link to="/how-to-build">נדבר ת׳כלס</Link>
          <Link to="/videos">סרטונים</Link>
          <Link to="/builder">בונה פעולה</Link>
          <Link to="/shabbat-pack">חבילת שבת</Link>
          <Link to="/favorites">הקלסר שלי</Link>
          <Link to="/about">אודות</Link>
          <Link to="/reviews">דירוג והמלצות</Link>
        </div>
      </div>
      <nav className="wrap" aria-label="רשתות חברתיות" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 18, fontSize: 13.5, fontWeight: 700 }}>
        <span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>עקבו ותצטרפו:</span>
        {SOCIAL.youtube && <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer">יוטיוב</a>}
        {SOCIAL.instagram && <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">אינסטגרם</a>}
        {SOCIAL.whatsapp && <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer">קבוצת וואטסאפ</a>}
      </nav>
      <nav className="wrap" aria-label="מסמכים משפטיים" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 18, fontSize: 12.5, color: 'var(--ink-faint)' }}>
        <Link to="/privacy">מדיניות פרטיות</Link>
        <Link to="/terms">תנאי שימוש</Link>
        <Link to="/accessibility">הצהרת נגישות</Link>
      </nav>
    </footer>
  );
}
