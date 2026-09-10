export type ShabbatFit = 'שבת' | 'חול' | 'שניהם';
export type Character = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SeriesInfo {
  title: string;
  part: number;
  total?: number;
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface Appendix {
  label: string;
  content: string;
}

export interface Activity {
  id: string;
  title: string;
  categorySlug: string;
  series?: SeriesInfo;
  subtopics: string[];
  ageLabel: string;
  ageMin: number;
  ageMax: number;
  duration: number;
  groupSize: string;
  equipment: string[];
  shabbat: ShabbatFit;
  place: 'פנים' | 'חוץ' | 'שניהם';
  energy: 'נמוכה' | 'בינונית' | 'גבוהה';
  depth: 'קליל' | 'בינוני' | 'עמוק';
  values: string[];
  tags: string[];
  rating: number;
  character: Character;
  description: string;
  goals: string[];
  opening: string;
  game?: string;
  method: string;
  discussion: string[];
  reading?: { label: string; text: string };
  sourceLink?: SourceLink;
  guideNotes: string;
  questions?: string[];
  summary: string;
  tip: string;
  shabbatNote?: string;
  appendices?: Appendix[];
}

export interface Chupar {
  id: string;
  title: string;
  budget: '₪' | '₪₪' | '₪₪₪' | 'חינם';
  prepTime: string;
  forWhom: 'אישי' | 'קבוצתי';
  kind: 'אכיל' | 'מתנה מוחשית' | 'חוויה' | 'DIY';
  description: string;
  tip: string;
  character: Character;
}

export interface Situation {
  id: string;
  title: string;
  scenario: string;
  approach: string[];
  avoid: string[];
  tip: string;
}

export interface Method {
  id: string;
  title: string;
  suitableFor: string;
  description: string;
  howToUse: string;
  tags: string[];
}

export interface Reading {
  id: string;
  title: string;
  domain: 'אמוני' | 'ערכי' | 'שניהם';
  ageLabel: string;
  ageMin: number;
  ageMax: number;
  description: string;
  text: string;
  howToUse: string;
  source: string;
  tags: string[];
}

export interface StaffStudy {
  id: string;
  title: string;
  series?: SeriesInfo;
  topic: string;
  duration: number;
  forWhom: string;
  description: string;
  goals: string[];
  opening: string;
  content: string;
  discussion: string[];
  takeaway: string;
  sourceLink?: SourceLink;
}

export interface CategoryDef {
  slug: string;
  label: string;
  description: string;
  color: 'flame' | 'lime' | 'magenta' | 'sky' | 'yellow';
  icon: string;
}
