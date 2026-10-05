// סינון טקסט פשוט לחיפוש בתוך עמוד: כל המילים בשאילתה צריכות להופיע (עם התחשבות בהטיות — שורש של 4 אותיות).
function norm(s: string): string {
  return s.toLowerCase().replace(/[֑-ׇ]/g, '').replace(/["'׳״.,!?;:()]/g, ' ');
}

export function queryWords(q: string): string[] {
  return norm(q).split(/\s+/).filter((w) => w.length >= 2);
}

export function matchesQuery(parts: (string | string[] | undefined | null)[], q: string): boolean {
  const words = queryWords(q);
  if (words.length === 0) return true;
  const hay = norm(parts.flatMap((p) => (Array.isArray(p) ? p : [p ?? ''])).join(' '));
  return words.every((w) => hay.includes(w) || (w.length >= 4 && hay.includes(w.slice(0, 4))));
}
