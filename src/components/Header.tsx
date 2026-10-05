import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MascotIcon } from './TeenAvatar';
import { SearchIcon, HeartIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './Icons';

interface MenuItem { to: string; label: string; desc?: string }
interface MenuGroup { id: string; label: string; items: MenuItem[] }

// תפריט מסודר לכל האתר — מקובץ לפי מה שמחפשים: תכנים, כלים למדריכים, ועוד.
const MENU: MenuGroup[] = [
  {
    id: 'bank',
    label: 'מאגר תכנים',
    items: [
      { to: '/category/activities', label: 'פעולות ומערכים', desc: 'ערכים, אמונה, פרשת שבוע וכללי' },
      { to: '/category/activities?domain=פרשת שבוע', label: 'פעולות לפרשת השבוע', desc: 'פעולה לכל פרשה' },
      { to: '/category/games', label: 'רשימת משחקים', desc: 'קרחונים, אמון וגיבוש' },
      { to: '/category/social-nights', label: 'ערבי גיבוש וכיף', desc: 'ערבי נושא, משימות ולילות מיוחדים' },
      { to: '/category/methods', label: 'מתודות', desc: 'כלים לשילוב בכל פעולה' },
      { to: '/category/readings', label: 'קטעי קריאה', desc: 'סיפורים, משלים ושירה' },
      { to: '/chuparim', label: 'רעיונות לצ׳ופרים', desc: 'מוכנים להדפסה, עם השם שלכם' },
    ],
  },
  {
    id: 'guides',
    label: 'למדריכים',
    items: [
      { to: '/category/staff-study', label: 'לימוד צוות', desc: 'להתפתח כצוות' },
      { to: '/category/tools', label: 'סיטואציות בהדרכה', desc: 'מה עושים כש...' },
      { to: '/how-to-build?guide=peula', label: 'נדבר ת׳כלס — איך בונים פעולה', desc: 'השלד, שלב אחרי שלב' },
      { to: '/how-to-build?guide=personal-talks', label: 'נדבר ת׳כלס — שיחות אישיות', desc: 'עם כרטיסיות להדפסה' },
      { to: '/how-to-build?guide=canva', label: 'נדבר ת׳כלס — עיצוב בקנבה', desc: 'צ׳ופרים, כרזות וכרטיסים' },
    ],
  },
  {
    id: 'more',
    label: 'עוד',
    items: [
      { to: '/favorites', label: 'הקלסר שלי', desc: 'כל מה ששמרתם, לפי קטגוריות' },
      { to: '/submit', label: 'שליחת פעולה', desc: 'שתפו פעולה משלכם' },
      { to: '/about', label: 'אודות', desc: 'מי עומדת מאחורי האתר' },
      { to: '/reviews', label: 'דירוג והמלצות' },
    ],
  },
];

export function Header() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenGroup(null);
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

  const searchForm = (extraStyle?: React.CSSProperties, className?: string) => (
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
      <div className="wrap" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18, flex: 'none' }}>
          <MascotIcon size={30} />
          המדריך למדריך
        </Link>

        <nav ref={navRef} className="header-nav" aria-label="תפריט ראשי" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          {MENU.map((g) => (
            <div key={g.id} className="nav-dd">
              <button
                type="button"
                className={`nav-dd-btn${openGroup === g.id ? ' is-open' : ''}`}
                aria-expanded={openGroup === g.id}
                aria-haspopup="true"
                onClick={() => setOpenGroup(openGroup === g.id ? null : g.id)}
              >
                {g.label}
                <ChevronDownIcon size={14} />
              </button>
              {openGroup === g.id && (
                <div className="nav-dd-panel" role="menu">
                  {g.items.map((it) => (
                    <Link key={it.to} to={it.to} role="menuitem" className="nav-dd-item">
                      <span className="nav-dd-title">{it.label}</span>
                      {it.desc && <span className="nav-dd-desc">{it.desc}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/ai" className="nav-ai">עוזר AI</Link>
        </nav>

        {searchForm(undefined, 'header-search-wrap')}

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
        {searchForm({ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 })}
        {MENU.map((g) => (
          <div key={g.id} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4, color: 'var(--ink-faint)', padding: '8px 4px 4px' }}>{g.label}</div>
            {g.items.map((it) => (
              <Link key={it.to} to={it.to} style={{ display: 'block', padding: '10px 4px', fontSize: 15.5, fontWeight: 700, borderBottom: '1px solid var(--line)', color: 'var(--ink)' }}>
                {it.label}
              </Link>
            ))}
          </div>
        ))}
        <Link to="/ai" style={{ padding: '12px 4px', fontSize: 16, fontWeight: 800, color: 'var(--flame-ink)' }}>עוזר AI — ניצוץ</Link>
      </div>
    </div>
  );
}
