// קבצי PDF להורדה ולשמירה בקלסר. הקבצים עצמם ב-public/files.
export interface DownloadFile { id: string; title: string; sub: string; url: string; description: string }

export const downloadFiles: DownloadFile[] = [
  {
    id: 'glufot-vekirot',
    title: 'גלופות וקירות לנתקעים בדקה תשעים',
    sub: 'PDF להדפסה · 12 עמודים',
    url: '/files/glufot-vekirot.pdf',
    description: 'משפטים מוכנים לגלופות ולקירות הסניף: לפי שכבות, משפטים כלליים, תבניות למילוי וקירות. רק משפטים, בלי הסברים.',
  },
  {
    id: 'lila-lavan',
    title: 'מדריך לילה לבן בחודש ארגון',
    sub: 'PDF להדפסה · 3 עמודים',
    url: '/files/lila-lavan.pdf',
    description: 'שיחה אישית עם כל חניך, גיבוש בין הקבוצות בסניף, רגע משמעותי, הכרת תודה וניצוצות לכל הלילה. מדריך קצר ומעשי, עם שלבים, טעויות נפוצות ורשימת בדיקה.',
  },
];
