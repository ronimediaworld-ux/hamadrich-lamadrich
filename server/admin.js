import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// דשבורד ניהול תוכן — מאפשר לערוך פעולות, צ'ופרים, קטעי קריאה וכו' דרך דפדפן,
// בלי לגעת בקוד. שמירה כותבת מקומית ל-JSON, ואם מוגדר GITHUB_TOKEN — גם מבצעת
// קומיט ישירות ל-GitHub, כדי שה-deploy האוטומטי ב-Render יאסוף את זה לבד.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'ronimediaworld-ux/hamadrich-lamadrich';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// טיפוסי תוכן נתמכים: שם הקובץ, שדה החובה למיון/הצגה ברשימה.
const CONTENT_TYPES = {
  activities: { label: 'פעולות ומערכים', titleField: 'title' },
  chuparim: { label: 'צ׳ופרים', titleField: 'title' },
  readings: { label: 'קטעי קריאה', titleField: 'title' },
  methods: { label: 'מתודות', titleField: 'title' },
  situations: { label: 'סיטואציות בהדרכה', titleField: 'title' },
  staffStudy: { label: 'לימוד צוות', titleField: 'title' },
  quickGames: { label: 'משחקים מהירים', titleField: 'name' },
};

const sessions = new Set();

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((part) => {
      const idx = part.indexOf('=');
      return [part.slice(0, idx).trim(), decodeURIComponent(part.slice(idx + 1))];
    }),
  );
}

function requireAdmin(req, res, next) {
  const cookies = parseCookies(req);
  const token = cookies['hlm_admin'];
  if (token && sessions.has(token)) return next();
  return res.status(401).json({ error: 'unauthorized', message: 'צריך להתחבר קודם.' });
}

async function commitToGitHub(filePath, jsonContent, message) {
  if (!GITHUB_TOKEN) return { committed: false, reason: 'no_token' };

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  // צריך את ה-sha הנוכחי של הקובץ כדי לעדכן אותו (לא ליצור קונפליקט).
  let sha;
  const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers });
  if (getRes.ok) {
    const getData = await getRes.json();
    sha = getData.sha;
  } else if (getRes.status !== 404) {
    const errText = await getRes.text();
    throw new Error(`GitHub GET failed (${getRes.status}): ${errText}`);
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message,
      content: Buffer.from(jsonContent, 'utf8').toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub PUT failed (${putRes.status}): ${errText}`);
  }

  return { committed: true };
}

export function registerAdminRoutes(app, rootDir) {
  const dataDir = path.join(rootDir, 'src', 'data');

  app.post('/api/admin/login', (req, res) => {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ error: 'not_configured', message: 'עדיין לא הוגדרה סיסמת ניהול בשרת (ADMIN_PASSWORD).' });
    }
    const { password } = req.body ?? {};
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'wrong_password', message: 'סיסמה שגויה.' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    sessions.add(token);
    res.setHeader('Set-Cookie', `hlm_admin=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
    return res.json({ ok: true });
  });

  app.post('/api/admin/logout', (req, res) => {
    const cookies = parseCookies(req);
    if (cookies['hlm_admin']) sessions.delete(cookies['hlm_admin']);
    res.setHeader('Set-Cookie', 'hlm_admin=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
    return res.json({ ok: true });
  });

  app.get('/api/admin/me', (req, res) => {
    const cookies = parseCookies(req);
    const token = cookies['hlm_admin'];
    return res.json({ loggedIn: !!(token && sessions.has(token)), githubConnected: !!GITHUB_TOKEN });
  });

  app.get('/api/admin/types', requireAdmin, (_req, res) => {
    res.json(Object.entries(CONTENT_TYPES).map(([key, v]) => ({ key, ...v })));
  });

  app.get('/api/admin/content/:type', requireAdmin, (req, res) => {
    const { type } = req.params;
    if (!CONTENT_TYPES[type]) return res.status(404).json({ error: 'unknown_type' });
    try {
      const raw = readFileSync(path.join(dataDir, `${type}.json`), 'utf8');
      return res.json({ items: JSON.parse(raw) });
    } catch (err) {
      return res.status(500).json({ error: 'read_failed', message: String(err?.message || err) });
    }
  });

  app.put('/api/admin/content/:type', requireAdmin, async (req, res) => {
    const { type } = req.params;
    if (!CONTENT_TYPES[type]) return res.status(404).json({ error: 'unknown_type' });
    const items = req.body?.items;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'invalid_body', message: 'הבקשה חייבת לכלול מערך items.' });
    }
    const ids = items.map((it) => it?.id);
    if (ids.some((id) => !id || typeof id !== 'string')) {
      return res.status(400).json({ error: 'missing_id', message: 'לכל פריט חייב להיות שדה id.' });
    }
    if (new Set(ids).size !== ids.length) {
      return res.status(400).json({ error: 'duplicate_id', message: 'יש שני פריטים עם אותו id.' });
    }

    const jsonContent = JSON.stringify(items, null, 2) + '\n';
    const filePath = path.join(dataDir, `${type}.json`);

    try {
      writeFileSync(filePath, jsonContent, 'utf8');
    } catch (err) {
      return res.status(500).json({ error: 'write_failed', message: String(err?.message || err) });
    }

    try {
      const result = await commitToGitHub(
        `src/data/${type}.json`,
        jsonContent,
        `עדכון תוכן: ${CONTENT_TYPES[type].label} (מהדשבורד)`,
      );
      return res.json({ ok: true, ...result });
    } catch (err) {
      return res.status(200).json({
        ok: true,
        committed: false,
        warning: `נשמר מקומית, אבל הפרסום ל-GitHub נכשל: ${String(err?.message || err)}`,
      });
    }
  });
}
