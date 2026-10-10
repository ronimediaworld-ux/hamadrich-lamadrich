import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ActivityCard } from '../components/ActivityCard';
import { MascotIcon } from '../components/TeenAvatar';
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

const recommendedIds = ['circle-of-friendship', 'faith-in-hard-times', 'noach-one-persons-power', 'lonely-island-game', 'white-night-outdoors'];

const catColorBg: Record<string, string> = {
  flame: 'var(--flame)',
  lime: 'var(--lime)',
  magenta: 'var(--magenta)',
  sky: 'var(--sky)',
  yellow: 'var(--yellow)',
};

export function Home() {
  const [q, setQ] = useState('');
  const [rolling, setRolling] = useState<string | null>(null);
  const rollRef = useRef<number | null>(null);
  const navigate = useNavigate();
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <MascotIcon size={52} />
            <span style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 'clamp(24px, 3.2vw, 32px)', letterSpacing: -0.3 }}>
              המדריך למדריך
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 66px)', fontWeight: 900, lineHeight: 1.06, marginBottom: 18 }}>
            מה אתם צריכים<br />להעביר היום?
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p style={{ maxWidth: 560, margin: '0 auto 30px', fontSize: 17.5, color: 'var(--ink-soft)' }}>
            מאגר פעולות איכותי, בנוי שלב־שלב ומוכן להעברה. בוחרים, מדפיסים — ועולים לפעולה בביטחון.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, maxWidth: 600, margin: '0 auto', background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 999, padding: '8px 8px 8px 20px' }}>
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
            {shortcuts.map((s) => (
              <button key={s} className="chip" onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}>{s}</button>
            ))}
            <button className="chip" style={{ background: 'var(--yellow-tint)' }} onClick={surprise} aria-live="polite">
              {rolling ? <span key={rolling} className="roll-title">{rolling}</span> : 'הפתיעו אותי'}
            </button>
          </div>
        </Reveal>

        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--ink-faint)', fontSize: 12 }}>
          גללו
          <ChevronDownIcon size={18} />
        </div>
      </div>

      {/* STATS */}
      <div className="wrap" style={{ paddingBottom: 44 }}>
        <Reveal>
          <div className="stat-strip">
            {[
              ['פעולות ומערכים', activities.length],
              ['קטעי קריאה', readings.length],
              ['רעיונות לצ׳ופרים', chuparim.length],
              ['סיטואציות בהדרכה', situations.length],
              ['מפגשי לימוד צוות', staffStudy.length],
            ].map(([label, n]) => (
              <div key={String(label)} className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--flame-ink)', lineHeight: 1.1 }}><CountUp to={Number(n)} /></div>
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
          <section aria-labelledby="home-build" style={{ border: '2px solid var(--ink)', borderRadius: 20, padding: '22px 26px', background: 'var(--paper)', boxShadow: '6px 6px 0 rgba(36,28,17,.12)' }}>
            <h2 id="home-build" style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>רוצות לבנות פעולה משלכן? מאפס, בשיטה שלי</h2>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 14px', lineHeight: 1.75, maxWidth: '62ch' }}>
              שבעה חלקים בסדר קבוע, כל אחד בצבע משלו, ובסוף צ׳ופר כבונוס. ממלאות תבנית אישית, שומרות בדפדפן ומדפיסות.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[...SEVEN_PARTS, SEVEN_BONUS].map((p) => (
                <span key={p.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px 3px 6px', borderRadius: 99, background: p.tint, border: `1.5px solid ${p.color}`, fontSize: 13.5, fontWeight: 700 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: p.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{p.n === 8 ? '+' : p.n}</span>
                  {p.name}
                </span>
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
          <div className="home-cats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="tile"
                style={{
                  background: catColorBg[c.color],
                  color: c.color === 'yellow' ? '#4A3A0A' : '#FFF8EE',
                  border: '2px solid var(--ink)',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 17 }}>{c.label}</div>
                  <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>{c.description}</div>
                </div>
              </Link>
            ))}
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
          <div className="scrollrow wrap" style={{ paddingTop: 6, paddingBottom: 10 }}>
            {recommended.map((a, i) => (
              <ActivityCard key={a.id} activity={a} rotate={[-2, 1.5, -1, 2, -2.5][i % 5]} />
            ))}
          </div>
        </Reveal>
      </div>

      {/* PARSHA MODULE */}
      <div className="wrap" style={{ paddingBottom: 50 }}>
        <Reveal>
          <div className="home-split" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 0, background: 'var(--magenta-tint)', border: '1px solid var(--magenta)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '34px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--magenta-ink)' }}>השבוע בפרשת השבוע</span>
              <h3 style={{ fontSize: 26, fontWeight: 800 }}>{currentParsha ? `פרשת ${currentParsha}` : 'פרשת השבוע'}</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: '36ch' }}>לא רק ללמד את הפרשה — לקחת ממנה רעיון אחד ולהפוך אותו לפעולה.</p>
              <Link to="/category/activities?domain=פרשת שבוע" className="btn btn-outline" style={{ marginTop: 8, alignSelf: 'flex-start' }}>לכל פעולות פרשת השבוע</Link>
            </div>
            <div style={{ padding: '34px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              {parshaActivities.length > 0 ? (
                parshaActivities.map((a) => (
                  <Link
                    key={a.id}
                    to={`/activity/${a.id}`}
                    style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--paper)', border: '1px solid var(--magenta)', fontSize: 13.5, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}
                  >
                    <span>{a.title}</span>
                    <span style={{ color: 'var(--ink-faint)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{a.ageLabel}</span>
                  </Link>
                ))
              ) : (
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                  {currentParsha
                    ? 'עדיין לא הוספנו פעולות לפרשה הזו — כאן תמצאו את כל פעולות פרשת השבוע, וניצוץ יכול לבנות לכם פעולה חדשה.'
                    : 'כאן תמצאו את כל פעולות פרשת השבוע, וניצוץ יכול לבנות לכם פעולה חדשה לכל פרשה.'}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* AI TEASER */}
      <div className="wrap" style={{ paddingBottom: 50 }}>
        <Reveal>
          <div className="home-split home-ai" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 40, alignItems: 'center', background: '#241C11', color: '#F3ECDD', borderRadius: 24, padding: 46 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
                עוזר AI
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>שאלו אותו כל דבר — הוא מכיר את המאגר וגם את ההדרכה</h2>
              <p style={{ fontSize: 14.5, color: '#CBBFA6', marginBottom: 22, maxWidth: '42ch' }}>קודם מחפש במאגר הקיים, ואז עונה על כל שאלה — עצה בהדרכה, רעיון לצ׳ופר, או פעולה חדשה לגמרי.</p>
              <Link to="/ai" className="btn btn-flame">פתחו את הצ׳אט</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: '#3A2E1C', borderRadius: '14px 14px 4px 14px', padding: '13px 16px', fontSize: 14 }}>
                פעולה אמונית לכיתה ח׳ לשבת
              </div>
              <div style={{ alignSelf: 'flex-start', maxWidth: '88%', background: '#F3ECDD', color: '#241C11', borderRadius: '14px 14px 14px 4px', padding: '15px 18px' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>מצאתי 2 פעולות מהמאגר שמתאימות:</div>
                <div style={{ fontSize: 13.5, color: '#5B4E3C' }}>אמונה בזמן קושי · מעגל של תודה</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* BUILD YOUR OWN */}
      <div className="wrap" style={{ paddingBottom: 50 }}>
        <Reveal>
          <div
            className="home-split"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              background: 'var(--sky-tint)',
              border: '1px solid var(--sky)',
              borderRadius: 18,
              padding: '28px 34px',
            }}
          >
            <div>
              <h2 style={{ fontSize: 23, fontWeight: 800, marginBottom: 6 }}>רוצים לבנות פעולה בעצמכם?</h2>
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', maxWidth: '54ch' }}>
                גם אם בא לכם לנסות לבד — יש לכם כלים. "נדבר ת׳כלס" מראה איך מרכיבים פעולה שלב־שלב,
                ולצידו מאגר מתודות, קטעי קריאה ומשחקים מוכנים לשלוף.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/how-to-build" className="btn btn-flame">נדבר ת׳כלס</Link>
              <Link to="/category/methods" className="btn btn-outline">מתודות</Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* CHUPARIM */}
      <div style={{ paddingBottom: 50 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>רעיונות לצ׳ופרים</h2>
              <Link to="/chuparim" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-faint)' }}>כל הצ׳ופרים ←</Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* SUBSCRIBE */}
      <div className="wrap" style={{ paddingBottom: 40 }}>
        <Reveal><SubscribeBox /></Reveal>
      </div>

      {/* THE MANAGER */}
      <div className="wrap" style={{ paddingBottom: 40 }}>
        <Reveal>
          <Link to="/about" className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 'none', width: 56, height: 56, borderRadius: '50%', background: 'var(--flame-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MascotIcon size={38} />
            </div>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18 }}>רוני גרוס, מנהלת האתר</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>שמיניסטית, הדרכתי שנתיים שכבת גדולות — ובניתי את המקום שהיה חסר לי.</div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--flame-ink)' }}>הסיפור שלי ←</span>
          </Link>
        </Reveal>
      </div>

      {/* CTA */}
      <div className="wrap" style={{ paddingBottom: 70 }}>
        <Reveal>
          <div className="cta-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, background: 'linear-gradient(135deg, var(--flame), var(--magenta))', border: '2px solid var(--ink)', borderRadius: 24, color: '#FFF6EC' }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>יש לכם פעולה מטורפת?</h3>
              <p style={{ fontSize: 14.5, opacity: 0.92 }}>שתפו אותה, אפשר גם לצרף קובץ — כל הצעה עוברת בדיקת איכות קצרה לפני שהיא מתפרסמת.</p>
            </div>
            <Link to="/submit" className="btn" style={{ background: '#FFF6EC', color: '#241C11', flex: 'none' }}>שליחת פעולה</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
