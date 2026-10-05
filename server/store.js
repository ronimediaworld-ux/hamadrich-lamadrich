import fs from 'node:fs';
import path from 'node:path';

// שכבת אחסון פשוטה לנתונים שנוצרים באתר עצמו (צפיות, כניסות, תגובות, הצעות פעולות).
// - אם הוגדרו UPSTASH_REDIS_REST_URL ו-UPSTASH_REDIS_REST_TOKEN — הנתונים נשמרים ב-Redis חינמי בענן (שורדים הפעלה מחדש של השרת).
// - אחרת — נשמרים בקובץ JSON מקומי (DATA_DIR, ברירת מחדל: תיקיית data). מתאים לפיתוח ולשרת עם דיסק קבוע.
//   שימו לב: בשירות חינמי של Render הקבצים נמחקים בכל פריסה/הרדמה, ולכן שם מומלץ Upstash.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command) {
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

function createRedisStore() {
  return {
    kind: 'upstash',
    async hincr(hash, field, by = 1) { return Number(await redis(['HINCRBY', hash, field, by])); },
    async hget(hash, field) { return (await redis(['HGET', hash, field])) ?? null; },
    async hset(hash, field, value) { await redis(['HSET', hash, field, value]); },
    async hdel(hash, field) { await redis(['HDEL', hash, field]); },
    async hgetall(hash) {
      const arr = (await redis(['HGETALL', hash])) ?? [];
      const out = {};
      for (let i = 0; i < arr.length; i += 2) out[arr[i]] = arr[i + 1];
      return out;
    },
  };
}

function createFileStore(rootDir) {
  const dir = process.env.DATA_DIR || path.join(rootDir, 'data');
  const file = path.join(dir, 'store.json');
  let db = {};
  try {
    db = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    db = {};
  }
  let timer = null;
  function persist() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      try {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(db), 'utf8');
      } catch (err) {
        console.error('store write failed', err?.message);
      }
    }, 400);
  }
  const hash = (h) => (db[h] ??= {});
  return {
    kind: 'file',
    async hincr(h, field, by = 1) { const o = hash(h); o[field] = Number(o[field] ?? 0) + by; persist(); return o[field]; },
    async hget(h, field) { return hash(h)[field] ?? null; },
    async hset(h, field, value) { hash(h)[field] = value; persist(); },
    async hdel(h, field) { delete hash(h)[field]; persist(); },
    async hgetall(h) { return { ...hash(h) }; },
  };
}

export function createStore(rootDir) {
  return REST_URL && REST_TOKEN ? createRedisStore() : createFileStore(rootDir);
}
