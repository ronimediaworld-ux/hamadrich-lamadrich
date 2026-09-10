// היסטוריית שיחות עם עוזר ה-AI — נשמרת בדפדפן של המשתמש (localStorage).
// פרטית לדפדפן הזה, שורדת ריענון, לא מגיעה לשרת.

export interface StoredEntry {
  role: 'user' | 'assistant';
  content: string;
  matchIds?: string[];
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  entries: StoredEntry[];
}

const KEY = 'hamadrich-chats';
const MAX_CONVERSATIONS = 40;

function safeRead(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c) => c && typeof c.id === 'string' && Array.isArray(c.entries));
  } catch {
    return [];
  }
}

function safeWrite(list: Conversation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_CONVERSATIONS)));
  } catch {
    /* storage full / blocked — history just won't persist */
  }
}

export function listConversations(): Conversation[] {
  return safeRead().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getConversation(id: string): Conversation | undefined {
  return safeRead().find((c) => c.id === id);
}

export function newConversationId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function titleFrom(entries: StoredEntry[]): string {
  const firstUser = entries.find((e) => e.role === 'user' && !e.isError);
  const t = (firstUser?.content ?? '').trim().replace(/\s+/g, ' ');
  if (!t) return 'שיחה חדשה';
  return t.length > 42 ? t.slice(0, 42) + '…' : t;
}

/** Insert or update a conversation. Returns the saved record. */
export function saveConversation(id: string, entries: StoredEntry[]): Conversation {
  const list = safeRead();
  const now = Date.now();
  const idx = list.findIndex((c) => c.id === id);
  const record: Conversation =
    idx >= 0
      ? { ...list[idx], entries, title: titleFrom(entries), updatedAt: now }
      : { id, entries, title: titleFrom(entries), createdAt: now, updatedAt: now };
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  safeWrite(list);
  return record;
}

export function deleteConversation(id: string) {
  safeWrite(safeRead().filter((c) => c.id !== id));
}

export function clearAllConversations() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'עכשיו';
  if (min < 60) return `לפני ${min} דק׳`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `לפני ${hr} שע׳`;
  const day = Math.round(hr / 24);
  if (day < 7) return `לפני ${day} ימים`;
  return new Date(ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
}
