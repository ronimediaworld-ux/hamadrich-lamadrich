import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MascotIcon } from '../components/TeenAvatar';
import { ActivityCard } from '../components/ActivityCard';
import { CopyButton } from '../components/CopyButton';
import { searchActivities } from '../lib/search';
import { sendChatMessage, type ChatMessage } from '../lib/aiChat';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getActivity } from '../data/activities';
import { FAQ, findFaq } from '../data/faq';
import {
  listConversations,
  getConversation,
  saveConversation,
  deleteConversation,
  newConversationId,
  relativeTime,
  type Conversation,
  type StoredEntry,
} from '../lib/chatHistory';
import type { Activity } from '../data/types';

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
  matches?: Activity[];
  isError?: boolean;
  faqId?: string;
}

const suggestions = ['פעולה על חברות לכיתה ז׳', 'איך מתמודדים עם חניך שמפריע?', 'רעיון לצ׳ופר זול וטוב', 'משהו בלי ציוד ל-20 דקות'];

function toStored(entries: ChatEntry[]): StoredEntry[] {
  return entries.map((e) => ({
    role: e.role,
    content: e.content,
    isError: e.isError,
    matchIds: e.matches?.map((m) => m.id),
    faqId: e.faqId,
  }));
}

function fromStored(entries: StoredEntry[]): ChatEntry[] {
  return entries.map((e) => ({
    role: e.role,
    content: e.content,
    isError: e.isError,
    faqId: e.faqId,
    matches: e.matchIds?.map((id) => getActivity(id)).filter((a): a is Activity => Boolean(a)),
  }));
}

