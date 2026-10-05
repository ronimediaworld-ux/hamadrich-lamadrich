import { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ActivityCard } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';
import { SearchIcon } from '../components/Icons';
import { searchSite } from '../lib/siteSearch';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') ?? '';
  const [q, setQ] = useState(initialQuery);
  useDocumentTitle(initialQuery ? `תוצאות עבור "${initialQuery}"` : 'חיפוש');

  const { activities, others } = useMemo(() => searchSite(initialQuery), [initialQuery]);
  const total = activities.length + others.length;

  const groups = useMemo(() => {
    const m = new Map<string, typeof others>();
    others.forEach((h) => m.set(h.group, [...(m.get(h.group) ?? []), h]));
    return [...m.entries()];
  }, [others]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>חיפוש בכל האתר</h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 24 }}>
          {initialQuery ? <>עבור "{initialQuery}" — {total} תוצאות</> : 'פעולות, משחקים, קטעי קריאה, צ׳ופרים, לימוד צוות, מתודות ועוד — הכול בחיפוש אחד'}
        </p>
      </Reveal>

      <Reveal delay={40}>
        <form onSubmit={onSearch} style={{ display: 'flex', gap: 10, maxWidth: 560, marginBottom: 32, background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 999, padding: '8px 8px 8px 20px' }}>
          <SearchIcon size={18} color="var(--ink-soft)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="לדוגמה: פעולה אמונית לכיתה ח' לשבת"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 15 }}
          />
          <button type="submit" className="btn btn-flame">חיפוש</button>
        </form>
      </Reveal>

      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
            {initialQuery ? 'לא מצאנו משהו שמתאים בדיוק — נסו לנסח אחרת, או תנו לניצוץ לעזור.' : 'הקלידו חיפוש למעלה כדי להתחיל.'}
          </p>
          <Link to="/ai" className="btn btn-flame">עזרה מעוזר ה-AI</Link>
        </div>
      ) : (
        <>
          {activities.length > 0 && (
            <>
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>פעולות <span style={{ color: 'var(--ink-faint)', fontWeight: 600, fontSize: 14 }}>({activities.length})</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18, marginBottom: 36 }}>
                {activities.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 6) * 40}>
                    <ActivityCard activity={a} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
          {groups.map(([group, hits]) => (
            <div key={group} style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 12 }}>{group} <span style={{ color: 'var(--ink-faint)', fontWeight: 600, fontSize: 14 }}>({hits.length})</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {hits.map((h) => (
                  <Link key={h.url + h.title} to={h.url} className="card" style={{ display: 'block', padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, fontFamily: 'Rubik, sans-serif' }}>{h.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{h.snippet}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
