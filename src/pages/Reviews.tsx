import { useState, useEffect } from 'react';
import { MascotIcon } from '../components/TeenAvatar';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const REVIEWS_EMAIL = 'ronimediaworldd@gmail.com';
const STORAGE_KEY = 'hamadrich-reviews';

interface Review {
  id: string;
  name: string;
  stars: number;
  text: string;
  createdAt: number;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'seed-1',
    name: 'מדריכה, שבט נחשון',
    stars: 5,
    text: 'הכנתי פעולת פרשת שבוע תוך רבע שעה. הכול מסודר לפי שלבים, וגם הצ׳ופר מוכן. חוסך המון זמן בערב שישי.',
    createdAt: Date.parse('2026-08-20'),
  },
  {
    id: 'seed-2',
    name: 'רכז שכבה',
    stars: 5,
    text: 'החלק של המשחקים המהירים פשוט זהב. תמיד יש לי משהו ביד כשצריך למלא חמש דקות.',
    createdAt: Date.parse('2026-08-28'),
  },
  {
    id: 'seed-3',
    name: 'מדריך שנה ראשונה',
    stars: 4,
    text: 'עזר לי מאוד בהתחלה כשלא ידעתי איך בונים מערך. הייתי שמח לעוד פעולות לגילאים הצעירים.',
    createdAt: Date.parse('2026-09-02'),
  },
];

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && typeof r.text === 'string');
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    /* אחסון חסום — לא נורא, ההמלצה פשוט לא תישמר במכשיר */
  }
}

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={onChange ? 'button' : undefined}
          onClick={onChange ? () => onChange(n) : undefined}
          aria-label={`${n} כוכבים`}
          disabled={!onChange}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: onChange ? 30 : 18,
            lineHeight: 1,
            cursor: onChange ? 'pointer' : 'default',
            color: n <= value ? 'var(--yellow)' : 'var(--line-strong)',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function Reviews() {
  useDocumentTitle('דירוג והמלצות');
  const [name, setName] = useState('');
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const [mine, setMine] = useState<Review[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setMine(loadReviews());
  }, []);

  const all = [...mine, ...SEED_REVIEWS].sort((a, b) => b.createdAt - a.createdAt);
  const avg = all.length ? all.reduce((s, r) => s + r.stars, 0) / all.length : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const review: Review = {
      id: `r-${Date.now()}`,
      name: name.trim() || 'מדריך/ה',
      stars,
      text: text.trim(),
      createdAt: Date.now(),
    };
    const next = [review, ...mine];
    setMine(next);
    saveReviews(next);
    setSent(true);
    setText('');
    setName('');
    setStars(5);

    const body = [
      `דירוג: ${review.stars} מתוך 5`,
      `שם: ${review.name}`,
      '',
      review.text,
    ].join('\n');
    const href = `mailto:${REVIEWS_EMAIL}?subject=${encodeURIComponent('המלצה על האתר — המדריך למדריך')}&body=${encodeURIComponent(body)}`;
    window.open(href, '_blank');
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70, maxWidth: 640 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <MascotIcon size={44} />
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>דירוג והמלצות</h1>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-faint)', marginBottom: 20 }}>
          השתמשתם באתר? ספרו לנו איך היה. הדירוג עוזר למדריכים אחרים לדעת למה לצפות, וההמלצה שלכם נשלחת גם אליי במייל.
        </p>
      </Reveal>

      <Reveal delay={30}>
        <div
          className="card"
          style={{ padding: '18px 22px', marginBottom: 26, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <span style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Rubik, sans-serif' }}>
            {avg.toFixed(1)}
          </span>
          <div>
            <Stars value={Math.round(avg)} />
            <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4 }}>
              מבוסס על {all.length} המלצות
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={50}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, fontWeight: 700 }}>
            הדירוג שלך
            <Stars value={stars} onChange={setStars} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
            שם או תפקיד (לא חובה)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: מדריכה, שבט להב"
              style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5, fontWeight: 700 }}>
            ההמלצה שלך
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="מה עזר לך? מה היית משנה?"
              rows={5}
              required
              style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid var(--ink)', fontFamily: 'Heebo, sans-serif', fontSize: 14.5, outline: 'none', resize: 'vertical' }}
            />
          </label>

          <button type="submit" className="btn btn-flame" style={{ alignSelf: 'flex-start' }}>
            פרסום ושליחה
          </button>

          {sent && (
            <p style={{ fontSize: 13, color: 'var(--lime-ink)', fontWeight: 700 }}>
              תודה! ההמלצה נוספה לרשימה למטה ונפתחה הודעת מייל מוכנה לשליחה אליי.
            </p>
          )}
        </form>
      </Reveal>

      <Reveal delay={70}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>מה מדריכים כותבים</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {all.map((r) => (
            <div key={r.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                <Stars value={r.stars} />
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: 0, whiteSpace: 'pre-line' }}>{r.text}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 16 }}>
          ההמלצות שכתבת נשמרות במכשיר שלך ונשלחות אליי במייל. אפשר גם לפנות ישירות:{' '}
          <a href={`mailto:${REVIEWS_EMAIL}`} style={{ textDecoration: 'underline', fontWeight: 700 }}>
            {REVIEWS_EMAIL}
          </a>
        </p>
      </Reveal>
    </div>
  );
}
