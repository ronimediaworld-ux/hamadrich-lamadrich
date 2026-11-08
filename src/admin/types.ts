export type Section = 'overview' | 'comments' | 'submissions' | 'subscribers' | 'content' | 'stats' | 'settings';

export const SECTION_TITLES: Record<Section, string> = {
  overview: 'סקירה', comments: 'תגובות', submissions: 'הצעות פעולות', subscribers: 'נרשמים ומייל', content: 'עריכת תוכן', stats: 'סטטיסטיקה', settings: 'הגדרות וחיבורים',
};
