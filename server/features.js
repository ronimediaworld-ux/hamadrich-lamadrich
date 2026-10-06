import crypto from 'node:crypto';

// פיצ'רים שהמשתמשים יוצרים: צפיות בתכנים, ספירת כניסות לאתר, תגובות (באישור מראש) והצעות פעולות.
// הכול נשמר דרך store.js. ללא מפתחות/אימות משתמשים — לכן יש הגבלות קצב וסינון בסיסי.

const KINDS = new Set(['activity', 'reading', 'chupar', 'staff-study', 'situation', 'method']);
const ID_RE = /^[\w\-֐-׿.]{1,120}$/;
const SUBMISSION_FILE_MAX = 700 * 1024; // בתים אחרי פענוח
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'text/plain',
]);

// שליחת מייל דרך Resend (אופציונלי). מוגדר ב-RESEND_API_KEY; ברירת מחדל לשולח: onboarding@resend.dev (שולח רק לבעלת החשבון).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || 'המדריך למדריך <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

async function sendMail({ to, subject, text, html, attachments, bcc }) {
  if (!RESEND_API_KEY) return { sent: false, reason: 'no_api_key' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: MAIL_FROM, to, bcc, subject, text, html, attachments }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return { sent: true };
}

function israelDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d);
}

// הגבלת קצב בזיכרון: מפתח → חותמות זמן
const hits = new Map();
function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return false;
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

