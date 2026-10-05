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

  // ---------- סטטיסטיקה (רק למנהלת) ----------
  app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
    try {
      const [visits, days, views, comments, submissions] = await Promise.all([
        store.hgetall('visits'), store.hgetall('visits-day'), store.hgetall('views'), store.hgetall('comments'), store.hgetall('submissions'),
      ]);
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
      });
    } catch {
      return res.status(500).json({ error: 'store_failed' });
    }
  });
}
