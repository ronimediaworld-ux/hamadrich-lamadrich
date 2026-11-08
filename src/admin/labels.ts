// שמות בעברית לשדות התוכן, כדי שהעריכה בדשבורד לא תראה כמו קוד.
export const LABELS: Record<string, string> = {
  title: 'כותרת', name: 'שם', description: 'תיאור קצר', categorySlug: 'קטגוריה', subtopics: 'תתי־נושאים', ageLabel: 'טווח גילאים (מתעדכן לבד מהמספרים)',
  ageMin: 'מכיתה (מספר: א׳=1)', ageMax: 'עד כיתה (מספר)', duration: 'משך בדקות', groupSize: 'גודל קבוצה', equipment: 'ציוד', shabbat: 'שבת / חול',
  place: 'מקום', energy: 'רמת אנרגיה', depth: 'עומק', values: 'ערכים', tags: 'תגיות (עוזרות לחיפוש ולפרשת השבוע)', rating: 'דירוג', character: 'דמות (A–F)',
  goals: 'מטרות', opening: 'פתיחה', game: 'משחק', method: 'מתודה', discussion: 'שאלות לדיון', guideNotes: 'הסבר למדריך', summary: 'סיכום', tip: 'טיפ למדריך',
  shabbatNote: 'התאמה לשבת', flow: 'מהלך הפעולה (שלבים)', label: 'שם השלב', body: 'תוכן', items: 'רשימה', sourceLink: 'קישור למקור', link: 'קישור', url: 'כתובת',
  text: 'הטקסט', topic: 'נושא', forWhom: 'למי מתאים', content: 'תוכן המפגש', takeaway: 'מה לוקחים הביתה', kind: 'סוג', budget: 'תקציב', prepTime: 'זמן הכנה',
  print: 'עיצוב הכרטיס להדפסה', scenario: 'תיאור המצב', approach: 'מה עושים', avoid: 'מה לא עושים', domain: 'תחום', howToUse: 'איך משתמשים', source: 'מקור',
  suitableFor: 'מתאים ל', players: 'משתתפים', needs: 'ציוד נדרש', designImage: 'תמונת עיצוב', canvaTemplateUrl: 'קישור לתבנית בקנבה', shape: 'צורה', layout: 'סידור',
  palette: 'פלטת צבעים', motif: 'ציור', font: 'פונט', look: 'סגנון הכרטיס', sub: 'שורת משנה', customName: 'שם בהתאמה אישית', ageRange: 'גילאים', questions: 'שאלות',
};

// קטגוריות הפעולות, להצגה בעברית
export const CATEGORY_LABELS: Record<string, string> = {
  activities: 'פעולות ומערכים', 'social-nights': 'ערבי גיבוש', games: 'משחקים', methods: 'מתודות', readings: 'קטעי קריאה', 'staff-study': 'לימוד צוות',
  tools: 'סיטואציות', walls: 'קירות וגלופות',
};

// שדות עם רשימת בחירה קבועה (במקום להקליד)
export const SELECTS: Record<string, [string, string][]> = {
  categorySlug: [['activities', 'פעולות ומערכים'], ['social-nights', 'ערבי גיבוש'], ['games', 'משחקים']],
  shabbat: [['שבת', 'מתאים לשבת בלבד'], ['חול', 'מתאים לחול בלבד'], ['שניהם', 'מתאים לשבת ולחול']],
  place: [['פנים', 'פנים'], ['חוץ', 'חוץ'], ['שניהם', 'פנים וחוץ']],
  energy: [['נמוכה', 'נמוכה'], ['בינונית', 'בינונית'], ['גבוהה', 'גבוהה']],
  depth: [['קליל', 'קליל'], ['בינוני', 'בינוני'], ['עמוק', 'עמוק']],
  character: ['A', 'B', 'C', 'D', 'E', 'F'].map((c) => [c, `דמות ${c}`] as [string, string]),
};
