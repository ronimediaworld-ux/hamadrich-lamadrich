import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';
import { SearchIcon, HeartIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './Icons';

interface NavItem { to: string; label: string; flame?: boolean; desc?: string }
type NavEntry = { kind: 'link'; item: NavItem } | { kind: 'menu'; id: string; label: string; items: NavItem[] };

// הסדר הקבוע של התפריט: הדברים הבולטים בסרגל, ותפריטי משנה ל"תוכן נלווה" ול"אודות".
const NAV: NavEntry[] = [
  { kind: 'link', item: { to: '/category/activities', label: 'פעולות ומערכים' } },
  { kind: 'link', item: { to: '/category/social-nights', label: 'ערבי גיבוש' } },
  { kind: 'link', item: { to: '/ai', label: 'עוזר AI', flame: true } },
  { kind: 'link', item: { to: '/category/staff-study', label: 'לימוד צוות' } },
  { kind: 'link', item: { to: '/category/tools', label: 'סיטואציות בהדרכה' } },
  { kind: 'link', item: { to: '/how-to-build', label: 'נדבר ת׳כלס' } },
  {
    kind: 'menu', id: 'extra', label: 'תוכן נלווה',
    items: [
      { to: '/category/readings', label: 'קטעי קריאה', desc: 'סיפורים, משלים ושירה' },
      { to: '/chuparim', label: 'צ׳ופרים', desc: 'מוכנים להדפסה, עם השם שלכם' },
      { to: '/category/games', label: 'משחקים', desc: 'קרחונים, אמון וגיבוש' },
      { to: '/category/methods', label: 'מתודות', desc: 'כלים לשילוב בכל פעולה' },
    ],
  },
  {
    kind: 'menu', id: 'about', label: 'אודות',
    items: [
      { to: '/about', label: 'אודות', desc: 'מי עומדת מאחורי האתר' },
      { to: '/reviews', label: 'דירוג והמלצות', desc: 'מה אומרים המדריכים' },
    ],
  },
  { kind: 'link', item: { to: '/submit', label: 'שליחת פעולה' } },
];

export function Header() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
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
    <div role="banner" className="no-print site-header" style={{ position: 'sticky', top: 0, zIndex: 60, background: 'var(--paper)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18, flex: 'none' }}>
          <MascotIcon size={30} />
          המדריך למדריך
        </Link>

        <nav ref={navRef} className="header-nav" aria-label="תפריט ראשי" style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>
          {NAV.map((e) =>
            e.kind === 'link' ? (
              <Link key={e.item.to} to={e.item.to} style={e.item.flame ? { color: 'var(--flame-ink)' } : undefined}>{e.item.label}</Link>
            ) : (
              <div key={e.id} className="nav-more" onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setOpenMenu(e.id); }} onMouseLeave={() => { if (window.matchMedia('(hover: hover)').matches) setOpenMenu((cur) => (cur === e.id ? null : cur)); }}>
                <button type="button" className={`nav-more-btn${openMenu === e.id ? ' is-open' : ''}`} aria-expanded={openMenu === e.id} aria-haspopup="true" onClick={() => setOpenMenu(openMenu === e.id ? null : e.id)}>
                  {e.label} <ChevronDownIcon size={14} />
                </button>
                {openMenu === e.id && (
                  <div className="nav-more-panel" role="menu">
                    {e.items.map((l) => (
                      <Link key={l.to} to={l.to} role="menuitem">
                        <span className="nav-more-title">{l.label}</span>
                        {l.desc && <span className="nav-more-desc">{l.desc}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
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
        {NAV.map((e) =>
          e.kind === 'link' ? (
            <Link key={e.item.to} to={e.item.to} style={{ padding: '11px 4px', fontSize: 15.5, fontWeight: 700, borderBottom: '1px solid var(--line)', color: e.item.flame ? 'var(--flame-ink)' : 'var(--ink)' }}>{e.item.label}</Link>
          ) : (
            <div key={e.id} style={{ borderBottom: '1px solid var(--line)', padding: '8px 0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, color: 'var(--ink-faint)', padding: '4px 4px' }}>{e.label}</div>
              {e.items.map((l) => <Link key={l.to} to={l.to} style={{ display: 'block', padding: '8px 14px', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-soft)' }}>{l.label}</Link>)}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
