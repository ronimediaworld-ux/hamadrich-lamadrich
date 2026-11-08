import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerAdminRoutes, requireAdmin } from './admin.js';
import { createStore } from './store.js';
import { registerFeatureRoutes } from './features.js';
import { registerSeoRoutes } from './seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '5mb' }));

registerAdminRoutes(app, path.join(__dirname, '..'));
app.set('trust proxy', true);

// אחרי שהדומיין האמיתי עובד: כל כניסה דרך onrender.com או www עוברת (301) לכתובת הראשית, כך שגוגל רואה אתר אחד בלבד.
// מופעל רק כש-FORCE_CANONICAL_HOST=true וגם SITE_URL מוגדר — כדי שלא יינעל הגישה לפני שהדומיין מחובר.
if (process.env.FORCE_CANONICAL_HOST === 'true' && process.env.SITE_URL) {
  const siteUrl = new URL(process.env.SITE_URL);
  app.use((req, res, next) => {
    const host = (req.headers.host || '').toLowerCase();
    const wrongHost = host !== siteUrl.host && (host.endsWith('.onrender.com') || host === `www.${siteUrl.host}`);
    if (wrongHost && (req.method === 'GET' || req.method === 'HEAD')) return res.redirect(301, siteUrl.origin + req.originalUrl);
    return next();
  });
}
registerFeatureRoutes(app, { store: createStore(path.join(__dirname, '..')), requireAdmin });

const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// אם שם המודל כבר לא קיים (גוגל מחליפה דגמים), מנסים את הבא ברשימה. gemini-flash-latest תמיד מצביע על ה-Flash העדכני.
// בדקתי: gemini-3.6-flash מגיב תוך כשתי שניות; gemini-flash-latest נתקע, ו-gemini-2.5-flash כבר לא זמין. לכן הסדר הזה.
const GEMINI_MODELS = [...new Set([process.env.GEMINI_MODEL, 'gemini-3.6-flash', 'gemini-flash-latest'].filter(Boolean))];
let GEMINI_MODEL = GEMINI_MODELS[0];

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

const SYSTEM_PROMPT = `אתה "ניצוץ" — עורך תוכן חינוכי ותיק ומנוסה לתנועות נוער, לא צ'אט כללי.
אתה כותב פעולות חדשות רק כאשר מבקשים ממך זאת במפורש, לאחר שכבר נבדק שאין תוכן מתאים במאגר הקיים.

עקרונות מחייבים:
- כתוב תמיד בעברית, מותאם לגיל שצוין.
- אל תכתוב תוכן אמוני או ערכי שטחי או סיסמאתי — עומק אמיתי, מתאים לגיל.
- אם התבקשה פעולה לשבת: אסור לכלול מתודות שדורשות כתיבה, טלפון, הקרנה או יצירה אסורה. אם התבקשה גם וגם, ציין התאמות נדרשות.
- גוון את סוג המתודה (לא תמיד "משחק ואז דיון") — בחר מתוך: משחק, סיפור, דילמה, בחירה בין אפשרויות, משימה קבוצתית, סימולציה, דיון, תנועה, חידה, כרטיסיות, משחק תפקידים, ציר עמדות, תחנות.
- מטרות חייבות להיות ממוקדות ומעשיות, לא כלליות כמו "החניכים ילמדו על X".
- שאלות הדיון צריכות להתקדם בהדרגה, לא רק "מה אתם חושבים?".
- אל תיצור פעולה גנרית — היא צריכה להרגיש כתובה במיוחד לבקשה שהתקבלה.

החזר אך ורק אובייקט JSON תקין (ללא טקסט נוסף, ללא markdown fences) בדיוק במבנה הבא:
{
  "title": "string",
  "ageLabel": "string (לדוגמה: \\"כיתה ז'-ח'\\")",
  "duration": number (בדקות),
  "groupSize": "string",
  "equipment": ["string", ...] (מערך ריק אם אין ציוד),
  "shabbat": "שבת" | "חול" | "שניהם",
  "shabbatNote": "string (רק אם shabbat הוא שניהם והמתודה דורשת התאמה, אחרת השמט שדה זה)",
  "description": "string (משפט או שניים)",
  "goals": ["string", ...] (2-3 מטרות ממוקדות),
  "opening": "string",
  "game": "string (השמט שדה זה אם אין משחק מתאים)",
  "method": "string",
  "discussion": ["string", ...] (2-4 שאלות מתקדמות),
  "guideNotes": "string (הסבר למדריך)",
  "summary": "string",
  "tip": "string (טיפ מעשי למדריך)"
}`;

