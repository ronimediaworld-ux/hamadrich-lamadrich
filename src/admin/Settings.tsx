import { HealthPanel, Panel } from '../pages/AdminInbox';

const STEPS: [string, string][] = [
  ['1. לקנות דומיין', 'את משלמת. מומלץ co.il אצל רשם מורשה. כדאי לבדוק מחיר חידוש ולא רק מחיר ראשון.'],
  ['2. לחבר את הדומיין ל-Render', 'ב-Render: Settings ← Custom Domains ← Add. אחר כך מוסיפים אצל הרשם את רשומות ה-DNS ש-Render מציג, ולוחצים Verify.'],
  ['3. להגיד לאתר מה הכתובת', 'ב-Render ← Environment: SITE_URL עם הכתובת החדשה, ואחרי שהכל עובד גם FORCE_CANONICAL_HOST = true.'],
  ['4. גוגל', 'ב-Search Console מוסיפים את האתר, מאמתים בעלות ושולחים את sitemap.xml.'],
  ['5. עריכה שעולה לאתר לבד', 'ב-Render ← Environment: GITHUB_TOKEN (הרשאת כתיבה למאגר) ו-RENDER_DEPLOY_HOOK (Settings ← Deploy Hook). הדבקה של טוקנים נעשית רק על ידך.'],
];

export function Settings() {
  const origin = window.location.origin;
  return (
    <div className="adm-stack">
      <div className="adm-head"><h1>הגדרות וחיבורים</h1></div>
      <HealthPanel />
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
