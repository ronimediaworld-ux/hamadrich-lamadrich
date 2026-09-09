import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ActivityCard } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';
import { SearchIcon } from '../components/Icons';
import { searchActivities } from '../lib/search';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') ?? '';
  const [q, setQ] = useState(initialQuery);
  useDocumentTitle(initialQuery ? `תוצאות עבור "${initialQuery}"` : 'חיפוש');

  const results = searchActivities(initialQuery, 12);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>תוצאות חיפוש</h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 24 }}>
          {initialQuery ? <>עבור "{initialQuery}" — {results.length} תוצאות</> : 'הקלידו מה אתם מחפשים'}
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

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
            {initialQuery ? 'לא מצאנו פעולה שמתאימה בדיוק — נסו לנסח אחרת, או תנו לניצוץ ליצור אחת חדשה.' : 'הקלידו חיפוש למעלה כדי להתחיל.'}
          </p>
          <Link to="/ai" className="btn btn-flame">עזרה מעוזר ה-AI</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {results.map((a, i) => (
            <Reveal key={a.id} delay={(i % 6) * 40}>
              <ActivityCard activity={a} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