const CHAT_SYSTEM_PROMPT = `אתה "ניצוץ" — עוזר AI חם, בקיא ומועיל באתר "המדריך למדריך", אתר שנועד למדריכות ומדריכים בתנועות נוער.
אתה יכול לענות על כל שאלה שמדריך/ה עשוי/ה לשאול — לא רק ליצור פעולות: עצות הדרכה, התמודדות עם חניכים, רעיונות לצ'ופרים, שאלות כלליות, או סתם שיחה.
כשמבקשים ממך במפורש ליצור פעולה חדשה, בנה אותה במבנה מלא: מטרות, פתיחה, משחק/מתודה, דיון, הסבר למדריך, סיכום וטיפ.
כתוב תמיד בעברית, בטון חם וישיר, בלי להיות מיותר ארוך. אתה חלק מאתר של רוני גרוס עבור מדריכי תנועות נוער בישראל.`;

function activeProvider() {
  if (GEMINI_API_KEY) return 'gemini';
  if (ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Gemini occasionally returns a transient 503 ("high demand"), hangs, or drops the
// connection — worth a couple of quick retries before giving up, since the exact
// same request usually succeeds seconds later.
async function fetchGeminiWithRetry(url, body) {
  const delays = [800, 2000, 6000];
  let lastErr = 'unknown';
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    let wait = delays[attempt];
    try {
      const response = await fetchWithTimeout(
        url,
        { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
        25000,
      );
      if (response.ok) return response.json();

      const text = await response.text();
      lastErr = `${response.status}: ${text}`;
      // מכסה מלאה (429): גוגל מציינת כמה לחכות. מחכים (עד 20 שניות) ומנסים שוב, ולא נכשלים מיד.
      if (response.status === 429) {
        // מכסה יומית נגמרה: אין טעם לחכות ולנסות שוב
        if (/PerDay|per day/i.test(text)) throw Object.assign(new Error(`Gemini API error ${lastErr}`), { code: 'daily_quota' });
        const m = text.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
        wait = Math.min(20000, Math.max(3000, m ? Number(m[1]) * 1000 + 500 : 8000));
      }
      const retryable = response.status === 503 || response.status === 429 || response.status >= 500;
      if (!retryable || attempt === delays.length) {
        throw new Error(`Gemini API error ${lastErr}`);
      }
    } catch (err) {
      // network error / abort / timeout — retry unless we're out of attempts
      if (err?.code === 'daily_quota') throw err;
      lastErr = err?.message || String(err);
      if (attempt === delays.length || /Gemini API error/.test(lastErr) && !/ 429:| 503:| 5\d\d:/.test(lastErr)) throw new Error(/^Gemini/.test(lastErr) ? lastErr : `Gemini request failed: ${lastErr}`);
    }
    await sleep(wait);
  }
  throw new Error(`Gemini request failed: ${lastErr}`);
}

// תור גלובלי: לא יותר מכמה פניות במקביל ל-Gemini (כדי לא להישבר כשהרבה מבקרים שואלים יחד), והשאר ממתינים בתור
const AI_MAX_CONCURRENT = Number(process.env.AI_MAX_CONCURRENT || 3);
const AI_MAX_QUEUE = Number(process.env.AI_MAX_QUEUE || 60);
let aiRunning = 0;
const aiQueue = [];
function aiGate(task) {
  return new Promise((resolve, reject) => {
    if (aiQueue.length >= AI_MAX_QUEUE) return reject(Object.assign(new Error('queue_full'), { code: 'queue_full' }));
    const run = () => {
      aiRunning++;
      task().then(resolve, reject).finally(() => { aiRunning--; const next = aiQueue.shift(); if (next) next(); });
    };
    if (aiRunning < AI_MAX_CONCURRENT) run(); else aiQueue.push(run);
  });
}

// זיכרון תשובות לשאלות זהות (שאלה בודדת, ללא היסטוריה), כדי שמבקרים שונים עם אותה שאלה לא יצרכו מכסה
const aiCache = new Map();
const AI_CACHE_MS = 6 * 60 * 60 * 1000;
function cacheKey(kind, text) { return `${kind}|${String(text).trim().replace(/\s+/g, ' ').toLowerCase().slice(0, 400)}`; }
function cacheGet(k) { const e = aiCache.get(k); if (e && Date.now() - e.t < AI_CACHE_MS) return e.v; aiCache.delete(k); return null; }
function cacheSet(k, v) { if (aiCache.size > 300) aiCache.delete(aiCache.keys().next().value); aiCache.set(k, { t: Date.now(), v }); }

async function geminiGenerate(body) {
  return aiGate(() => geminiGenerateNow(body));
}

async function geminiGenerateNow(body) {
  let lastErr;
  for (const model of [GEMINI_MODEL, ...GEMINI_MODELS.filter((m) => m !== GEMINI_MODEL)]) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const data = await fetchGeminiWithRetry(url, body);
      GEMINI_MODEL = model; // המודל שעבד נשמר לבקשות הבאות
      return data;
    } catch (err) {
      lastErr = err;
      if (err?.code === 'daily_quota' || !/\b404\b|NOT_FOUND|not found|not supported/i.test(String(err?.message))) throw err;
    }
  }
  throw lastErr;
}

