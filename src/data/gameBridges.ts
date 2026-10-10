// חיבור בין נושא הפעולה לבין משחקים מוכרים מהמאגר, עם משפט שמסביר איך לקשר את המשחק לנושא.
// {topic} מוחלף בנושא של הפעולה עצמה.
import type { Activity } from './types';

export interface BridgeGame { id: string; how: string }
export interface BridgeTheme { key: string; label: string; match: RegExp; games: BridgeGame[] }

export const THEMES: BridgeTheme[] = [
  {
    key: 'team', label: 'עבודת צוות, שייכות וגיבוש',
    match: /עבודת צוות|גיבוש|שייכות|אחדות|חברות|ערבות|לא לבד/,
    games: [
      { id: 'human-knot', how: 'את הקשר אפשר לפתוח רק כשכולן מקשיבות ועוזרות. שאלי אחרי המשחק: מה עזר לכן לפתור ביחד, ואיפה ראינו את זה גם ב"{topic}"?' },
      { id: 'paper-tower', how: 'כל קבוצה בונה ביחד מגדל אחד. שאלי: איך חילקתן תפקידים, ומה זה מלמד על "{topic}"?' },
      { id: 'silent-lineup', how: 'מסתדרות בלי מילים, ולכן חייבות לשים לב אחת לשנייה. שאלי: מתי קל לנו להבין מישהי בלי מילים, ואיך זה קשור ל"{topic}"?' },
      { id: 'haemaagal-hamitchaber', how: 'המעגל מצטמצם ונעשה צפוף וחזק יותר. שאלי: מה קורה לקבוצה כשכולן מתקרבות, ומה זה אומר על "{topic}"?' },
      { id: 'chatul-veachbar', how: 'כל הקבוצה שומרת על העכבר. שאלי: מתי הקבוצה שלנו שומרת על מי שחלש יותר, ואיך זה קשור ל"{topic}"?' },
    ],
  },
  {
    key: 'responsibility', label: 'אחריות, בחירה והתמדה',
    match: /אחריות|בחירה|התמדה|משמעות|החלטה|שליחות/,
    games: [
      { id: 'hertzl-amar', how: 'כל הוראה היא בחירה: לבצע או לא. שאלי: מתי בחיים אנחנו צריכות להחליט אם לציית או לחשוב לבד, ואיך זה קשור ל"{topic}"?' },
      { id: 'yam-yabasha', how: 'כל קריאה דורשת החלטה מהירה, ולפעמים טועים. שאלי: איך מרגיש לטעות, ומה עושים אחר כך? ומה זה אומר על "{topic}"?' },
      { id: 'haemelech', how: 'המלך נותן משימות רק לטובת עצמו. שאלי: מה ההבדל בין מי שמובילה למען אחרות למי שמובילה למען עצמה, ואיך זה קשור ל"{topic}"?' },
      { id: 'ani-yoshev-tachat-etz', how: 'הסדר חוזר וכל אחת צריכה להישאר ערנית. שאלי: מה עוזר לנו להתמיד, ואיך זה קשור ל"{topic}"?' },
    ],
  },
  {
    key: 'giving', label: 'נתינה, חסד והכרת הטוב',
    match: /נתינה|חסד|הכרת תודה|הכרת הטוב|כבוד|עזרה|חמלה/,
    games: [
      { id: 'samoch-alai', how: 'אחת נופלת ואחרת תופסת. שאלי: מה צריך כדי שמישהי תסמוך עלינו, ואיך זה קשור ל"{topic}"?' },
      { id: 'mirror-pairs', how: 'צריך להסתכל באמת על השנייה כדי לשקף אותה. שאלי: איך מרגיש כשמישהי באמת רואה אותך, ומה זה אומר על "{topic}"?' },
      { id: 'bikuret-pratiyut', how: 'מכירות אחת את השנייה לעומק. שאלי: מה גילית שלא ידעת, ואיך זה קשור ל"{topic}"?' },
      { id: 'hamaagal-hatomech', how: 'אחת הולכת על החבל כשהקבוצה תומכת בה. שאלי: איך מרגיש לסמוך על הקבוצה, ומה זה אומר על "{topic}"?' },
    ],
  },
  {
    key: 'honesty', label: 'כנות ואמת',
    match: /כנות|אמת|יושר|שקר/,
    games: [
      { id: 'emet-vesheker', how: 'מנחשות מה אמת ומה שקר. שאלי: איך מזהים אמת, ולמה קשה לפעמים לומר אותה? ואיך זה קשור ל"{topic}"?' },
      { id: 'pinocchio-shmi', how: 'השם של המשחק מזכיר את מי שהאף שלו גדל כשהוא משקר. שאלי: מה קורה כשמסתירים אמת, ומה זה אומר על "{topic}"?' },
      { id: 'alibi', how: 'שני חשודים מנסים לספר אותה גרסה. שאלי: למה קשה לשמור על סיפור שקרי, ואיך זה קשור ל"{topic}"?' },
    ],
  },
  {
    key: 'courage', label: 'אומץ ומנהיגות',
    match: /אומץ|מנהיגות|גבורה|יוזמה|התגברות/,
    games: [
      { id: 'one-minute-challenge', how: 'דקה אחת לנסות משהו שנראה בלתי אפשרי. שאלי: מה עזר לנו להתחיל גם כשלא היינו בטוחות, ומה זה אומר על "{topic}"?' },
      { id: 'ever-movil', how: 'איבר אחד מוביל את כל הגוף. שאלי: מה קורה לקבוצה כשמישהי מובילה, ומה צריך מנהיגה טובה? ואיך זה קשור ל"{topic}"?' },
      { id: 'paper-tower', how: 'מי מתחילה לבנות? שאלי: מי לקחה יוזמה בקבוצה שלכן, ואיך זה קשור ל"{topic}"?' },
    ],
  },
  {
    key: 'identity', label: 'זהות והיכרות',
    match: /זהות|ענווה|היכרות|מי אני|ייחוד/,
    games: [
      { id: 'stand-if', how: 'כשעומדות, מגלות מה משותף. שאלי: מה הפתיע אתכן בקבוצה, ואיך זה קשור ל"{topic}"?' },
      { id: 'sheelot-al-hakvutza', how: 'לומדות עוד על הקבוצה. שאלי: מה גילית על מישהי שלא ידעת, ואיך זה קשור ל"{topic}"?' },
      { id: 'bikuret-pratiyut', how: 'מכירות אחת את השנייה לעומק. שאלי: מה מייחד כל אחת מאיתנו, ומה זה אומר על "{topic}"?' },
    ],
  },
  {
    key: 'listening', label: 'הקשבה ותקשורת',
    match: /הקשבה|תקשורת|דיבור|שיח|שפה|מילים|לשון/,
    games: [
      { id: 'hertzl-amar', how: 'צריך להקשיב בדיוק למה שנאמר. שאלי: מה קורה כשמקשיבות רק למחצה, ואיך זה קשור ל"{topic}"?' },
      { id: 'kumkum-sheli', how: 'מילה אחת מחליפה כל חפץ וקשה להבין. שאלי: מתי אנחנו לא מבינות אחת את השנייה, ומה עוזר? ואיך זה קשור ל"{topic}"?' },
      { id: 'whats-changed', how: 'צריך לשים לב לפרטים קטנים. שאלי: מה אנחנו מפספסות כשלא שמות לב, ואיך זה קשור ל"{topic}"?' },
      { id: 'yes-and', how: 'כל משפט מתחיל ב"כן, ו..." ומקשיב למה שנאמר לפניו. שאלי: איך מרגיש כשמישהי בונה על מה שאמרת, ומה זה אומר על "{topic}"?' },
    ],
  },
  {
    key: 'faith', label: 'אמונה, תקווה, שמחה ותשובה',
    match: /אמונה|תקווה|שמחה|תשובה|צמיחה|התחלה|תפילה|סליחה/,
    games: [
      { id: 'haavan-sheli', how: 'כל אחת מכירה אבן בלי לראות, וגם מוצאת אותה בין רבות. שאלי: מה אנחנו מכירות על עצמנו בלי לראות, ואיך זה קשור ל"{topic}"?' },
      { id: 'machvoim', how: 'מי שמתחבאת מחכה שימצאו אותה. שאלי: למה לפעמים אנחנו מתחבאות, ומה קורה כשמישהי קוראת לנו? ואיך זה קשור ל"{topic}"?' },
      { id: 'haemaagal-hamitchaber', how: 'שמחה במעגל אחד. שאלי: מה עושה לנו שמחה משותפת, ואיך זה קשור ל"{topic}"?' },
      { id: 'meshak-hasheket', how: 'צריך שקט כדי להצליח. שאלי: מה קורה לנו כשיש שקט, ואיך זה קשור ל"{topic}"?' },
    ],
  },
];