function cleanText(s, max) {
  return String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

export function registerFeatureRoutes(app, { store, requireAdmin }) {
  // ---------- צפיות ----------
  app.post('/api/track', async (req, res) => {
    const { kind, id } = req.body ?? {};
    if (!KINDS.has(kind) || typeof id !== 'string' || !ID_RE.test(id)) return res.status(400).json({ error: 'bad_request' });
    try {
      if (rateLimited(`view|${clientIp(req)}|${kind}:${id}`, 1, 30 * 60 * 1000)) {
        const count = Number((await store.hget('views', `${kind}:${id}`)) ?? 0);
        return res.json({ count, counted: false });
      }
      const count = await store.hincr('views', `${kind}:${id}`);
      return res.json({ count, counted: true });
    } catch (err) {
      console.error('track failed', err?.message);
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // כל הספירות בבת אחת (להצגה על כרטיסי פעולות ברשימות). מידע ציבורי — רק מספרים.
  app.get('/api/views-all', async (_req, res) => {
    try {
      const all = await store.hgetall('views');
      const out = {};
      for (const [k, v] of Object.entries(all)) out[k] = Number(v);
      res.setHeader('Cache-Control', 'no-store');
      return res.json({ views: out });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.get('/api/views/:kind/:id', async (req, res) => {
    const { kind, id } = req.params;
    if (!KINDS.has(kind) || !ID_RE.test(id)) return res.status(400).json({ error: 'bad_request' });
    try {
      return res.json({ count: Number((await store.hget('views', `${kind}:${id}`)) ?? 0) });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // ---------- כניסות לאתר (נספר פעם ביום לכל דפדפן; הצגה רק למנהלת) ----------
  app.post('/api/visit', async (req, res) => {
    try {
      if (rateLimited(`visit|${clientIp(req)}`, 6, 60 * 60 * 1000)) return res.json({ ok: true, counted: false });
      const day = israelDate();
      await store.hincr('visits', 'total');
      await store.hincr('visits-day', day);
      return res.json({ ok: true, counted: true });
    } catch (err) {
      console.error('visit failed', err?.message);
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // ---------- תגובות ----------
  app.get('/api/comments/:kind/:id', async (req, res) => {
    const { kind, id } = req.params;
    if (!KINDS.has(kind) || !ID_RE.test(id)) return res.status(400).json({ error: 'bad_request' });
    try {
      const all = await store.hgetall('comments');
      const list = Object.values(all)
        .map((v) => { try { return JSON.parse(v); } catch { return null; } })
        .filter((c) => c && c.kind === kind && c.targetId === id && c.status === 'approved')
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(({ id: cid, name, text, createdAt }) => ({ id: cid, name, text, createdAt }));
      return res.json({ comments: list });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.post('/api/comments', async (req, res) => {
    const { kind, targetId, name, text, website } = req.body ?? {};
    if (website) return res.json({ ok: true }); // honeypot — בוטים ממלאים שדה "נסתר"
    if (!KINDS.has(kind) || typeof targetId !== 'string' || !ID_RE.test(targetId)) return res.status(400).json({ error: 'bad_request' });
    const cleanName = cleanText(name, 40) || 'מדריך/ה';
    const cleanBody = cleanText(text, 600);
    if (cleanBody.length < 2) return res.status(400).json({ error: 'empty', message: 'כתבו כמה מילים לפני השליחה.' });
    if (/(https?:\/\/|www\.)/i.test(cleanBody)) return res.status(400).json({ error: 'links', message: 'אי אפשר להוסיף קישורים בתגובות.' });
    if (rateLimited(`comment|${clientIp(req)}`, 4, 15 * 60 * 1000)) return res.status(429).json({ error: 'slow_down', message: 'שלחתם כמה תגובות ברצף — נסו שוב בעוד כמה דקות.' });
    try {
      const cid = crypto.randomBytes(8).toString('hex');
      await store.hset('comments', cid, JSON.stringify({ id: cid, kind, targetId, name: cleanName, text: cleanBody, createdAt: Date.now(), status: 'pending' }));
      return res.json({ ok: true, pending: true });
    } catch (err) {
      console.error('comment failed', err?.message);
      return res.status(500).json({ error: 'store_failed', message: 'לא הצלחנו לשמור את התגובה — נסו שוב.' });
    }
  });

  app.get('/api/admin/comments', requireAdmin, async (req, res) => {
    const status = req.query.status === 'approved' ? 'approved' : 'pending';
    try {
      const all = await store.hgetall('comments');
      const list = Object.values(all).map((v) => { try { return JSON.parse(v); } catch { return null; } })
        .filter((c) => c && c.status === status).sort((a, b) => b.createdAt - a.createdAt);
      return res.json({ comments: list });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.post('/api/admin/comments/:cid/approve', requireAdmin, async (req, res) => {
    try {
      const raw = await store.hget('comments', req.params.cid);
      if (!raw) return res.status(404).json({ error: 'not_found' });
      const c = JSON.parse(raw);
      c.status = 'approved';
      await store.hset('comments', c.id, JSON.stringify(c));
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.delete('/api/admin/comments/:cid', requireAdmin, async (req, res) => {
    try {
      await store.hdel('comments', req.params.cid);
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // ---------- הצעות פעולות ----------
  app.post('/api/submissions', async (req, res) => {
    const { name, contact, title, body, file, website } = req.body ?? {};
    if (website) return res.json({ ok: true });
    const clean = {
      name: cleanText(name, 80),
      contact: cleanText(contact, 120),
      title: cleanText(title, 140),
      body: cleanText(body, 8000),
    };
    if (clean.body.length < 10) return res.status(400).json({ error: 'empty', message: 'כתבו לפחות כמה משפטים על הפעולה.' });
    if (!clean.contact) return res.status(400).json({ error: 'no_contact', message: 'השאירו טלפון או מייל כדי שנוכל לחזור אליכם.' });
    if (rateLimited(`submit|${clientIp(req)}`, 5, 60 * 60 * 1000)) return res.status(429).json({ error: 'slow_down', message: 'נשלחו כמה הצעות ברצף — נסו שוב מאוחר יותר.' });

    let attachment = null;
    if (file && typeof file === 'object' && file.data) {
      const type = String(file.type || '');
      const buf = Buffer.from(String(file.data), 'base64');
      if (!ALLOWED_FILE_TYPES.has(type)) return res.status(400).json({ error: 'file_type', message: 'אפשר לצרף PDF, Word, תמונה או קובץ טקסט.' });
      if (buf.length > SUBMISSION_FILE_MAX) return res.status(400).json({ error: 'file_big', message: 'הקובץ גדול מדי (עד כ-700KB). אפשר לשלוח אותו במייל.' });
      attachment = { name: cleanText(file.name, 120) || 'file', type, data: String(file.data), size: buf.length };
    }
    try {
      const sid = crypto.randomBytes(8).toString('hex');
      await store.hset('submissions', sid, JSON.stringify({ id: sid, ...clean, createdAt: Date.now(), attachment }));
      // התראה למייל של המנהלת (אם הוגדר) — לא חוסמת את התשובה למשתמש
      if (NOTIFY_EMAIL) {
        sendMail({
          to: NOTIFY_EMAIL,
          subject: `הצעת פעולה חדשה: ${clean.title || 'ללא שם'}`,
          text: `שם: ${clean.name || '—'}\nליצירת קשר: ${clean.contact}\nשם הפעולה: ${clean.title || '—'}\n\n${clean.body}\n\nאפשר לראות את ההצעה בדשבורד הניהול של האתר.`,
          attachments: attachment ? [{ filename: attachment.name, content: attachment.data }] : undefined,
        }).catch((err) => console.error('notify mail failed', err?.message));
      }
      return res.json({ ok: true });
    } catch (err) {
      console.error('submission failed', err?.message);
      return res.status(500).json({ error: 'store_failed', message: 'לא הצלחנו לשמור את ההצעה — נסו שוב, או שלחו במייל.' });
    }
  });

  app.get('/api/admin/submissions', requireAdmin, async (_req, res) => {
    try {
      const all = await store.hgetall('submissions');
      const list = Object.values(all).map((v) => { try { return JSON.parse(v); } catch { return null; } })
        .filter(Boolean).sort((a, b) => b.createdAt - a.createdAt)
        .map((s) => ({ ...s, attachment: s.attachment ? { name: s.attachment.name, type: s.attachment.type, size: s.attachment.size } : null }));
      return res.json({ submissions: list });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.get('/api/admin/submissions/:sid/file', requireAdmin, async (req, res) => {
    try {
      const raw = await store.hget('submissions', req.params.sid);
      if (!raw) return res.status(404).end();
      const s = JSON.parse(raw);
      if (!s.attachment) return res.status(404).end();
      res.setHeader('Content-Type', s.attachment.type);
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(s.attachment.name)}`);
      return res.send(Buffer.from(s.attachment.data, 'base64'));
    } catch {
      return res.status(500).end();
    }
  });

  app.delete('/api/admin/submissions/:sid', requireAdmin, async (req, res) => {
    try {
      await store.hdel('submissions', req.params.sid);
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // ---------- דירוג "איך הלך?" ----------
  app.post('/api/rate', async (req, res) => {
    const { kind, id, stars } = req.body ?? {};
    const n = Number(stars);
    if (!KINDS.has(kind) || typeof id !== 'string' || !ID_RE.test(id) || !Number.isInteger(n) || n < 1 || n > 5) return res.status(400).json({ error: 'bad_request' });
    try {
      if (rateLimited(`rate|${clientIp(req)}|${kind}:${id}`, 1, 24 * 60 * 60 * 1000)) return res.status(429).json({ error: 'already', message: 'כבר דירגתם את הפעולה הזאת היום.' });
      const key = `${kind}:${id}`;
      const [sum, count] = await Promise.all([store.hincr('rate-sum', key, n), store.hincr('rate-count', key, 1)]);
      return res.json({ avg: sum / count, count });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.get('/api/ratings/:kind/:id', async (req, res) => {
    const { kind, id } = req.params;
    if (!KINDS.has(kind) || !ID_RE.test(id)) return res.status(400).json({ error: 'bad_request' });
    try {
      const key = `${kind}:${id}`;
      const [sum, count] = await Promise.all([store.hget('rate-sum', key), store.hget('rate-count', key)]);
      const c = Number(count ?? 0);
      return res.json({ avg: c ? Number(sum) / c : 0, count: c });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // ---------- הרשמה לעדכון שבועי ----------
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  app.post('/api/subscribe', async (req, res) => {
    const { email, name, website } = req.body ?? {};
    if (website) return res.json({ ok: true });
    const clean = cleanText(email, 120).toLowerCase();
    if (!EMAIL_RE.test(clean)) return res.status(400).json({ error: 'bad_email', message: 'כתובת המייל לא נראית תקינה.' });
    if (rateLimited(`sub|${clientIp(req)}`, 5, 60 * 60 * 1000)) return res.status(429).json({ error: 'slow_down', message: 'נסו שוב מאוחר יותר.' });
    try {
      await store.hset('subscribers', clean, JSON.stringify({ email: clean, name: cleanText(name, 60), createdAt: Date.now() }));
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'store_failed', message: 'לא הצלחנו לשמור — נסו שוב.' });
    }
  });

  app.get('/api/admin/subscribers', requireAdmin, async (_req, res) => {
    try {
      const all = await store.hgetall('subscribers');
      const list = Object.values(all).map((v) => { try { return JSON.parse(v); } catch { return null; } }).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
      return res.json({ subscribers: list, mailConfigured: !!RESEND_API_KEY, notifyConfigured: !!NOTIFY_EMAIL });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  app.get('/api/admin/subscribers.csv', requireAdmin, async (_req, res) => {
    try {
      const all = await store.hgetall('subscribers');
      const rows = Object.values(all).map((v) => { try { return JSON.parse(v); } catch { return null; } }).filter(Boolean);
      const csv = '\uFEFFemail,name,date\n' + rows.map((r) => `${r.email},"${(r.name || '').replace(/"/g, '""')}",${new Date(r.createdAt).toISOString().slice(0, 10)}`).join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
      return res.send(csv);
    } catch {
      return res.status(500).end();
    }
  });

  app.delete('/api/admin/subscribers/:email', requireAdmin, async (req, res) => {
    try {
      await store.hdel('subscribers', decodeURIComponent(req.params.email).toLowerCase());
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });

  // שליחת המייל השבועי לכל הנרשמים (התוכן מורכב באתר, בדשבורד). דורש RESEND_API_KEY ודומיין מאומת ב-Resend.
  app.post('/api/admin/send-weekly', requireAdmin, async (req, res) => {
    const { subject, text, html } = req.body ?? {};
    if (!subject || !text) return res.status(400).json({ error: 'bad_request', message: 'חסר נושא או תוכן.' });
    if (!RESEND_API_KEY) return res.status(503).json({ error: 'no_mail', message: 'שליחת מיילים לא הוגדרה בשרת (RESEND_API_KEY).' });
    try {
      const all = await store.hgetall('subscribers');
      const emails = Object.keys(all);
      if (emails.length === 0) return res.status(400).json({ error: 'no_subscribers', message: 'אין עדיין נרשמים.' });
      let sent = 0;
      for (let i = 0; i < emails.length; i += 40) {
        const batch = emails.slice(i, i + 40);
        await sendMail({ to: NOTIFY_EMAIL || batch[0], bcc: batch, subject: String(subject).slice(0, 150), text: String(text).slice(0, 20000), html: html ? String(html).slice(0, 60000) : undefined });
        sent += batch.length;
      }
      return res.json({ ok: true, sent });
    } catch (err) {
      console.error('send-weekly failed', err?.message);
      return res.status(500).json({ error: 'send_failed', message: 'השליחה נכשלה: ' + String(err?.message || err).slice(0, 200) });
    }
  });

  // מצב המערכת: מה מוגדר ומה עוד חסר (להצגה בדשבורד)
  app.get('/api/admin/health', requireAdmin, (req, res) => {
    res.json({
      storage: store.kind,
      githubConnected: !!process.env.GITHUB_TOKEN,
      mailConfigured: !!RESEND_API_KEY,
      notifyConfigured: !!NOTIFY_EMAIL,
      aiConfigured: !!(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY),
      siteUrl: process.env.SITE_URL || `${req.protocol}://${req.get('host')}`,
      production: process.env.NODE_ENV === 'production',
    });
  });

  // ---------- סטטיסטיקה (רק למנהלת) ----------
  app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
    try {
      const [visits, days, views, comments, submissions, rateSum, rateCount, subscribers] = await Promise.all([
        store.hgetall('visits'), store.hgetall('visits-day'), store.hgetall('views'), store.hgetall('comments'), store.hgetall('submissions'),
        store.hgetall('rate-sum'), store.hgetall('rate-count'), store.hgetall('subscribers'),
      ]);
      const ratings = Object.entries(rateCount).map(([key, c]) => ({ key, count: Number(c), avg: Number(rateSum[key] ?? 0) / Number(c) }))
        .sort((a, b) => b.count - a.count).slice(0, 25);
      const today = israelDate();
      const last = [];
      for (let i = 13; i >= 0; i--) {
        const d = israelDate(new Date(Date.now() - i * 86400000));
        last.push({ date: d, count: Number(days[d] ?? 0) });
      }
      const topViews = Object.entries(views).map(([key, count]) => ({ key, count: Number(count) }))
        .sort((a, b) => b.count - a.count).slice(0, 25);
      const pendingComments = Object.values(comments).filter((v) => { try { return JSON.parse(v).status === 'pending'; } catch { return false; } }).length;
      return res.json({
        storage: store.kind,
        visitsTotal: Number(visits.total ?? 0),
        visitsToday: Number(days[today] ?? 0),
        last14: last,
        topViews,
        totalViews: Object.values(views).reduce((s, n) => s + Number(n), 0),
        pendingComments,
        submissionsCount: Object.keys(submissions).length,
        subscribersCount: Object.keys(subscribers).length,
        ratings,
      });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });
}