async function callGemini(query) {
  const data = await geminiGenerate({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts: [{ text: `בקשת המדריך/ה: ${query}` }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callGeminiChat(messages) {
  const single = messages.length === 1 ? cacheKey('chat', messages[0].content) : null;
  const hit = single && cacheGet(single);
  if (hit) return hit;
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const data = await geminiGenerate({
    systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
    contents,
  });
  const out = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (single && out) cacheSet(single, out);
  return out;
}

async function callAnthropicChat(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1200,
      system: CHAT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }
  const data = await response.json();
  return data?.content?.[0]?.text ?? '';
}

async function callAnthropic(query) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `בקשת המדריך/ה: ${query}` }],
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }
  const data = await response.json();
  return data?.content?.[0]?.text ?? '';
}

// הגבלת קצב לפי כתובת: כך שמבקר אחד לא יוכל לרוקן את המכסה של כולם
const aiHits = new Map();
function aiLimited(req, kind, max, windowMs) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const key = `${kind}|${ip}`;
  const now = Date.now();
  const arr = (aiHits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { aiHits.set(key, arr); return true; }
  arr.push(now);
  aiHits.set(key, arr);
  if (aiHits.size > 5000) aiHits.clear();
  return false;
}
const TOO_MANY = { error: 'slow_down', message: 'ניצוץ קיבל הרבה בקשות ממך בזמן קצר. נסו שוב בעוד כמה דקות.' };

app.post('/api/generate-activity', async (req, res) => {
  if (aiLimited(req, 'gen', 6, 10 * 60 * 1000)) return res.status(429).json(TOO_MANY);
  const { query } = req.body ?? {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'missing_query', message: 'חסר תיאור של הפעולה המבוקשת.' });
  }

  const provider = activeProvider();
  if (!provider) {
    return res.status(503).json({
      error: 'no_api_key',
      message: 'מפתח ה-API של מודל השפה לא הוגדר עדיין בשרת. הגדירו GEMINI_API_KEY (חינמי) או ANTHROPIC_API_KEY בקובץ .env כדי להפעיל יצירת תוכן חדש.',
    });
  }

  try {
    const raw = provider === 'gemini' ? await callGemini(query) : await callAnthropic(query);

    let generated;
    try {
      generated = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('no_json_found');
      generated = JSON.parse(match[0]);
    }

    return res.json({ activity: generated, source: 'ai', provider, model: provider === 'gemini' ? GEMINI_MODEL : ANTHROPIC_MODEL });
  } catch (err) {
    console.error('generate-activity failed', err);
    if (err?.code === 'daily_quota') return res.status(503).json({ error: 'quota', message: 'המכסה היומית החינמית של ה-AI נגמרה. נסו שוב מחר.' });
    return res.status(500).json({ error: 'generation_failed', message: 'לא הצלחנו ליצור פעולה כרגע. נסו לנסח מחדש את הבקשה.' });
  }
});

