import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ActivityCard } from '../components/ActivityCard';
import { MascotIcon } from '../components/TeenAvatar';
import { CategoryIcon, CAT_STYLE } from '../components/CategoryIcon';
import { HeroMascot } from '../components/HeroMascot';
import { quickGames } from '../data/quickGames';
import { methods } from '../data/methods';
import { movementNames } from '../data/movementNames';
import { SearchIcon, ChevronDownIcon } from '../components/Icons';
import { categories } from '../data/categories';
import { activities } from '../data/activities';
import { getCurrentParsha, getCurrentParshaNames } from '../lib/parsha';
import { CountUp } from '../components/CountUp';
import { SubscribeBox } from '../components/SubscribeBox';
import { WhatsNewHome } from '../components/WhatsNewHome';
import { SEVEN_BONUS, SEVEN_PARTS } from '../data/sevenParts';
import { readings } from '../data/readings';
import { chuparim } from '../data/chuparim';
import { staffStudy } from '../data/staffStudy';
import { situations } from '../data/situations';

const shortcuts = ['אני צריך פעולה', 'משחק מהיר', 'פרשת השבוע', 'פעולה לשבת', 'משהו בלי ציוד', 'פעולה אמונית', '20 דקות פנויות'];
const shortcutTint = ['#FBE4D2', '#E1F0E5', '#DCEAF2', '#F6DDE7', '#FBF0CE', '#ECE4F5', '#D6EDED'];

const statColor: Record<string, string> = { 'פעולות ומערכים': '#D96A2B', 'קטעי קריאה': '#6B4A9B', 'רעיונות לצ׳ופרים': '#C99411', 'סיטואציות בהדרכה': '#5E7F2A', 'מפגשי לימוד צוות': '#3E7EA6' };

const recommendedIds = ['circle-of-friendship', 'faith-in-hard-times', 'noach-one-persons-power', 'lonely-island-game', 'white-night-outdoors'];

