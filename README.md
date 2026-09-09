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

## מבנה הפרויקט

- `src/data/` — כל תוכן האתר (פעולות, צ'ופרים, סיטואציות, מתודות, קטעי קריאה, לימוד צוות)
- `src/pages/` — עמודי האתר
- `src/components/` — רכיבים משותפים
- `server/` — שרת Express שמפעיל את עוזר ה-AI (Gemini/Claude) ומגיש את ה-build בפרודקשן
- `scripts/generate-sitemap.mjs` — מייצר `public/sitemap.xml` אוטומטית מתוכן האתר בכל build