app.post('/api/chat', async (req, res) => {
  if (aiLimited(req, 'chat', 25, 10 * 60 * 1000)) return res.status(429).json(TOO_MANY);
  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'missing_messages', message: 'לא התקבלה שיחה תקינה.' });
  }

  const provider = activeProvider();
  if (!provider) {
    return res.status(503).json({
      error: 'no_api_key',
      message: 'מפתח ה-API של מודל השפה לא הוגדר עדיין בשרת. הגדירו GEMINI_API_KEY (חינמי) או ANTHROPIC_API_KEY בקובץ .env.',
    });
  }

  try {
    let reply;
    let usedProvider = provider;
    try {
      reply = provider === 'gemini' ? await callGeminiChat(messages) : await callAnthropicChat(messages);
    } catch (primaryErr) {
      // If the primary provider failed and the other one is configured, fall back to it.
      if (provider === 'gemini' && ANTHROPIC_API_KEY) {
        console.error('gemini chat failed, falling back to anthropic', primaryErr?.message);
        reply = await callAnthropicChat(messages);
        usedProvider = 'anthropic';
      } else {
        throw primaryErr;
      }
    }
    return res.json({ reply, provider: usedProvider, model: usedProvider === 'gemini' ? GEMINI_MODEL : ANTHROPIC_MODEL });
  } catch (err) {
    console.error('chat failed', err);
    if (err?.code === 'daily_quota') return res.status(503).json({ error: 'quota', message: 'ניצוץ הגיע למכסה היומית של השימוש החינמי. הוא יחזור לעבוד מחר, ובינתיים אפשר לחפש במאגר.' });
    if (err?.code === 'queue_full') return res.status(503).json({ error: 'busy', message: 'ניצוץ עמוס כרגע בגלל הרבה שאלות יחד. נסו שוב בעוד דקה.' });
    return res.status(500).json({ error: 'chat_failed', message: 'לא הצלחנו לקבל תשובה כרגע. נסו שוב בעוד רגע.' });
  }
});

// בדיקת חיבור ל-AI מתוך הדשבורד
app.post('/api/admin/ai-test', requireAdmin, async (_req, res) => {
  const provider = activeProvider();
  if (!provider) return res.json({ ok: false, message: 'לא הוגדר מפתח AI בשרת (GEMINI_API_KEY).' });
  try {
    const messages = [{ role: 'user', content: 'ענה במילה אחת בעברית: שלום' }];
    const reply = provider === 'gemini' ? await callGeminiChat(messages) : await callAnthropicChat(messages);
    return res.json({ ok: true, provider, model: provider === 'gemini' ? GEMINI_MODEL : ANTHROPIC_MODEL, reply: String(reply).slice(0, 80) });
  } catch (err) {
    return res.json({ ok: false, message: String(err?.message || err).slice(0, 300) });
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath, { index: false }));
  registerSeoRoutes(app, path.join(__dirname, '..'), distPath, process.env.SITE_URL);
}

app.listen(PORT, () => {
  console.log(`AI server listening on http://localhost:${PORT}`);
  const provider = activeProvider();
  if (!provider) {
    console.warn('No AI provider configured — set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY in .env to enable /api/generate-activity');
  } else {
    console.log(`Using AI provider: ${provider}`);
  }
});
