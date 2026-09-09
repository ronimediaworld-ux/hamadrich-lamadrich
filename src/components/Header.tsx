import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';
import { SearchIcon, HeartIcon, MenuIcon, CloseIcon } from './Icons';

const navLinks = [
  { to: '/category/activities', label: 'פעולות ומערכים' },
  { to: '/category/games', label: 'משחקים' },
  { to: '/category/social-nights', label: 'ערבי גיבוש' },
  { to: '/category/methods', label: 'מתודות' },
  { to: '/category/readings', label: 'קטעי קריאה' },
  { to: '/category/staff-study', label: 'לימוד צוות' },
  { to: '/chuparim', label: 'צ׳ופרים' },
  { to: '/ai', label: 'עוזר AI', flame: true },
];

const secondaryLinks = [
  { to: '/category/tools', label: 'סיטואציות בהדרכה' },
  { to: '/about', label: 'אודות' },
  { to: '/contact', label: 'יצירת קשר' },
];

export function Header() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 60, background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18, flex: 'none' }}>
          <MascotIcon size={30} />
          המדריך למדריך
        </Link>

        <nav className="header-nav" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={l.flame ? { color: 'var(--flame-ink)' } : undefined}>{l.label}</Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="header-search-wrap" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', border: '2px solid var(--ink)', borderRadius: 999, padding: '6px 6px 6px 14px' }}>
          <SearchIcon size={16} color="var(--ink-soft)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש..."
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-flame" style={{ padding: '7px 14px', fontSize: 13 }}>חיפוש</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <Link to="/favorites" aria-label="הפעולות שלי" style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)' }}>
            <HeartIcon size={17} color="var(--ink-soft)" />
          </Link>
          <button
            className="header-burger"
            aria-label={menuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)', background: 'transparent' }}
          >
            {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      <div className={`header-mobile-panel${menuOpen ? ' is-open' : ''}`} style={{ flexDirection: 'column', gap: 4, borderTop: '1px solid var(--line)', padding: '14px 18px 20px' }}>
        <form onSubmit={onSearch} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', border: '2px solid var(--ink)', borderRadius: 999, padding: '6px 6px 6px 14px', marginBottom: 12 }}>
          <SearchIcon size={16} color="var(--ink-soft)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש..."
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-flame" style={{ padding: '7px 14px', fontSize: 13 }}>חיפוש</button>
        </form>
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{ padding: '11px 4px', fontSize: 15.5, fontWeight: 700, borderBottom: '1px solid var(--line)', color: l.flame ? 'var(--flame-ink)' : 'var(--ink)' }}
          >
            {l.label}
          </Link>
        ))}
        {secondaryLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{ padding: '11px 4px', fontSize: 14, fontWeight: 600, color: 'var(--ink-faint)' }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
