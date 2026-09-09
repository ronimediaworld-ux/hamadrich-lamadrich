export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatResult =
  | { ok: true; reply: string }
  | { ok: false; message: string };

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResult> {
  try {
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
  } catch {
    return { ok: false, message: 'לא הצלחנו להתחבר לשרת. ודאו שהשרת רץ (npm run dev:full) ונסו שוב.' };
  }
}
