import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';
import { SearchIcon, HeartIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './Icons';

interface NavItem { to: string; label: string; flame?: boolean }

// הדברים החשובים — תמיד בסרגל העליון.
const MAIN_LINKS: NavItem[] = [
  { to: '/category/activities', label: 'פעולות ומערכים' },
  { to: '/category/activities?domain=פרשת שבוע', label: 'פרשת השבוע' },
  { to: '/category/social-nights', label: 'ערבי גיבוש' },
  { to: '/category/readings', label: 'קטעי קריאה' },
  { to: '/chuparim', label: 'צ׳ופרים' },
  { to: '/ai', label: 'עוזר AI', flame: true },
];

// כל השאר — בתוך תפריט "עוד".
const MORE_LINKS: NavItem[] = [
  { to: '/category/games', label: 'רשימת משחקים' },
  { to: '/category/methods', label: 'מתודות' },
  { to: '/category/staff-study', label: 'לימוד צוות' },
  { to: '/category/tools', label: 'סיטואציות בהדרכה' },
  { to: '/how-to-build', label: 'נדבר ת׳כלס' },
  { to: '/how-to-build?guide=personal-talks', label: 'שיחות אישיות עם חניכים' },
  { to: '/how-to-build?guide=canva', label: 'עיצוב בקנבה' },
  { to: '/favorites', label: 'הקלסר שלי' },
  { to: '/submit', label: 'שליחת פעולה' },
  { to: '/about', label: 'אודות' },
  { to: '/reviews', label: 'דירוג והמלצות' },
];

export function Header() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setMenuOpen(false);
    }
  }

  const searchForm = (className?: string, extraStyle?: React.CSSProperties) => (
    <form onSubmit={onSearch} className={className} style={{ background: 'var(--bg)', border: '2px solid var(--ink)', borderRadius: 999, padding: '6px 6px 6px 14px', ...extraStyle }}>
      <SearchIcon size={16} color="var(--ink-soft)" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="חיפוש בכל האתר..."
        aria-label="חיפוש בכל האתר"
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 13.5 }}
      />
      <button type="submit" className="btn btn-flame" style={{ padding: '7px 14px', fontSize: 13 }}>חיפוש</button>
    </form>
  );

  return (
    <div className="no-print site-header" style={{ position: 'sticky', top: 0, zIndex: 60, background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18, flex: 'none' }}>
          <MascotIcon size={30} />
          המדריך למדריך
        </Link>

        <nav className="header-nav" aria-label="תפריט ראשי" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          {MAIN_LINKS.map((l) => (
            <Link key={l.to} to={l.to} style={l.flame ? { color: 'var(--flame-ink)' } : undefined}>{l.label}</Link>
          ))}
          <div ref={moreRef} className="nav-more">
            <button type="button" className={`nav-more-btn${moreOpen ? ' is-open' : ''}`} aria-expanded={moreOpen} aria-haspopup="true" onClick={() => setMoreOpen((v) => !v)}>
              עוד <ChevronDownIcon size={14} />
            </button>
            {moreOpen && (
              <div className="nav-more-panel" role="menu">
                {MORE_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} role="menuitem">{l.label}</Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {searchForm('header-search-wrap')}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <Link to="/favorites" aria-label="הקלסר שלי" title="הקלסר שלי" style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)' }}>
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

      <div className={`header-mobile-panel${menuOpen ? ' is-open' : ''}`} style={{ flexDirection: 'column', gap: 4, borderTop: '1px solid var(--line)', padding: '14px 18px 20px', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto' }}>
        {searchForm(undefined, { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 })}
        {MAIN_LINKS.map((l) => (
          <Link key={l.to} to={l.to} style={{ padding: '11px 4px', fontSize: 15.5, fontWeight: 700, borderBottom: '1px solid var(--line)', color: l.flame ? 'var(--flame-ink)' : 'var(--ink)' }}>{l.label}</Link>
        ))}
        {MORE_LINKS.map((l) => (
          <Link key={l.to} to={l.to} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 600, color: 'var(--ink-faint)' }}>{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