export function AIAssistant() {
  useDocumentTitle('עוזר AI');
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string>(() => newConversationId());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    setConversations(listConversations());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, loading]);

  function persist(next: ChatEntry[]) {
    if (next.length === 0) return;
    saveConversation(convId, toStored(next));
    setConversations(listConversations());
  }

  function startNewChat() {
    setEntries([]);
    setConvId(newConversationId());
    setInput('');
    setHistoryOpen(false);
  }

  function openChat(id: string) {
    const c = getConversation(id);
    if (!c) return;
    setEntries(fromStored(c.entries));
    setConvId(c.id);
    setHistoryOpen(false);
  }

  function removeChat(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteConversation(id);
    const rest = listConversations();
    setConversations(rest);
    if (id === convId) startNewChat();
  }

  async function handleSend(e: React.FormEvent, forceAi = false, override?: string) {
    e.preventDefault();
    const text = (override ?? input).trim();
    if (!text || sendingRef.current) return;

    // שאלה נפוצה — עונים מיד מהמאגר, בלי AI. רק שאלה אחרת (או "שאלו את ה-AI") עוברת ל-AI.
    const faq = forceAi ? null : findFaq(text);
    if (faq) {
      const done: ChatEntry[] = [...entries, { role: 'user', content: text }, { role: 'assistant', content: faq.answer(), faqId: faq.id }];
      setEntries(done);
      setInput('');
      persist(done);
      return;
    }

    sendingRef.current = true;

    const userEntry: ChatEntry = { role: 'user', content: text };
    const matches = searchActivities(text, 3);
    const historyForApi: ChatMessage[] = [...entries, userEntry]
      .filter((en) => !en.isError)
      .map((en) => ({ role: en.role, content: en.content }));

    let working: ChatEntry[] = [...entries, userEntry];
    if (matches.length > 0) {
      working = [...working, { role: 'assistant', content: 'לפני הכל, מצאתי כמה פעולות מהמאגר שרלוונטיות:', matches }];
    }
    setEntries(working);
    setInput('');
    setLoading(true);
    persist(working);

    try {
      const result = await sendChatMessage(historyForApi);
      const replyEntry: ChatEntry = result.ok
        ? { role: 'assistant', content: result.reply }
        : { role: 'assistant', content: result.message, isError: true };
      const done = [...working, replyEntry];
      setEntries(done);
      persist(done);
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  }

  const hasHistory = conversations.length > 0;
  const activeExists = useMemo(() => conversations.some((c) => c.id === convId), [conversations, convId]);

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 24, maxWidth: 760, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <MascotIcon size={40} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>עוזר AI — ניצוץ</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>שאלו אותי כל דבר — הדרכה, רעיונות, צ׳ופרים, או בקשו פעולה חדשה</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
          {hasHistory && (
            <button
              className="chip"
              onClick={() => setHistoryOpen((v) => !v)}
              style={{ fontSize: 13 }}
            >
              היסטוריה ({conversations.length})
            </button>
          )}
          {(entries.length > 0 || activeExists) && (
            <button className="chip" onClick={startNewChat} style={{ fontSize: 13 }}>שיחה חדשה +</button>
          )}
        </div>
      </div>

      {historyOpen && (
        <div className="card" style={{ padding: 10, marginBottom: 14, maxHeight: 260, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ink-faint)', padding: 8 }}>אין עדיין שיחות שמורות.</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openChat(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, cursor: 'pointer',
                  background: c.id === convId ? 'var(--flame-tint)' : 'transparent',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{relativeTime(c.updatedAt)}</div>
                </div>
                <button
                  onClick={(e) => removeChat(c.id, e)}
                  aria-label="מחיקת שיחה"
                  style={{ flex: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 15, color: 'var(--ink-faint)', padding: 4 }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16, overflowY: 'auto' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--ink-faint)' }}>
            <p style={{ marginBottom: 16, fontSize: 14 }}>לדוגמה:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }}>
              {suggestions.map((s) => (
                <button key={s} className="chip" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
            <p style={{ margin: '26px 0 12px', fontSize: 14 }}>שאלות נפוצות — עונה מיד:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }}>
              {FAQ.slice(0, 10).map((f) => (
                <button key={f.id} className="chip" style={{ background: 'var(--lime-tint)' }} onClick={(ev) => handleSend(ev as unknown as React.FormEvent, false, f.question)}>{f.question}</button>
              ))}
            </div>
          </div>
        )}

        {entries.map((en, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: en.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: en.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: en.role === 'user' ? 'var(--flame)' : en.isError ? 'var(--magenta-tint)' : 'var(--paper)',
                color: en.role === 'user' ? '#FFF6EE' : en.isError ? 'var(--magenta-ink)' : 'var(--ink)',
                border: en.role === 'assistant' && !en.isError ? '1px solid var(--line)' : 'none',
                fontSize: 14.5,
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {en.content}
            </div>
            {en.faqId && (() => {
              const faq = FAQ.find((f) => f.id === en.faqId);
              const prevUser = [...entries.slice(0, i)].reverse().find((x) => x.role === 'user');
              return (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--lime-ink)', background: 'var(--lime-tint)', borderRadius: 999, padding: '2px 10px' }}>תשובה מוכנה</span>
                  {faq?.links?.map((l) => <Link key={l.to} to={l.to} className="chip" style={{ fontSize: 12.5, padding: '5px 12px' }}>{l.label} ←</Link>)}
                  {prevUser && (
                    <button type="button" className="chip" style={{ fontSize: 12.5, padding: '5px 12px' }} onClick={(ev) => handleSend(ev as unknown as React.FormEvent, true, prevUser.content)}>
                      רוצה יותר פירוט? שאלו את ה-AI
                    </button>
                  )}
                </div>
              );
            })()}
            {en.role === 'assistant' && !en.isError && en.content && !en.faqId && (
              <div style={{ marginTop: 6 }}>
                <CopyButton variant="mini" text={en.content} label="העתקה" />
              </div>
            )}
            {en.matches && en.matches.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, maxWidth: '100%' }}>
                {en.matches.map((a) => <ActivityCard key={a.id} activity={a} />)}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-faint)', fontSize: 14 }}>
            <MascotIcon size={22} className="doodle-wiggle" />
            ניצוץ חושב...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתבו כל שאלה או בקשה..."
          style={{ flex: 1, padding: '13px 18px', borderRadius: 999, border: '2.5px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif', fontSize: 15, outline: 'none' }}
        />
        <button type="submit" className="btn btn-flame" disabled={loading}>שליחה</button>
      </form>

      <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 10, textAlign: 'center' }}>
        השיחות נשמרות במכשיר שלך בלבד. תשובות ה-AI עלולות לטעות — כדאי לבדוק לפני שמעבירים בפועל. <Link to="/category/activities" style={{ textDecoration: 'underline' }}>למאגר הפעולות</Link>
      </p>
    </div>
  );
}
