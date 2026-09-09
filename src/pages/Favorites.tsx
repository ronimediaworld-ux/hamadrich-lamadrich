import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivityCard } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';
import { HeartIcon } from '../components/Icons';
import { getFavoriteIds } from '../lib/favorites';
import { activities } from '../data/activities';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function Favorites() {
  useDocumentTitle('הפעולות שלי');
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getFavoriteIds());
    function onChange() {
      setIds(getFavoriteIds());
    }
    window.addEventListener('favorites-changed', onChange);
    return () => window.removeEventListener('favorites-changed', onChange);
  }, []);

  const favorited = activities.filter((a) => ids.includes(a.id));

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>הפעולות שלי</h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 28 }}>
          {favorited.length > 0 ? `${favorited.length} פעולות שמורות — נשמר רק בדפדפן הזה` : 'עדיין לא שמרתם כלום'}
        </p>
      </Reveal>

      {favorited.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <HeartIcon size={40} color="var(--line-strong)" />
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', margin: '18px 0' }}>
            לחצו על "שמירה למועדפים" בתוך כל פעולה כדי לאסוף אותה כאן.
          </p>
          <Link to="/category/activities" className="btn btn-flame">למאגר הפעולות</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {favorited.map((a, i) => (
            <Reveal key={a.id} delay={(i % 6) * 40}>
              <ActivityCard activity={a} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
