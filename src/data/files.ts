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
];
