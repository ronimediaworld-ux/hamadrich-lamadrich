import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerAdminRoutes } from './admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '5mb' }));

registerAdminRoutes(app, path.join(__dirname, '..'));

const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

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
  const delays = [800, 2000];
  let lastErr = 'unknown';
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
        25000,
      );
      if (response.ok) return response.json();

      lastErr = `${response.status}: ${await response.text()}`;
      const retryable = response.status === 503 || response.status === 429 || response.status >= 500;
      if (!retryable || attempt === delays.length) {
        throw new Error(`Gemini API error ${lastErr}`);
      }
    } catch (err) {
      // network error / abort / timeout — retry unless we're out of attempts
      lastErr = err?.message || String(err);
      if (attempt === delays.length) throw new Error(`Gemini request failed: ${lastErr}`);
    }
    await sleep(delays[attempt]);
  }
  throw new Error(`Gemini request failed: ${lastErr}`);
}

async function callGemini(query) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const data = await fetchGeminiWithRetry(url, {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts: [{ text: `בקשת המדריך/ה: ${query}` }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callGeminiChat(messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const data = await fetchGeminiWithRetry(url, {
    systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
    contents,
  });
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
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

app.post('/api/generate-activity', async (req, res) => {
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
    return res.status(500).json({ error: 'generation_failed', message: 'לא הצלחנו ליצור פעולה כרגע. נסו לנסח מחדש את הבקשה.' });
  }
});

app.post('/api/chat', async (req, res) => {
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
    return res.status(500).json({ error: 'chat_failed', message: 'לא הצלחנו לקבל תשובה כרגע. נסו שוב בעוד רגע.' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
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
