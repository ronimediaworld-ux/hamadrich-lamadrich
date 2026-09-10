export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatResult =
  | { ok: true; reply: string }
  | { ok: false; message: string };

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

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResult> {
  // The language model occasionally returns a transient error ("high demand").
  // One automatic retry after a short pause smooths over almost all of them.
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
