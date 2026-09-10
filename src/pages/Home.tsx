import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ActivityCard } from '../components/ActivityCard';
import { MascotIcon } from '../components/TeenAvatar';
import { SearchIcon, ChevronDownIcon } from '../components/Icons';
import { categories } from '../data/categories';
import { activities } from '../data/activities';

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
  const navigate = useNavigate();
  const recommended = recommendedIds.map((id) => activities.find((a) => a.id === id)!).filter(Boolean);

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
            מאגר פעולות אמיתי, עוזר AI שמחפש קודם במאגר, ורעיונות לצ׳ופרים — הכל במקום אחד.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, maxWidth: 600, margin: '0 auto', background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 999, padding: '8px 8px 8px 20px' }}>
            <SearchIcon size={18} color="var(--ink-soft)" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="לדוגמה: פעולה אמונית לכיתה ח' לשבת"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 15.5 }}
            />
            <button type="submit" className="btn btn-flame">חיפוש</button>
          </form>
        </Reveal>

        <Reveal delay={170}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 999, padding: '6px 18px 6px 8px', marginTop: 22 }}>
            <MascotIcon size={32} />
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>היי, אני ניצוץ — אלווה אתכם למצוא את הפעולה הנכונה</span>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9, marginTop: 20 }}>
            {shortcuts.map((s) => (
              <button key={s} className="chip" onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}>{s}</button>
            ))}
          </div>
        </Reveal>

        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--ink-faint)', fontSize: 12 }}>
          גללו
          <ChevronDownIcon size={18} />
        </div>
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
              <h3 style={{ fontSize: 26, fontWeight: 800 }}>פרשת נח</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: '36ch' }}>לא רק ללמד את הפרשה — לקחת ממנה רעיון אחד ולהפוך אותו לפעולה.</p>
              <Link to="/category/activities?domain=פרשת שבוע" className="btn btn-outline" style={{ marginTop: 8, alignSelf: 'flex-start' }}>לכל פעולות הפרשה</Link>
            </div>
            <div style={{ padding: '34px 36px', display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: 8 }}>
              {['אחריות אישית', 'השפעה של הסביבה', 'להיות שונה מהחברה', 'בניית עולם מחדש', 'כוחו של אדם אחד'].map((t) => (
                <button
                  key={t}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                  style={{ padding: '8px 14px', borderRadius: 10, background: 'var(--paper)', border: '1px solid var(--magenta)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  {t}
                </button>
              ))}
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
