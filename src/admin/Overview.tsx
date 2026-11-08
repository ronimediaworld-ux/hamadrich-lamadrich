import { useEffect, useMemo, useState } from 'react';
import { describeKey, describeTarget, CONTENT_COUNTS } from './titles';
import type { Section } from './types';

interface Stats {
  storage: 'upstash' | 'file';
  visitsTotal: number;
  visitsToday: number;
  last14: { date: string; count: number }[];
  topViews: { key: string; count: number }[];
  totalViews: number;
  pendingComments: number;
  submissionsCount: number;
  subscribersCount: number;
  ratings: { key: string; count: number; avg: number }[];
}
interface Comment { id: string; kind: string; targetId: string; name: string; text: string; createdAt: number }
interface Submission { id: string; name: string; contact: string; title: string; body: string; createdAt: number }
interface Sub { email: string; name: string; createdAt: number }
interface Health { storage: string; githubConnected: boolean; deployHookConfigured: boolean; googleVerification: boolean; forceCanonical: boolean; mailConfigured: boolean; notifyConfigured: boolean; aiConfigured: boolean; siteUrl: string; production: boolean }

const SEEN_KEY = 'hlm-admin-last-seen';
const getJson = <T,>(url: string): Promise<T | null> => fetch(url).then((r) => (r.ok ? (r.json() as Promise<T>) : null)).catch(() => null);
const nf = (n: number) => n.toLocaleString('he-IL');

function readSeen(): number {
  try { return Number(localStorage.getItem(SEEN_KEY)) || 0; } catch { return 0; }
}

function ago(ts: number): string {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 2) return 'ממש עכשיו';
  if (mins < 60) return `לפני ${mins} דקות`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'אתמול' : `לפני ${days} ימים`;
}

