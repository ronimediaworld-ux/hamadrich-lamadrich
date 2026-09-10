import type { CategoryDef } from './types';

export const categories: CategoryDef[] = [
  {
    slug: 'activities',
    label: 'פעולות ומערכים',
    description: 'ערכים וחברה, אמונה וזהות, פרשת שבוע ותכנים כלליים — הקטגוריה המרכזית והעשירה ביותר',
    color: 'flame',
    icon: 'book',
  },
  {
    slug: 'games',
    label: 'רשימת משחקים',
    description: 'קרחונים, משחקי אמון, חידונים וגיבוש קליל — מוכנים לשלב בכל פעולה',
    color: 'lime',
    icon: 'users',
  },
  {
    slug: 'methods',
    label: 'מתודות',
    description: 'מאגר מתודות שאפשר לשלב בכל פעולה — לא תלוי נושא',
    color: 'sky',
    icon: 'spark',
  },
  {
    slug: 'readings',
    label: 'קטעי קריאה',
    description: 'סיפורים ומשלים — מוכרים ומקוריים, אמוניים וערכיים, לכל טווח גילאים',
    color: 'magenta',
    icon: 'book',
  },
  {
    slug: 'staff-study',
    label: 'לימוד צוות',
    description: 'תוכן להתפתחות הצוות עצמו — לא לחניכים',
    color: 'magenta',
    icon: 'heart',
  },
  {
    slug: 'tools',
    label: 'סיטואציות בהדרכה',
    description: 'מצבים אמיתיים שקורים בהדרכה בתנועת נוער — עם חניכים, הורים ובצוות — ואיך להתמודד איתם',
    color: 'sky',
    icon: 'toolbox',
  },
  {
    slug: 'social-nights',
    label: 'ערבי גיבוש וכיף',
    description: 'אירועי שיא, ערבי משימות ולילות מיוחדים',
    color: 'yellow',
    icon: 'tent',
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return categories.find((c) => c.slug === slug);
}

const domainTags = ['פרשת שבוע', 'אמונה', 'ערכים'] as const;

export function getActivityDomain(tags: string[]): string {
  return domainTags.find((d) => tags.includes(d)) ?? 'כללי';
}
