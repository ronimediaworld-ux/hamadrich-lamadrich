export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatResult =
  | { ok: true; reply: string }
  | { ok: false; message: string };

const CHAT_SYSTEM_PROMPT = `אתה "ניצוץ" — עוזר AI חם, בקיא ומועיל באתר "המדריך למדריך", אתר למדריכות ומדריכים בתנועות נוער.
ענה על כל שאלה שמדריך/ה עשוי/ה לשאול — לא רק יצירת פעולות: עצות הדרכה, התמודדות עם חניכים, רעיונות לצ׳ופרים, שאלות כלליות, או סתם שיחה.
כשמבקשים במפורש ליצור פעולה חדשה, בנה אותה במבנה מלא: מטרות, פתיחה, משחק/מתודה, דיון, הסבר למדריך, סיכום וטיפ.
כתוב תמיד בעברית, בטון חם וישיר, בלי להאריך יתר על המידה.`;

// ----- path A: the published-artifact demo has no backend; use claude.use("sample") -----

interface ClaudeSample {
  (input: unknown, opts?: Record<string, unknown>): Promise<{ text: string; truncated?: boolean }>;
}
interface ClaudeGlobal {
  use?: (name: string) => Promise<unknown>;
}

async function trySampleCapability(messages: ChatMessage[]): Promise<ChatResult | null> {
  const claude = (window as unknown as { claude?: ClaudeGlobal }).claude;
  if (!claude || typeof claude.use !== 'function') return null;

  let sample: ClaudeSample | null = null;
  try {
    sample = (await claude.use('sample')) as ClaudeSample | null;
  } catch {
    return null;
  }
  if (typeof sample !== 'function') return null;

  const input = [{ role: 'user', content: CHAT_SYSTEM_PROMPT }, ...messages];
  try {
    const { text } = await sample(input, { cache: false });
    if (!text || !text.trim()) return { ok: false, message: 'התקבלה תשובה ריקה. נסו לנסח מחדש.' };
    return { ok: true, reply: text };
  } catch (e) {
    const code = (e as { code?: string })?.code;
    const partial = (e as { text?: string })?.text;
    if (partial && partial.trim()) return { ok: true, reply: partial };
    if (code === 'not_granted') {
      return { ok: false, message: 'כדי להשתמש בעוזר בגרסת התצוגה צריך לאשר את הבקשה (השימוש נזקף לחשבון שלך). נסו שוב ואשרו.' };
    }
    if (code === 'rate_limited') {
      return { ok: false, message: 'יותר מדי בקשות ברצף. המתינו רגע ונסו שוב.' };
    }
    return { ok: false, message: 'לא הצלחנו לקבל תשובה כרגע. נסו שוב בעוד רגע.' };
  }
}

// ----- path B: local dev / real deployment — the Express server at /api/chat -----

async function attemptChat(messages: ChatMessage[]): Promise<ChatResult> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { ok: false, message: data?.message ?? 'לא הצלחנו לקבל תשובה כרגע. נסו שוב.' };
  }
  if (!data?.reply) {
    return { ok: false, message: 'התקבלה תשובה ריקה. נסו לנסח מחדש.' };
  }
  return { ok: true, reply: data.reply as string };
}

async function serverChat(messages: ChatMessage[]): Promise<ChatResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await attemptChat(messages);
      if (result.ok || attempt === 1) return result;
    } catch {
      if (attempt === 1) {
        return { ok: false, message: 'לא הצלחנו להתחבר לשרת. ודאו שהשרת רץ (npm run dev:full) ונסו שוב.' };
      }
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  return { ok: false, message: 'לא הצלחנו לקבל תשובה כרגע. נסו שוב בעוד רגע.' };
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResult> {
  // In the published-artifact demo there is no server — ask Claude via the runtime capability.
  const viaSample = await trySampleCapability(messages);
  if (viaSample) return viaSample;

  // Otherwise talk to the project's own server.
  return serverChat(messages);
}
