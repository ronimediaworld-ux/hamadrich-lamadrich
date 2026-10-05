// קריאות לשרת של האתר (צפיות, כניסות, תגובות, הצעות). אם אין שרת (תצוגה סטטית) — הכול נכשל בשקט והאתר ממשיך לעבוד.

export type ViewKind = 'activity' | 'reading' | 'chupar' | 'staff-study' | 'situation' | 'method';

async function postJson<T>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    let data: T | null = null;
    try { data = (await res.json()) as T; } catch { /* no body */ }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

// צפייה: נספרת פעם אחת לדפדפן לכל תוכן בכל ביקור (sessionStorage) — והשרת מוסיף הגבלה משלו.
export async function trackView(kind: ViewKind, id: string): Promise<number | null> {
  try {
    const key = `viewed:${kind}:${id}`;
    if (sessionStorage.getItem(key)) return getViews(kind, id);
    sessionStorage.setItem(key, '1');
  } catch { /* sessionStorage לא זמין */ }
  const r = await postJson<{ count: number }>('/api/track', { kind, id });
  return r.ok && r.data ? r.data.count : null;
}

export async function getViews(kind: ViewKind, id: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/views/${kind}/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

// כניסה לאתר — פעם ביום לכל דפדפן. לא מוצג לגולשים; רק המנהלת רואה בדשבורד.
export function trackVisit() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('hlm-visit') === today) return;
    localStorage.setItem('hlm-visit', today);
  } catch { /* ממשיכים בכל זאת */ }
  void postJson('/api/visit', {});
}

export interface PublicComment { id: string; name: string; text: string; createdAt: number }

export async function fetchComments(kind: ViewKind, id: string): Promise<PublicComment[] | null> {
  try {
    const res = await fetch(`/api/comments/${kind}/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return ((await res.json()) as { comments: PublicComment[] }).comments;
  } catch {
    return null;
  }
}

export async function postComment(kind: ViewKind, targetId: string, name: string, text: string, website = ''): Promise<{ ok: boolean; message?: string }> {
  const r = await postJson<{ message?: string }>('/api/comments', { kind, targetId, name, text, website });
  if (r.ok) return { ok: true };
  return { ok: false, message: r.data?.message || 'לא הצלחנו לשלוח את התגובה כרגע — נסו שוב.' };
}

export interface SubmissionPayload {
  name: string; contact: string; title: string; body: string; website?: string;
  file?: { name: string; type: string; data: string };
}

export async function postSubmission(p: SubmissionPayload): Promise<{ ok: boolean; message?: string }> {
  const r = await postJson<{ message?: string }>('/api/submissions', p);
  if (r.ok) return { ok: true };
  return { ok: false, message: r.data?.message || (r.status === 0 ? 'אין חיבור לשרת כרגע.' : 'לא הצלחנו לשלוח — נסו שוב.') };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
