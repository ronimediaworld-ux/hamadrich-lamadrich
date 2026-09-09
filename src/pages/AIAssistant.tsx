import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MascotIcon } from '../components/TeenAvatar';
import { ActivityCard } from '../components/ActivityCard';
import { searchActivities } from '../lib/search';
import { sendChatMessage, type ChatMessage } from '../lib/aiChat';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Activity } from '../data/types';

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
  matches?: Activity[];
  isError?: boolean;
}

const suggestions = ['פעולה על חברות לכיתה ז׳', 'איך מתמודדים עם חניך שמפריע?', 'רעיון לצ׳ופר זול וטוב', 'משהו בלי ציוד ל-20 דקות'];

export function AIAssistant() {
  useDocumentTitle('עוזר AI');
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userEntry: ChatEntry = { role: 'user', content: text };
    const matches = searchActivities(text, 3);
    const historyForApi: ChatMessage[] = [...entries, userEntry]
      .filter((en) => !en.isError)
      .map((en) => ({ role: en.role, content: en.content }));

    setEntries((prev) => [...prev, userEntry]);
    setInput('');
    setLoading(true);

    if (matches.length > 0) {
      setEntries((prev) => [...prev, { role: 'assistant', content: 'לפני הכל, מצאתי כמה פעולות מהמאגר שרלוונטיות:', matches }]);
    }

    const result = await sendChatMessage(historyForApi);
    setLoading(false);

    if (result.ok) {
      setEntries((prev) => [...prev, { role: 'assistant', content: result.reply }]);
    } else {
      setEntries((prev) => [...prev, { role: 'assistant', content: result.message, isError: true }]);
    }
  }

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 24, maxWidth: 760, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 68px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <MascotIcon size={40} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>עוזר AI — ניצוץ</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>שאלו אותי כל דבר — הדרכה, רעיונות, צ׳ופרים, או בקשו פעולה חדשה</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16, overflowY: 'auto' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--ink-faint)' }}>
            <p style={{ marginBottom: 16, fontSize: 14 }}>לדוגמה:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }}>
              {suggestions.map((s) => (
                <button key={s} className="chip" onClick={() => setInput(s)}>{s}</button>
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
        תשובות ה-AI עלולות לטעות — כדאי לבדוק לפני שמעבירים בפועל. <Link to="/category/activities" style={{ textDecoration: 'underline' }}>למאגר הפעולות</Link>
      </p>
    </div>
  );
}
