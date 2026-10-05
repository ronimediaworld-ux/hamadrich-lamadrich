import { useEffect, useState } from 'react';
import { HeartIcon } from './Icons';
import { favKey, isFavorite, toggleFavorite, type FavKind } from '../lib/favorites';
import { burst } from '../lib/effects';

// כפתור "שמירה בקלסר" לכל סוג תוכן.
export function FavoriteButton({ kind, id, style }: { kind: FavKind; id: string; style?: React.CSSProperties }) {
  const key = favKey(kind, id);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isFavorite(key));
    const on = () => setSaved(isFavorite(key));
    window.addEventListener('favorites-changed', on);
    return () => window.removeEventListener('favorites-changed', on);
  }, [key]);

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const now = toggleFavorite(key);
    setSaved(now);
    if (now) burst(e.currentTarget);
  }

  return (
    <button
      type="button"
      className="btn btn-outline no-print"
      onClick={onClick}
      aria-pressed={saved}
      style={{ justifyContent: 'center', background: saved ? 'var(--flame-tint)' : undefined, borderColor: saved ? 'var(--flame)' : undefined, ...style }}
    >
      <HeartIcon size={15} color={saved ? 'var(--flame)' : 'currentColor'} />
      {saved ? 'נשמר בקלסר שלי' : 'שמירה בקלסר שלי'}
    </button>
  );
}