// פעולות זיכרון ורגישות: לא מציעים משחק. עדיף להאריך את השיחה.
export const SENSITIVE = /7 באוקטובר|7\.10|זיכרון|שואה|לזכר|אבל|שכול|נופל|יום הזיכרון/;

const GENERIC: BridgeGame[] = [
  { id: 'yam-yabasha', how: 'אחרי המשחק שאלי: מה בו מזכיר את מה שדיברנו עליו ב"{topic}"?' },
  { id: 'colors-and-names', how: 'אחרי המשחק שאלי: מה בו מזכיר את מה שדיברנו עליו ב"{topic}"?' },
  { id: 'three-word-story', how: 'בונות סיפור משותף. שאלי: איך הסיפור שלנו קשור ל"{topic}"?' },
];

export function topicOf(a: Activity): string {
  return a.subtopics?.[0] || a.values?.[0] || a.title;
}

export function activityText(a: Activity): string {
  return [a.title, ...a.tags, ...(a.subtopics ?? []), ...(a.values ?? [])].join(' ');
}

export function isSensitive(a: Activity): boolean {
  return SENSITIVE.test(activityText(a));
}

// רשימת הצעות מסודרת: קודם נושאים שמתאימים לפעולה, ואחר כך כלליים. לכל הצעה יש הסבר איך לקשר.
export function bridgeCandidates(a: Activity): { theme: string | null; game: BridgeGame }[] {
  const txt = activityText(a);
  const out: { theme: string | null; game: BridgeGame }[] = [];
  const seen = new Set<string>();
  for (const t of THEMES) {
    if (!t.match.test(txt)) continue;
    for (const g of t.games) if (!seen.has(g.id)) { seen.add(g.id); out.push({ theme: t.label, game: g }); }
  }
  for (const g of GENERIC) if (!seen.has(g.id)) { seen.add(g.id); out.push({ theme: null, game: g }); }
  return out;
}

export const fillTopic = (how: string, a: Activity) => how.replace(/\{topic\}/g, topicOf(a));
