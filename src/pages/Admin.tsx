import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { CommentsView, StatsView, SubmissionsView, SubscribersView } from './AdminInbox';
import { Overview } from '../admin/Overview';
import { ContentManager } from '../admin/ContentManager';
import { Settings } from '../admin/Settings';
import { SECTION_TITLES, type Section } from '../admin/types';

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'שגיאה בהתחברות');
        return;
      }
      onLoggedIn();
    } catch {
      setError('לא הצלחנו להתחבר לשרת.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 380, paddingTop: 80 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>כניסת ניהול</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          autoFocus
          style={{ width: '100%', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px', fontSize: 15, marginBottom: 12 }}
        />
        {error && <p style={{ color: 'var(--flame-ink)', fontSize: 13.5, marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn btn-flame" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'רגע...' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const NAV: { id: Section; d: string; badge?: 'comments' | 'submissions' }[] = [
  { id: 'overview', d: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { id: 'comments', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge: 'comments' },
  { id: 'submissions', d: 'M4 4h16v12H5.2L4 17.2zM8 9h8M8 12h5', badge: 'submissions' },
  { id: 'subscribers', d: 'M4 6h16v12H4zM4 7l8 6 8-6' },
  { id: 'content', d: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' },
  { id: 'stats', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' },
];

function sectionFromHash(): Section {
  const h = window.location.hash.replace('#/', '') as Section;
  return h in SECTION_TITLES ? h : 'overview';
}

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>(sectionFromHash);
  const [counts, setCounts] = useState<{ comments: number; submissions: number }>({ comments: 0, submissions: 0 });

  useEffect(() => {
    const on = () => setSection(sectionFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    const load = () => fetch('/api/admin/stats').then((r) => (r.ok ? r.json() : null)).then((s) => { if (s) setCounts({ comments: s.pendingComments, submissions: s.submissionsCount }); }).catch(() => undefined);
    load();
    const t = window.setInterval(load, 60000);
    return () => window.clearInterval(t);
  }, [section]);

  const go = (s: Section) => { window.location.hash = `#/${s}`; window.scrollTo(0, 0); };

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><span className="adm-flame" aria-hidden="true" />ניהול האתר</div>
        <nav>
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`adm-nav${section === n.id ? ' is-active' : ''}`} onClick={() => go(n.id)}>
              <Icon d={n.d} />
              <span>{SECTION_TITLES[n.id]}</span>
              {n.badge && counts[n.badge] > 0 && <i className="adm-badge">{counts[n.badge]}</i>}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">לצפייה באתר ←</a>
          <button type="button" onClick={onLogout}>יציאה</button>
        </div>
      </aside>
      <main className="adm-main">
        {section === 'overview' && <Overview onGo={go} />}
        {section === 'comments' && <><div className="adm-head"><h1>תגובות</h1></div><CommentsView /></>}
        {section === 'submissions' && <><div className="adm-head"><h1>הצעות פעולות</h1></div><SubmissionsView /></>}
        {section === 'subscribers' && <><div className="adm-head"><h1>נרשמים ומייל שבועי</h1></div><SubscribersView /></>}
        {section === 'content' && <ContentManager />}
        {section === 'stats' && <><div className="adm-head"><h1>סטטיסטיקה</h1></div><StatsView /></>}
        {section === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export function Admin() {
  useDocumentTitle('ניהול האתר');
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.loggedIn));
  }, []);

  if (loggedIn === null) return null;
  if (!loggedIn) return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  return <AdminShell onLogout={() => { void fetch('/api/admin/logout', { method: 'POST' }).then(() => setLoggedIn(false)); }} />;
}
