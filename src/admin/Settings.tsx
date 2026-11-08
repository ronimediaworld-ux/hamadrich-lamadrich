import { useState } from 'react';
import { HealthPanel, Panel } from '../pages/AdminInbox';

const STEPS: [string, string][] = [
  ['1. לקנות דומיין', 'את משלמת. מומלץ co.il אצל רשם מורשה. כדאי לבדוק מחיר חידוש ולא רק מחיר ראשון.'],
  ['2. לחבר את הדומיין ל-Render', 'ב-Render: Settings ← Custom Domains ← Add. אחר כך מוסיפים אצל הרשם את רשומות ה-DNS ש-Render מציג, ולוחצים Verify.'],
  ['3. להגיד לאתר מה הכתובת', 'ב-Render ← Environment: SITE_URL עם הכתובת החדשה, ואחרי שהכל עובד גם FORCE_CANONICAL_HOST = true.'],
  ['4. גוגל', 'ב-Search Console מוסיפים את האתר, מאמתים בעלות ושולחים את sitemap.xml.'],
  ['5. עריכה שעולה לאתר לבד', 'ב-Render ← Environment: GITHUB_TOKEN (הרשאת כתיבה למאגר) ו-RENDER_DEPLOY_HOOK (Settings ← Deploy Hook). הדבקה של טוקנים נעשית רק על ידך.'],
];

function TestButton({ label, url, body }: { label: string; url: string; body?: unknown }) {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function run() {
    setBusy(true); setRes(null);
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body ?? {}) });
      const d = await r.json();
      setRes({ ok: !!d.ok, text: d.ok ? (d.message || `עובד. תשובת הניסוי: ${d.reply ?? ''} (${d.model ?? ''})`) : (d.message || 'הבדיקה נכשלה.') });
    } catch {
      setRes({ ok: false, text: 'שגיאת רשת. נסי שוב.' });
    } finally { setBusy(false); }
  }
  return (
    <div style={{ marginTop: 12 }}>
      <button type="button" className="btn btn-outline" onClick={run} disabled={busy}>{busy ? 'בודק...' : label}</button>
      {res && <p className={`adm-msg${res.ok ? ' is-ok' : ''}`} style={{ marginTop: 10 }}>{res.text}</p>}
    </div>
  );
}

function CopyLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setDone(true); window.setTimeout(() => setDone(false), 2000); } catch { window.prompt('העתיקי את הקישור:', url); }
  }
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <a href={url} dir="ltr" style={{ fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}>{url}</a>
      <button type="button" className="btn btn-outline" onClick={copy}>{done ? 'הועתק ✓' : 'העתקת הקישור'}</button>
    </div>
  );
}

export function Settings() {
  const origin = window.location.origin;
  return (
    <div className="adm-stack">
      <div className="adm-head"><h1>הגדרות וחיבורים</h1></div>
      <Panel title="הקישור לדשבורד שלך">
        <CopyLink url={`${origin}/admin`} />
        <p className="adm-muted" style={{ marginTop: 10 }}>כדאי לשמור אותו במועדפים בדפדפן, ובטלפון להוסיף למסך הבית. הכניסה בסיסמה שמוגדרת ב-Render (ADMIN_PASSWORD).</p>
      </Panel>
      <HealthPanel />
      <Panel title="פרסום אוטומטי: כל שמירה בדשבורד עולה לאתר לבד">
        <ol className="adm-steps">
          <li><b>1. טוקן של GitHub</b><span>נכנסים ל-GitHub עם החשבון ronimediaworld-ux ← <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Fine-grained token חדש</a>. Repository access: Only select repositories ← hamadrich-lamadrich. Permissions ← Contents: Read and write. יוצרים ומעתיקים.</span></li>
          <li><b>2. קישור הפריסה</b><span>ב-Render ← השירות ← Settings ← Deploy Hook ← מעתיקים את הקישור.</span></li>
          <li><b>3. להדביק ב-Render</b><span>Environment: <code>GITHUB_TOKEN</code> (הטוקן) ו-<code>RENDER_DEPLOY_HOOK</code> (הקישור). שומרים ומחכים לפריסה.</span></li>
          <li><b>4. לבדוק</b><span>לוחצים על הכפתור. אחרי שיעבור, כל שינוי שתעשי בעריכת תוכן יעלה לאתר החי בעוד כשתי דקות, בלי שתיגעי ב-Render.</span></li>
        </ol>
        <TestButton label="בדיקת פרסום אוטומטי" url="/api/admin/publish-test" />
      </Panel>
      <Panel title="חיבור ניצוץ, עוזר ה-AI">
        <ol className="adm-steps">
          <li><b>1. ליצור מפתח חינמי</b><span>נכנסים ל-<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Google AI Studio</a> עם חשבון גוגל, לוחצים Create API key ומעתיקים אותו.</span></li>
          <li><b>2. להדביק ב-Render</b><span>Render ← Environment ← Add: שם <code>GEMINI_API_KEY</code>, והערך הוא המפתח. שומרים ומחכים לפריסה (כדקה).</span></li>
          <li><b>3. לבדוק</b><span>לוחצים כאן. אם זה לא עובד, מופיעה סיבה.</span></li>
        </ol>
        <TestButton label="בדיקת ניצוץ" url="/api/admin/ai-test" />
      </Panel>
      <Panel title="חיבור שליחת מיילים (Resend)">
        <ol className="adm-steps">
          <li><b>1. ליצור חשבון</b><span>ב-<a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Resend</a> (יש חבילה חינמית), ואז API Keys ← Create API Key.</span></li>
          <li><b>2. להדביק ב-Render</b><span>Environment: <code>RESEND_API_KEY</code> (המפתח), <code>NOTIFY_EMAIL</code> (המייל שלך, שאליו יגיעו התראות על הצעות חדשות). שומרים ומחכים לפריסה.</span></li>
          <li><b>3. לשלוח לנרשמים ולא רק לך</b><span>בלי דומיין מאומת Resend שולח רק לכתובת שבה נרשמת. אחרי שיהיה לך דומיין: Resend ← Domains ← Add Domain, מוסיפים את רשומות ה-DNS, ואז ב-Render מגדירים <code>MAIL_FROM</code> = <code>המדריך למדריך &lt;hello@הדומיין-שלך&gt;</code>.</span></li>
        </ol>
        <TestButton label="שליחת מייל בדיקה אלי" url="/api/admin/mail-test" />
      </Panel>
      <Panel title="הדרך לדומיין משלך ולגוגל">
        <ol className="adm-steps">{STEPS.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ol>
      </Panel>
      <Panel title="קישורים שימושיים">
        <ul className="adm-links">
          <li><a href="https://dashboard.render.com/web/srv-db2l9c49v7es738hhpe0" target="_blank" rel="noopener noreferrer">Render: שירות האתר והגדרות</a></li>
          <li><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
          <li><a href={`${origin}/sitemap.xml`} target="_blank" rel="noopener noreferrer">מפת האתר (sitemap.xml)</a></li>
          <li><a href={`https://www.google.com/search?q=site:${window.location.host}`} target="_blank" rel="noopener noreferrer">מה גוגל כבר מכיר מהאתר (site:)</a></li>
          <li><a href="https://github.com/ronimediaworld-ux/hamadrich-lamadrich" target="_blank" rel="noopener noreferrer">GitHub: הקוד והתוכן</a></li>
        </ul>
      </Panel>
    </div>
  );
}
