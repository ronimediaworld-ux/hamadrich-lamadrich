import { useEffect, useState, useCallback } from 'react';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { getCurrentParsha, getCurrentParshaNames } from '../lib/parsha';

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
interface AdminComment { id: string; kind: string; targetId: string; name: string; text: string; createdAt: number; status: string }
interface AdminSubmission { id: string; name: string; contact: string; title: string; body: string; createdAt: number; attachment: { name: string; type: string; size: number } | null }

const KIND_LABEL: Record<string, string> = { activity: 'פעולה', reading: 'קטע קריאה', chupar: 'צ׳ופר', 'staff-study': 'לימוד צוות', situation: 'סיטואציה', method: 'מתודה' };
const KIND_PATH: Record<string, string> = { activity: 'activity', reading: 'reading', chupar: 'chupar', 'staff-study': 'staff-study' };

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '18px 22px', marginBottom: 18 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}

interface Health { storage: string; githubConnected: boolean; mailConfigured: boolean; notifyConfigured: boolean; aiConfigured: boolean; siteUrl: string; production: boolean }

function HealthPanel() {
  const [h, setH] = useState<Health | null>(null);
  useEffect(() => { fetch('/api/admin/health').then((r) => r.json()).then(setH).catch(() => setH(null)); }, []);
  if (!h) return null;
  const rows: [string, boolean, string][] = [
    ['שמירת נתונים קבועה (Upstash)', h.storage === 'upstash', 'בלי זה צפיות, תגובות והצעות נמחקים בכל פריסה. הגדירו UPSTASH_REDIS_REST_URL ו-UPSTASH_REDIS_REST_TOKEN.'],
    ['עריכת תוכן מהדשבורד נשמרת באתר (GitHub)', h.githubConnected, 'בלי GITHUB_TOKEN שינויים בתוכן נשמרים רק מקומית ולא יעלו לאתר החי.'],
    ['התראת מייל על הצעות', h.notifyConfigured && h.mailConfigured, 'הגדירו RESEND_API_KEY ו-NOTIFY_EMAIL.'],
    ['שליחת מיילים לנרשמים', h.mailConfigured, 'דורש RESEND_API_KEY, ולאימות דומיין ב-Resend כדי לשלוח לאחרים.'],
    ['עוזר AI (ניצוץ)', h.aiConfigured, 'הגדירו GEMINI_API_KEY.'],
    ['כתובת האתר לגוגל (SITE_URL)', !h.siteUrl.includes('localhost') && h.production, 'הגדירו SITE_URL לכתובת האמיתית כדי שה-sitemap וה-canonical יהיו נכונים.'],
  ];
  return (
    <Panel title="מצב המערכת">
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
        {rows.map(([label, ok, hint]) => (
          <li key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: ok ? 'var(--lime)' : 'var(--yellow)', color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? '✓' : '!'}</span>
            <span><b>{label}</b>{!ok && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink-faint)' }}>{hint}</span>}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '12px 0 0' }}>
        לגוגל: אחרי שהאתר עולה, הוסיפי אותו ב-<a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Google Search Console</a> ושלחי את <code>{h.siteUrl}/sitemap.xml</code>.
      </p>
    </Panel>
  );
}

function StatsView() {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    fetch('/api/admin/stats').then(async (r) => { if (!r.ok) throw new Error(); setS(await r.json()); }).catch(() => setErr('לא הצלחנו לטעון סטטיסטיקה.'));
  }, []);
  if (err) return <p style={{ color: 'var(--flame-ink)' }}>{err}</p>;
  if (!s) return <p style={{ color: 'var(--ink-faint)' }}>טוען...</p>;
  const max = Math.max(1, ...s.last14.map((d) => d.count));
  return (
    <div>
      <HealthPanel />
      {s.storage === 'file' && (
        <div style={{ background: 'var(--yellow-tint)', border: '1px solid var(--yellow)', borderRadius: 12, padding: '12px 16px', fontSize: 13.5, marginBottom: 18, lineHeight: 1.7 }}>
          <b>שימו לב:</b> הנתונים נשמרים כרגע בקובץ מקומי בשרת. בשירות החינמי של Render הקובץ נמחק בכל פריסה או הרדמה של האתר.
          כדי שהספירות, התגובות וההצעות יישמרו לתמיד — הגדירו Upstash Redis חינמי (ראו README: <code>UPSTASH_REDIS_REST_URL</code> ו-<code>UPSTASH_REDIS_REST_TOKEN</code>).
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
        {[['כניסות לאתר (סה״כ)', s.visitsTotal], ['כניסות היום', s.visitsToday], ['צפיות בתכנים (סה״כ)', s.totalViews], ['תגובות ממתינות', s.pendingComments], ['הצעות פעולות', s.submissionsCount], ['נרשמים לעדכון שבועי', s.subscribersCount]].map(([label, n]) => (
          <div key={String(label)} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--flame-ink)' }}>{Number(n).toLocaleString('he-IL')}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{label}</div>
          </div>
        ))}
      </div>
      <Panel title="כניסות ב-14 הימים האחרונים">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, direction: 'ltr' }}>
          {s.last14.map((d) => (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${d.date}: ${d.count}`}>
              <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{d.count || ''}</span>
              <div style={{ width: '100%', height: `${(d.count / max) * 80}px`, minHeight: 2, background: 'var(--flame)', borderRadius: 4 }} />
              <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="דירוגי מדריכים (איך הלך?)">
        {s.ratings.length === 0 ? <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>עדיין אין דירוגים.</p> : (
          <ul style={{ margin: 0, paddingInlineStart: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            {s.ratings.map((r) => {
              const [kind, ...rest] = r.key.split(':');
              const id = rest.join(':');
              return <li key={r.key}><a href={`/${KIND_PATH[kind] ?? 'activity'}/${id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{id}</a> <span style={{ color: 'var(--ink-faint)' }}>— {r.avg.toFixed(1)} מתוך 5 ({r.count} דירוגים)</span></li>;
            })}
          </ul>
        )}
      </Panel>
      <Panel title="התכנים הנצפים ביותר">
        {s.topViews.length === 0 ? <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>עדיין אין צפיות.</p> : (
          <ol style={{ margin: 0, paddingInlineStart: 22, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            {s.topViews.map((v) => {
              const [kind, ...rest] = v.key.split(':');
              const id = rest.join(':');
              const path = KIND_PATH[kind];
              return (
                <li key={v.key}>
                  {path ? <a href={`/${path}/${id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{id}</a> : id}
                  <span style={{ color: 'var(--ink-faint)', marginInlineStart: 8 }}>({KIND_LABEL[kind] ?? kind}) — {v.count} צפיות</span>
                </li>
              );
            })}
          </ol>
        )}
      </Panel>
    </div>
  );
}

interface Sub { email: string; name: string; createdAt: number }

function SubscribersView() {
  const [list, setList] = useState<Sub[] | null>(null);
  const [mailOk, setMailOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const load = useCallback(() => {
    fetch('/api/admin/subscribers').then((r) => r.json()).then((d) => { setList(d.subscribers ?? []); setMailOk(!!d.mailConfigured); }).catch(() => setList([]));
  }, []);
  useEffect(load, [load]);

  const parsha = getCurrentParsha();
  const names = getCurrentParshaNames();
  const forParsha = activities.filter((a) => a.categorySlug === 'activities' && a.tags.some((t) => names.includes(t))).slice(0, 5);
  const latestReading = readings[readings.length - 1];
  const origin = window.location.origin;
  const subject = parsha ? `פעולות לפרשת ${parsha} — המדריך למדריך` : 'פעולה חדשה מהמדריך למדריך';
  const lines = [
    parsha ? `שבת שלום! אלה הפעולות של פרשת ${parsha}:` : 'שבוע טוב! כמה תכנים מהמאגר:',
    '',
    ...(forParsha.length ? forParsha.map((a) => `• ${a.title} (${a.ageLabel}, ${a.duration} דק׳) — ${origin}/activity/${a.id}`) : [`• כל הפעולות: ${origin}/category/activities`]),
    '',
    `קטע קריאה לשבת: ${latestReading.title} — ${origin}/reading/${latestReading.id}`,
    '',
    'להתראות, רוני',
  ];
  const text = lines.join('\n');
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.7">${lines.map((l) => (l ? `<p>${l.replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>')}</p>` : '')).join('')}</div>`;

  async function send() {
    if (!window.confirm(`לשלוח את המייל ל-${list?.length ?? 0} נרשמים?`)) return;
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/send-weekly', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subject, text, html }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? `נשלח ל-${d.sent} נרשמים.` : d.message || 'השליחה נכשלה.');
  }
  async function del(email: string) {
    if (!window.confirm(`להסיר את ${email}?`)) return;
    await fetch(`/api/admin/subscribers/${encodeURIComponent(email)}`, { method: 'DELETE' });
    load();
  }

  if (list === null) return <p style={{ color: 'var(--ink-faint)' }}>טוען...</p>;
  return (
    <div>
      <Panel title={`נרשמים לעדכון השבועי (${list.length})`}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <a className="btn btn-outline" style={{ fontSize: 12.5, padding: '7px 14px' }} href="/api/admin/subscribers.csv">הורדת רשימה (CSV)</a>
        </div>
        {list.length === 0 ? <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>עדיין אין נרשמים.</p> : (
          <ul style={{ margin: 0, paddingInlineStart: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            {list.map((x) => (
              <li key={x.email} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span dir="ltr">{x.email}</span>
                <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{new Date(x.createdAt).toLocaleDateString('he-IL')}</span>
                <button onClick={() => del(x.email)} style={{ border: 'none', background: 'transparent', color: 'var(--ink-faint)', textDecoration: 'underline', fontSize: 12.5 }}>הסרה</button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="המייל השבועי">
        <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 6 }}>נושא: {subject}</div>
        <pre style={{ whiteSpace: 'pre-wrap', direction: 'rtl', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, fontFamily: 'Heebo, sans-serif', fontSize: 13.5, margin: '0 0 12px' }}>{text}</pre>
        <button className="btn btn-flame" disabled={busy || !mailOk || list.length === 0} onClick={send}>{busy ? 'שולח...' : 'שליחה לכל הנרשמים'}</button>
        {!mailOk && <p style={{ fontSize: 13, color: 'var(--flame-ink)', marginTop: 10 }}>שליחת מיילים עוד לא הוגדרה בשרת (RESEND_API_KEY ו-MAIL_FROM — ראו README). עד אז אפשר להעתיק את הטקסט ולשלוח ידנית.</p>}
        {msg && <p style={{ fontSize: 13.5, marginTop: 10 }}>{msg}</p>}
      </Panel>
    </div>
  );
}

function CommentsView() {
  const [list, setList] = useState<AdminComment[] | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved'>('pending');
  const load = useCallback(() => {
    setList(null);
    fetch(`/api/admin/comments?status=${status}`).then((r) => r.json()).then((d) => setList(d.comments ?? [])).catch(() => setList([]));
  }, [status]);
  useEffect(load, [load]);
  async function act(id: string, kind: 'approve' | 'delete') {
    if (kind === 'delete' && !window.confirm('למחוק את התגובה?')) return;
    await fetch(kind === 'approve' ? `/api/admin/comments/${id}/approve` : `/api/admin/comments/${id}`, { method: kind === 'approve' ? 'POST' : 'DELETE' });
    load();
  }
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`chip${status === 'pending' ? ' is-active' : ''}`} onClick={() => setStatus('pending')}>ממתינות לאישור</button>
        <button className={`chip${status === 'approved' ? ' is-active' : ''}`} onClick={() => setStatus('approved')}>מאושרות</button>
      </div>
      {list === null && <p style={{ color: 'var(--ink-faint)' }}>טוען...</p>}
      {list?.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>אין תגובות {status === 'pending' ? 'ממתינות' : 'מאושרות'}.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list?.map((c) => (
          <div key={c.id} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 4 }}>
              {KIND_LABEL[c.kind] ?? c.kind}: {KIND_PATH[c.kind] ? <a href={`/${KIND_PATH[c.kind]}/${c.targetId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{c.targetId}</a> : c.targetId} · {new Date(c.createdAt).toLocaleString('he-IL')}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 14.5, whiteSpace: 'pre-line', marginBottom: 10 }}>{c.text}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {status === 'pending' && <button className="btn btn-flame" style={{ fontSize: 12.5, padding: '7px 14px' }} onClick={() => act(c.id, 'approve')}>אישור</button>}
              <button className="btn btn-outline" style={{ fontSize: 12.5, padding: '7px 14px' }} onClick={() => act(c.id, 'delete')}>מחיקה</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmissionsView() {
  const [list, setList] = useState<AdminSubmission[] | null>(null);
  const load = useCallback(() => {
    fetch('/api/admin/submissions').then((r) => r.json()).then((d) => setList(d.submissions ?? [])).catch(() => setList([]));
  }, []);
  useEffect(load, [load]);
  async function del(id: string) {
    if (!window.confirm('למחוק את ההצעה?')) return;
    await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
    load();
  }
  if (list === null) return <p style={{ color: 'var(--ink-faint)' }}>טוען...</p>;
  if (list.length === 0) return <p style={{ color: 'var(--ink-faint)' }}>עדיין לא התקבלו הצעות פעולות.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.map((s) => (
        <div key={s.id} className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <div style={{ fontWeight: 800, fontSize: 15.5 }}>{s.title || 'ללא שם'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{new Date(s.createdAt).toLocaleString('he-IL')}</div>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 8 }}>{s.name || 'ללא שם'} · {s.contact}</div>
          <div style={{ fontSize: 14.5, whiteSpace: 'pre-line', marginBottom: 10 }}>{s.body}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {s.attachment && (
              <a className="btn btn-outline" style={{ fontSize: 12.5, padding: '7px 14px' }} href={`/api/admin/submissions/${s.id}/file`}>
                הורדת הקובץ ({s.attachment.name})
              </a>
            )}
            <button className="btn btn-outline" style={{ fontSize: 12.5, padding: '7px 14px' }} onClick={() => del(s.id)}>מחיקה</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminInbox() {
  const [tab, setTab] = useState<'stats' | 'submissions' | 'comments' | 'subscribers'>('stats');
  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 60, maxWidth: 900 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className={`chip${tab === 'stats' ? ' is-active' : ''}`} onClick={() => setTab('stats')}>סטטיסטיקה</button>
        <button className={`chip${tab === 'submissions' ? ' is-active' : ''}`} onClick={() => setTab('submissions')}>הצעות פעולות</button>
        <button className={`chip${tab === 'comments' ? ' is-active' : ''}`} onClick={() => setTab('comments')}>תגובות</button>
        <button className={`chip${tab === 'subscribers' ? ' is-active' : ''}`} onClick={() => setTab('subscribers')}>נרשמים ומייל שבועי</button>
      </div>
      {tab === 'stats' && <StatsView />}
      {tab === 'submissions' && <SubmissionsView />}
      {tab === 'comments' && <CommentsView />}
      {tab === 'subscribers' && <SubscribersView />}
    </div>
  );
}