export function Overview({ onGo }: { onGo: (s: Section) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [subscribers, setSubscribers] = useState<Sub[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [seen, setSeen] = useState(readSeen);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      getJson<Stats>('/api/admin/stats'),
      getJson<{ comments: Comment[] }>('/api/admin/comments?status=pending'),
      getJson<{ submissions: Submission[] }>('/api/admin/submissions'),
      getJson<{ subscribers: Sub[] }>('/api/admin/subscribers'),
      getJson<Health>('/api/admin/health'),
    ]).then(([st, cm, sb, sc, hl]) => {
      if (!live) return;
      setStats(st); setComments(cm?.comments ?? []); setSubs(sb?.submissions ?? []); setSubscribers(sc?.subscribers ?? []); setHealth(hl); setLoaded(true);
    });
    return () => { live = false; };
  }, []);

  const newSubs = subs.filter((s) => s.createdAt > seen).length;
  const newSubscribers = subscribers.filter((s) => s.createdAt > seen).length;

  const feed = useMemo(() => {
    const items = [
      ...comments.map((c) => ({ t: c.createdAt, section: 'comments' as Section, tag: 'תגובה', text: `${c.name}: ${c.text}`, where: describeTarget(c.kind, c.targetId).title })),
      ...subs.map((s) => ({ t: s.createdAt, section: 'submissions' as Section, tag: 'הצעת פעולה', text: s.title || 'ללא שם', where: s.name || s.contact })),
      ...subscribers.map((s) => ({ t: s.createdAt, section: 'subscribers' as Section, tag: 'נרשם/ת חדש/ה', text: s.email, where: '' })),
    ];
    return items.sort((a, b) => b.t - a.t).slice(0, 7);
  }, [comments, subs, subscribers]);

  const setup = health ? [
    { ok: health.storage === 'upstash', label: 'שמירת נתונים קבועה' },
    { ok: health.githubConnected, label: 'עריכה מהדשבורד נשמרת באתר' },
    { ok: health.deployHookConfigured, label: 'האתר מתעדכן לבד אחרי עריכה' },
    { ok: !health.siteUrl.includes('localhost') && !health.siteUrl.includes('onrender.com'), label: 'דומיין משלך מחובר' },
    { ok: health.googleVerification, label: 'אימות בגוגל' },
    { ok: health.notifyConfigured && health.mailConfigured, label: 'התראות במייל' },
    { ok: health.aiConfigured, label: 'עוזר ה-AI' },
  ] : [];
  const done = setup.filter((x) => x.ok).length;

  function markSeen() {
    const now = Date.now();
    try { localStorage.setItem(SEEN_KEY, String(now)); } catch { /* מצב פרטי */ }
    setSeen(now);
  }

  if (!loaded) return <p className="adm-muted">טוען את המידע מהאתר...</p>;
  if (!stats) return <p className="adm-muted">לא הצלחנו לקרוא את הנתונים מהשרת. נסי לרענן.</p>;

  const week = stats.last14.slice(7).reduce((n, d) => n + d.count, 0);
  const max = Math.max(1, ...stats.last14.map((d) => d.count));
  const todo = stats.pendingComments + newSubs + newSubscribers;
  const hour = new Date().getHours();
  const greet = hour < 5 ? 'לילה טוב' : hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';

  return (
    <div className="adm-stack">
      <div className="adm-hero">
        <div>
          <h1>{greet}, רוני</h1>
          <p>{todo > 0 ? `יש ${nf(todo)} דברים חדשים שמחכים לך.` : 'הכל מטופל. אין כרגע משהו שדורש אותך.'}</p>
        </div>
        <div className="adm-hero-actions">
          <a className="btn btn-outline" href="/" target="_blank" rel="noopener noreferrer">לצפייה באתר</a>
          <button type="button" className="btn btn-flame" onClick={() => onGo('content')}>+ עריכה והוספת תוכן</button>
        </div>
      </div>

      <section>
        <div className="adm-head"><h2>מחכה לך</h2>{todo > 0 && <button type="button" className="adm-link" onClick={markSeen}>סימנתי שראיתי הכל</button>}</div>
        <div className="adm-tiles">
          <button type="button" className={`adm-tile${stats.pendingComments ? ' is-hot' : ''}`} onClick={() => onGo('comments')}>
            <b>{nf(stats.pendingComments)}</b><span>תגובות לאישור</span><em>{stats.pendingComments ? 'לאשר או למחוק' : 'אין ממתינות ✓'}</em>
          </button>
          <button type="button" className={`adm-tile${newSubs ? ' is-hot' : ''}`} onClick={() => onGo('submissions')}>
            <b>{nf(newSubs)}</b><span>הצעות פעולות חדשות</span><em>{subs.length ? `${nf(subs.length)} בסך הכל` : 'עוד לא הגיעו הצעות'}</em>
          </button>
          <button type="button" className={`adm-tile${newSubscribers ? ' is-hot' : ''}`} onClick={() => onGo('subscribers')}>
            <b>{nf(newSubscribers)}</b><span>נרשמים חדשים</span><em>{nf(subscribers.length)} בסך הכל</em>
          </button>
        </div>
      </section>

      <div className="adm-cols">
        <section className="adm-card">
          <div className="adm-head"><h2>מה קרה לאחרונה</h2></div>
          {feed.length === 0 ? <p className="adm-muted">עוד לא הגיע שום דבר מהאתר. כשיגיעו תגובות, הצעות או נרשמים הם יופיעו כאן.</p> : (
            <ul className="adm-feed">
              {feed.map((f, i) => (
                <li key={i}>
                  <button type="button" onClick={() => onGo(f.section)}>
                    <span className="adm-tag">{f.tag}</span>
                    <span className="adm-feed-text">{f.text}{f.where && <small> · {f.where}</small>}</span>
                    <small className="adm-muted">{ago(f.t)}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-head"><h2>הכנסו לאתר</h2></div>
          <div className="adm-kpis">
            <div><b>{nf(stats.visitsToday)}</b><span>היום</span></div>
            <div><b>{nf(week)}</b><span>ב-7 ימים אחרונים</span></div>
            <div><b>{nf(stats.visitsTotal)}</b><span>סה״כ</span></div>
          </div>
          <div className="adm-bars" role="img" aria-label="כניסות ב-14 הימים האחרונים">
            {stats.last14.map((d, i) => (
              <div key={d.date} className={`adm-bar${i === stats.last14.length - 1 ? ' is-today' : ''}`} title={`${d.date}: ${d.count}`}>
                <i style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }} />
                <span>{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="adm-cols">
        <section className="adm-card">
          <div className="adm-head"><h2>התכנים הנצפים ביותר</h2><button type="button" className="adm-link" onClick={() => onGo('stats')}>כל הסטטיסטיקה</button></div>
          {stats.topViews.length === 0 ? <p className="adm-muted">עוד אין צפיות.</p> : (
            <ol className="adm-rank">
              {stats.topViews.slice(0, 6).map((v) => {
                const d = describeKey(v.key);
                return (
                  <li key={v.key}>
                    {d.href ? <a href={d.href} target="_blank" rel="noopener noreferrer">{d.title}</a> : <span>{d.title}</span>}
                    <small>{d.kind}</small><b>{nf(v.count)}</b>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-head"><h2>מה יש באתר</h2></div>
          <div className="adm-kpis">
            {CONTENT_COUNTS.map((c) => <div key={c.label}><b>{nf(c.n)}</b><span>{c.label}</span></div>)}
          </div>
          {setup.length > 0 && (
            <button type="button" className="adm-setup" onClick={() => onGo('settings')}>
              <span className="adm-setup-bar"><i style={{ width: `${(done / setup.length) * 100}%` }} /></span>
              <span>חיבורים והגדרות: {done} מתוך {setup.length} מוכנים{done < setup.length ? ' · לראות מה חסר' : ' ✓'}</span>
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
