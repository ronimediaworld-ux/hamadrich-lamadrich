const STORAGE_KEY = 'hamadrich-favorites';

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

export function isFavorite(id: string): boolean {
  return readIds().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const ids = readIds();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
    writeIds(ids);
    return true;
  }
  ids.splice(idx, 1);
  writeIds(ids);
  return false;
}
