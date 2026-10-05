// מועדפים ("הקלסר שלי"): נשמרים בדפדפן. פעולות נשמרות לפי id רגיל (תאימות לאחור), שאר התכנים לפי "סוג:id".
export type FavKind = 'activity' | 'reading' | 'staff-study' | 'chupar';

const STORAGE_KEY = 'hamadrich-favorites';

export function favKey(kind: FavKind, id: string): string {
  return kind === 'activity' ? id : `${kind}:${id}`;
}

export function parseFavKey(key: string): { kind: FavKind; id: string } {
  const m = key.match(/^(reading|staff-study|chupar):(.+)$/);
  return m ? { kind: m[1] as FavKind, id: m[2] } : { kind: 'activity', id: key };
}

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('favorites-changed'));
  } catch {
    // localStorage unavailable — favorites just won't persist this session
  }
}

export function getFavoriteIds(): string[] {
  return readIds();
}

// key: מזהה פעולה רגיל, או favKey(kind, id)
export function isFavorite(key: string): boolean {
  return readIds().includes(key);
}

export function toggleFavorite(key: string): boolean {
  const ids = readIds();
  const idx = ids.indexOf(key);
  if (idx === -1) {
    ids.push(key);
    writeIds(ids);
    return true;
  }
  ids.splice(idx, 1);
  writeIds(ids);
  return false;
}