export function Home() {
  const [q, setQ] = useState('');
  const [rolling, setRolling] = useState<string | null>(null);
  const rollRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const catCounts: Record<string, number> = {
    activities: activities.filter((a) => a.categorySlug === 'activities').length,
    'social-nights': activities.filter((a) => a.categorySlug === 'social-nights').length,
    'staff-study': staffStudy.length,
    tools: situations.length,
    readings: readings.length,
    games: quickGames.length,
    methods: methods.length,
    walls: movementNames.reduce((n, m) => n + m.groups.reduce((k, g) => k + g.slogans.length, 0), 0),
  };
  const recommended = recommendedIds.map((id) => activities.find((a) => a.id === id)!).filter(Boolean);

  const currentParsha = getCurrentParsha();
  const parshaNames = getCurrentParshaNames();
  const parshaActivities = parshaNames.length
    ? activities.filter((a) => a.categorySlug === 'activities' && a.tags.some((t) => parshaNames.includes(t))).slice(0, 6)
    : [];

  // "הפתיעו אותי": גלגל כותרות קצר ואז נפתחת פעולה אקראית.
  function surprise() {
    if (rollRef.current) return;
    const pool = activities.filter((a) => a.categorySlug === 'activities');
    const target = pool[Math.floor(Math.random() * pool.length)];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(`/activity/${target.id}`);
      return;
    }
    let ticks = 0;
    rollRef.current = window.setInterval(() => {
      ticks += 1;
      setRolling(pool[Math.floor(Math.random() * pool.length)].title);
      if (ticks >= 12) {
        if (rollRef.current) window.clearInterval(rollRef.current);
        rollRef.current = null;
        setRolling(target.title);
        window.setTimeout(() => { setRolling(null); navigate(`/activity/${target.id}`); }, 650);
      }
    }, 90);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div>
      {/* HERO */}
      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 60, textAlign: 'center' }}>
        <Reveal>
          <div style={{ marginBottom: 6 }}>
            <HeroMascot size={112} />
            <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: -0.3, marginTop: 8 }}>
              המדריך למדריך
            </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 66px)', fontWeight: 900, lineHeight: 1.06, marginBottom: 18 }}>
            מה אתם צריכים<br />להעביר{' '}
            <span className="squig">היום<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12C25 2 40 18 62 9s38 9 60 0 38 9 60 1 15-2 15-2" /></svg></span>?
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p style={{ maxWidth: 560, margin: '0 auto 30px', fontSize: 17.5, color: 'var(--ink-soft)' }}>
            מאגר פעולות איכותי, בנוי שלב־שלב ומוכן להעברה. בוחרים, מדפיסים — ועולים לפעולה בביטחון.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <form onSubmit={onSearch} className="hero-search" style={{ display: 'flex', gap: 10, maxWidth: 640, margin: '0 auto', background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 999, padding: '8px 8px 8px 20px' }}>
            <SearchIcon size={18} color="var(--ink-soft)" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="חיפוש בכל האתר — לדוגמה: פעולה אמונית לכיתה ח' לשבת"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 15.5 }}
            />
            <button type="submit" className="btn btn-flame">חיפוש</button>
          </form>
        </Reveal>

        <Reveal delay={170}>
          <Link
            to="/ai"
            className="nitzotz-cta"
            aria-label="פתיחת הצ׳אט עם ניצוץ, עוזר ה-AI"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 999, padding: '7px 16px 7px 8px', marginTop: 22 }}
          >
            <MascotIcon size={32} />
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>היי, אני ניצוץ — לחצו כדי לשוחח איתי בצ׳אט</span>
            <span aria-hidden="true" style={{ fontWeight: 800, color: 'var(--flame-ink)' }}>←</span>
          </Link>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9, marginTop: 20 }}>
            {shortcuts.map((s, i) => (
              <button key={s} className="chip hero-chip" style={{ ['--t' as string]: shortcutTint[i % shortcutTint.length], ...(i === 0 ? { background: 'var(--flame)', color: '#FFF6EE' } : null) }} onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}>{s}</button>
            ))}
            <button className="chip" style={{ background: 'var(--yellow-tint)' }} onClick={surprise} aria-live="polite">
              {rolling ? <span key={rolling} className="roll-title">{rolling}</span> : 'הפתיעו אותי'}
            </button>
          </div>
        </Reveal>

        <div className="scroll-hint" style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--ink-faint)', fontSize: 12 }}>
          גללו
          <ChevronDownIcon size={18} />
        </div>
      </div>

      {/* STATS */}
      <div className="wrap" style={{ paddingBottom: 44 }}>
        <Reveal>
          <div className="stat-strip stagger">
            {[
              ['פעולות ומערכים', activities.length],
              ['קטעי קריאה', readings.length],
              ['רעיונות לצ׳ופרים', chuparim.length],
              ['סיטואציות בהדרכה', situations.length],
              ['מפגשי לימוד צוות', staffStudy.length],
            ].map(([label, n]) => (
              <div key={String(label)} className="card stat-card" style={{ textAlign: 'center', padding: '14px 8px' }}>
                <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 30, color: statColor[String(label)] ?? 'var(--flame-ink)', lineHeight: 1.1 }}><CountUp to={Number(n)} /></div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* WHAT'S NEW */}
      <Reveal><WhatsNewHome /></Reveal>

      {/* QUICK TOOLS */}
      <div className="wrap" style={{ paddingBottom: 36 }}>
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink-soft)' }}>כלים מהירים:</span>
            <Link to="/now" className="chip">אני צריכה פעולה עכשיו</Link>
            <Link to="/builder" className="chip">בונה פעולה</Link>
            <Link to="/shabbat-pack" className="chip">חבילת שבת להדפסה</Link>
            <Link to="/category/activities?domain=פרשת שבוע" className="chip">פעולות לפרשת השבוע</Link>
            <Link to="/favorites" className="chip">הקלסר שלי</Link>
          </div>
        </Reveal>
      </div>

      {/* BUILD YOUR OWN */}
      <div className="wrap" style={{ paddingBottom: 40 }}>
        <Reveal>
          <section aria-labelledby="home-build" className="build-section" style={{ border: '2px solid var(--ink)', borderRadius: 28, padding: '30px 34px', background: 'var(--paper)' }}>
            <h2 id="home-build" style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>רוצות לבנות פעולה משלכן? מאפס, בשיטה שלי</h2>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 14px', lineHeight: 1.75, maxWidth: '62ch' }}>
              שבעה חלקים בסדר קבוע, כל אחד בצבע משלו, ובסוף צ׳ופר כבונוס. ממלאות תבנית אישית, שומרות בדפדפן ומדפיסות.
            </p>
            <div className="roadmap">
              {[...SEVEN_PARTS, SEVEN_BONUS].map((p) => (
                <div key={p.name} style={{ ['--c' as string]: p.color }}>
                  <b>{p.n === 8 ? '+' : p.n}</b>
                  {p.name}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link to="/my/new" className="btn btn-flame">לבנות פעולה מאפס</Link>
              <Link to="/how-to-build" className="btn btn-outline">איך זה עובד</Link>
            </div>
          </section>
        </Reveal>
      </div>

      {/* CATEGORIES */}
      <div className="wrap" style={{ paddingBottom: 50 }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>לפי מה מתחשק לכם היום</h2>
          </div>
        </Reveal>
        <Reveal delay={40}>
          <div className="home-cats stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16 }}>
            {categories.map((c) => {
              const st = CAT_STYLE[c.slug] ?? CAT_STYLE.activities;
              return (
                <Link key={c.slug} to={`/category/${c.slug}`} className="cat-tile" style={{ ['--t' as string]: st.tint, ['--c' as string]: st.color }}>
                  <CategoryIcon slug={c.slug} className="cat-ic" />
                  <div>
                    <h3>{c.label}</h3>
                    <p>{c.description}</p>
                  </div>
                  {catCounts[c.slug] ? <span className="cat-n">{catCounts[c.slug]}</span> : null}
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* RECOMMENDED */}
      <div style={{ paddingBottom: 50 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>תוכן מומלץ השבוע</h2>
            </div>
            <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 20 }}>לחצו על פעולה כדי לפתוח אותה במלואה — מטרות, פתיחה, מתודה, דיון וסיכום</p>
          </Reveal>
        </div>
        <Reveal delay={40}>
          <div className="marquee" aria-label="תוכן מומלץ, נע בלולאה. מעבר עכבר או נגיעה עוצרים את התנועה">
            <div className="marquee-track">
              {[...recommended, ...recommended, ...recommended].map((a, i) => (
                <div key={`${a.id}-${i}`} aria-hidden={i >= recommended.length ? true : undefined} style={{ flex: 'none', marginInlineEnd: 20 }}>
                  <ActivityCard activity={a} rotate={[-2, 1.5, -1, 2, -2.5][i % 5]} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* PARSHA MODULE */}
      <div className="wrap" style={{ paddingBottom: 50 }}>
        <Reveal>
          <div className="home-split parsha-panel" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 0 }}>
            <div style={{ padding: '38px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, position: 'relative' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--yellow)', letterSpacing: .6 }}>השבוע בפרשת השבוע</span>
              <h3 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.05 }}>{currentParsha ? `פרשת ${currentParsha}` : 'פרשת השבוע'}</h3>
              <p style={{ fontSize: 15, color: '#D8CFC1', maxWidth: '36ch' }}>לא רק ללמד את הפרשה — לקחת ממנה רעיון אחד ולהפוך אותו לפעולה.</p>
              <Link to="/category/activities?domain=פרשת שבוע" className="btn btn-flame" style={{ marginTop: 10, alignSelf: 'flex-start' }}>לכל פעולות פרשת השבוע</Link>
            </div>
            <div style={{ padding: '38px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, position: 'relative' }}>
              {parshaActivities.length > 0 ? (
                parshaActivities.map((a) => (
                  <Link
                    key={a.id}
                    to={`/activity/${a.id}`}
                    className="parsha-row"
                    style={{ padding: '12px 18px', fontSize: 15, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}
                  >
                    <span>{a.title}</span>
                    <span style={{ color: 'var(--ink-soft)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{a.ageLabel}</span>
                  </Link>
                ))
              ) : (
                <p style={{ fontSize: 14.5, color: '#D8CFC1' }}>
                  {currentParsha
                    ? 'עדיין לא הוספנו פעולות לפרשה הזו — כאן תמצאו את כל פעולות פרשת השבוע, וניצוץ יכול לבנות לכם פעולה חדשה.'
                    : 'כאן תמצאו את כל פעולות פרשת השבוע, וניצוץ יכול לבנות לכם פעולה חדשה לכל פרשה.'}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* שורה אחת של אריחים צבעוניים: עוזר AI, כלים לבנייה, צ'ופרים, מנוי, רוני ושליחת פעולה */}
      <div className="wrap" style={{ paddingBottom: 70 }}>
        <Reveal>
          <div className="mini-tiles stagger">
            <Link to="/ai" className="mt" style={{ ['--t' as string]: '#DCEAF2', ['--c' as string]: '#3E7EA6' }}>
              <span className="mt-ic"><MascotIcon size={40} /></span>
              <h3>עוזר AI</h3>
              <b className="mt-sub">שאלו אותו כל דבר — הוא מכיר את המאגר וגם את ההדרכה</b>
              <p>קודם מחפש במאגר הקיים, ואז עונה על כל שאלה — עצה בהדרכה, רעיון לצ׳ופר, או פעולה חדשה לגמרי.</p>
              <span className="mt-go">פתחו את הצ׳אט ←</span>
            </Link>
            <Link to="/how-to-build" className="mt" style={{ ['--t' as string]: '#FBF0CE', ['--c' as string]: '#C99411' }}>
              <span className="mt-ic"><CategoryIcon slug="methods" /></span>
              <h3>רוצים לבנות פעולה בעצמכם?</h3>
              <p>גם אם בא לכם לנסות לבד — יש לכם כלים. "נדבר ת׳כלס" מראה איך מרכיבים פעולה שלב־שלב, ולצידו מאגר מתודות, קטעי קריאה ומשחקים מוכנים לשלוף.</p>
              <span className="mt-go">נדבר ת׳כלס ←</span>
            </Link>
            <Link to="/chuparim" className="mt" style={{ ['--t' as string]: '#F6DDE7', ['--c' as string]: '#C24270' }}>
              <span className="mt-ic"><CategoryIcon slug="chuparim" /></span>
              <h3>רעיונות לצ׳ופרים</h3>
              <span className="mt-go">כל הצ׳ופרים ←</span>
            </Link>
            <div className="mt" style={{ ['--t' as string]: '#E7EFD6', ['--c' as string]: '#5E7F2A' }}>
              <SubscribeBox compact />
            </div>
            <Link to="/about" className="mt" style={{ ['--t' as string]: '#FBE4D2', ['--c' as string]: '#D96A2B' }}>
              <span className="mt-ic"><MascotIcon size={40} /></span>
              <h3>רוני גרוס, מנהלת האתר</h3>
              <p>שמיניסטית, הדרכתי שנתיים שכבת גדולות — ובניתי את המקום שהיה חסר לי.</p>
              <span className="mt-go">הסיפור שלי ←</span>
            </Link>
            <Link to="/submit" className="mt mt-solid" style={{ ['--t' as string]: '#D96A2B', ['--c' as string]: '#7A3712' }}>
              <span className="mt-ic"><CategoryIcon slug="activities" /></span>
              <h3>יש לכם פעולה מטורפת?</h3>
              <p>שתפו אותה, אפשר גם לצרף קובץ — כל הצעה עוברת בדיקת איכות קצרה לפני שהיא מתפרסמת.</p>
              <span className="mt-go">שליחת פעולה ←</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
