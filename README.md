# המדריך למדריך

מאגר פעולות, משחקים, מתודות וקטעי קריאה למדריכות ולמדריכים בתנועות הנוער — עם עוזר AI, רעיונות לצ'ופרים והורדה להדפסה.

## הרצה מקומית

```bash
npm install
cp .env.example .env   # הוסיפו GEMINI_API_KEY (חינמי, מ-aistudio.google.com) כדי להפעיל את עוזר ה-AI
npm run dev:full        # מריץ גם את ה-frontend (Vite) וגם את השרת יחד
```

האתר ייפתח בכתובת `http://localhost:5173`.

להרצה נפרדת של כל חלק:

```bash
npm run dev      # רק ה-frontend
npm run server   # רק שרת ה-API
```

## בנייה לפרודקשן

```bash
npm run build   # מייצר sitemap.xml, מריץ בדיקת טיפוסים, ובונה לתיקיית dist/
npm start        # מריץ שרת פרודקשן שמגיש גם את ה-frontend וגם את ה-API
```

## פריסה לאוויר

הפרויקט כולל `render.yaml` לפריסה קלה ב-[Render](https://render.com) (שכבה חינמית):

1. מפתח AI חינמי: [aistudio.google.com](https://aistudio.google.com) → Get API key
2. דחפו את הפרויקט ל-GitHub
3. ב-Render: New + → Blueprint → בחרו את ה-repo
4. הזינו את `GEMINI_API_KEY` כשמתבקשים
5. Apply — האתר יעלה לאוויר בכתובת `https://<שם-השירות>.onrender.com`

## נתונים שנוצרים באתר: צפיות, תגובות, הצעות פעולות וסטטיסטיקה

האתר סופר צפיות בתכנים, כניסות לאתר (רק המנהלת רואה), תגובות על פעולות (מופיעות אחרי אישור), והצעות פעולות שנשלחות דרך הטופס (כולל קובץ מצורף).
את הכול רואים בדשבורד: `/admin` → "סטטיסטיקה, הצעות ותגובות". לכניסה צריך להגדיר `ADMIN_PASSWORD`.

**איפה הנתונים נשמרים:**
- ללא הגדרה נוספת — בקובץ מקומי (`data/store.json`). טוב לפיתוח, אבל בשירות החינמי של Render הקובץ נמחק בכל פריסה והרדמה.
- **מומלץ בפרודקשן:** חשבון חינמי ב-[upstash.com](https://upstash.com) (Redis) → Create Database → מעתיקים את `REST URL` ואת `REST Token` ל-Render:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

  ואז הכול נשמר לתמיד, גם אחרי פריסות חדשות.

## התראות ומיילים (אופציונלי)

- **התראה על הצעת פעולה חדשה:** מגדירים `RESEND_API_KEY` ו-`NOTIFY_EMAIL` (המייל שלך) — כל הצעה שתישלח תגיע גם אליך למייל, כולל הקובץ המצורף. חשבון חינמי ב-[resend.com](https://resend.com).
- **מייל שבועי לנרשמים:** בדשבורד (`/admin` ← "נרשמים ומייל שבועי") מרכיבים מייל של פעולות הפרשה ושולחים. כדי לשלוח לאנשים אחרים (ולא רק אליך) צריך לאמת דומיין ב-Resend ולהגדיר `MAIL_FROM` (למשל `המדריך למדריך <hello@your-domain.com>`).

## חיפוש בגוגל (SEO)

השרת מגיש לכל עמוד כותרת, תיאור, canonical ו-Open Graph משלו (גם בלי JavaScript), תוכן בסיסי לזחלנים ונתוני JSON-LD, ומייצר `sitemap.xml` ו-`robots.txt` אוטומטית עם כל הפעולות, קטעי הקריאה, הצ׳ופרים ולימוד הצוות. עמודי ניהול, חיפוש פנימי ומועדפים מסומנים noindex.

אחרי שהאתר עולה:
1. ב-Render מגדירים `SITE_URL` לכתובת האמיתית (למשל `https://hamadrich-lamadrich.onrender.com` או הדומיין שלך).
2. נכנסים ל-[Google Search Console](https://search.google.com/search-console), מוסיפים את האתר ("Domain" או "URL prefix") ומאמתים בעלות (המלצה: שיטת תג HTML — מדביקים את התג ב-`index.html`, או DNS אם יש דומיין).
3. שולחים את `https://<הכתובת>/sitemap.xml` ב-Sitemaps. גוגל מתחיל לסרוק תוך ימים עד שבועות.
4. מומלץ דומיין משלך (למשל `.co.il`) — קל יותר לזכור ולדרג, ומחברים אותו ב-Render ← Settings ← Custom Domains.

## מבנה הפרויקט

- `src/data/` — כל תוכן האתר (פעולות, צ'ופרים, סיטואציות, מתודות, קטעי קריאה, לימוד צוות)
- `src/pages/` — עמודי האתר
- `src/components/` — רכיבים משותפים
- `server/` — שרת Express שמפעיל את עוזר ה-AI (Gemini/Claude) ומגיש את ה-build בפרודקשן
- `scripts/generate-sitemap.mjs` — מייצר `public/sitemap.xml` אוטומטית מתוכן האתר בכל build
