// כרטיסיות שאלות לשיחות אישיות עם חניכים — לתצוגה באתר (משיכת כרטיסייה) ולהורדה להדפסה (9 כרטיסיות בעמוד).
import { escapeHtml, mascotSvg } from './printFile';

export interface TalkCard { topic: string; q: string }

export const TALK_TOPICS: { name: string; color: string; tint: string }[] = [
  { name: 'להכיר', color: '#C85B2A', tint: '#FBE4D2' },
  { name: 'בקבוצה', color: '#3E7EA6', tint: '#DCEAF2' },
  { name: 'החיים עכשיו', color: '#7A9A3E', tint: '#E7EFD6' },
  { name: 'חלומות', color: '#C24270', tint: '#F6DDE7' },
  { name: 'ערכים ואמונה', color: '#8A6A12', tint: '#FBF0CE' },
  { name: 'חיזוק', color: '#6B5AA6', tint: '#E6E1F4' },
];

const RAW: Record<string, string[]> = {
  'להכיר': [
    'מה היה הדבר הכי טוב בשבוע האחרון שלך?',
    'מה אתה אוהב לעשות כשאין לך שום דבר לעשות?',
    'איזה שיר היית שם עכשיו, ולמה דווקא הוא?',
    'מי האדם שהכי משפיע עליך, ומה למדת ממנו?',
    'מה גורם לך לצחוק עד דמעות?',
  ],
  'בקבוצה': [
    'איך אתה מרגיש בקבוצה שלנו, מ-1 עד 10? ומה היה מעלה את זה במספר אחד?',
    'איזו פעולה אהבת הכי, ומה היה בה שעבד בשבילך?',
    'יש מישהו בקבוצה שהיית רוצה להכיר יותר?',
    'מה היית משנה בפעולות שלנו, אם זה היה תלוי בך?',
    'מה היית רוצה שהמדריכים יידעו עליך?',
  ],
  'החיים עכשיו': [
    'מה הדבר שהכי מעסיק אותך לאחרונה?',
    'מה קשה לך עכשיו, ומה יכול לעזור?',
    'מתי בפעם האחרונה הרגשת גאווה בעצמך?',
    'איך נראה יום מושלם בשבילך?',
    'ממה אתה מתאמץ, ומי יודע על זה?',
  ],
  'חלומות': [
    'איפה אתה רואה את עצמך בעוד חמש שנים?',
    'מה היית עושה אם היית בטוח שלא תיכשל?',
    'איזה כישרון יש לך שלא כולם יודעים עליו?',
    'מה היית רוצה ללמוד, אם לא היו מגבלות?',
    'איזה דבר היית מתקן בעולם אם היית יכול?',
  ],
  'ערכים ואמונה': [
    'מה הדבר הכי חשוב לך בחיים?',
    'מתי הרגשת שמשהו גדול ממך מלווה אותך?',
    'איזה ערך מהבית שלך אתה רוצה לקחת איתך הלאה?',
    'מה, לדעתך, עושה אדם לאדם טוב?',
    'יש שאלה שמטרידה אותך ושאתה מתלבט בה לאחרונה?',
  ],
  'חיזוק': [
    'מה אתה אוהב בעצמך?',
    'על מה אתה גאה השנה?',
    'מה מישהו אמר לך פעם שנשאר איתך?',
    'מה אני, כמדריך, יכול לעשות כדי שתרגיש יותר טוב בקבוצה?',
    'מה אתה רוצה לשמוע ממני עכשיו?',
  ],
};

export const TALK_CARDS: TalkCard[] = Object.entries(RAW).flatMap(([topic, qs]) => qs.map((q) => ({ topic, q })));

function topicStyle(topic: string) {
  return TALK_TOPICS.find((t) => t.name === topic) ?? TALK_TOPICS[0];
}

export function buildTalkCardsHtml(): string {
  const cards = TALK_CARDS.map((c, i) => {
    const t = topicStyle(c.topic);
    return `<div class="cell"><div class="card" style="--c:${t.color};--t:${t.tint}">
  <div class="band">${escapeHtml(c.topic)}</div>
  <div class="q">${escapeHtml(c.q)}</div>
  <div class="foot"><span class="logo">${mascotSvg('p' + i)}</span><span>המדריך למדריך · שיחה אישית</span></div>
</div></div>`;
  });
  const pages: string[] = [];
  for (let i = 0; i < cards.length; i += 9) pages.push(`<div class="page"><div class="grid">${cards.slice(i, i + 9).join('')}</div></div>`);
  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><title>כרטיסיות לשיחות אישיות</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;800&family=Heebo:wght@400;700&display=swap');
  * { box-sizing: border-box; }
  @page { size: A4; margin: 8mm; }
  body { margin: 0; background: #ddd; direction: rtl; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Heebo', sans-serif; }
  .page { width: 194mm; margin: 0 auto 6mm; background: #fff; page-break-after: always; break-after: page; min-height: 281mm; }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .grid { display: grid; grid-template-columns: repeat(3, 62mm); grid-auto-rows: 92mm; gap: 3mm; justify-content: center; padding-top: 2mm; }
  .cell { outline: .25mm dashed #888; outline-offset: 1.5mm; }
  .card { width: 62mm; height: 92mm; background: var(--t); border: .5mm solid #241C11; border-radius: 3mm; display: flex; flex-direction: column; overflow: hidden; }
  .band { background: var(--c); color: #fff; font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 4mm; text-align: center; padding: 2.4mm 2mm; }
  .q { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4mm 5mm; font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 5mm; line-height: 1.35; color: #241C11; }
  .foot { display: flex; align-items: center; justify-content: center; gap: 1.6mm; padding: 2mm; font-size: 2.6mm; color: #5B4E3C; }
  .logo svg { width: 4mm; height: 4mm; display: block; }
  .tip { text-align: center; font-size: 8px; color: #999; margin-top: 3mm; }
  @media print { body { background: #fff; } .page { margin: 0; } }
</style></head><body>
${pages.join('\n')}
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 600); });</script>
</body></html>`;
}
