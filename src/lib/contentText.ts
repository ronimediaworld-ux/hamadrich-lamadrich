import type { Activity, Reading, Chupar, Situation, Method, StaffStudy } from '../data/types';
import type { QuickGame } from '../data/quickGames';

function clean(lines: string[]): string {
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// פעולה מלאה — כותרת, פרטים, מהלך שלב־שלב, מקורות, טיפ.
export function activityToText(a: Activity): string {
  const L: string[] = [];
  L.push(a.title, '');
  if (a.series) L.push(`מערך: ${a.series.title} — מפגש ${a.series.part}${a.series.total ? ` מתוך ${a.series.total}` : ''}`);
  L.push(`גיל: ${a.ageLabel}  |  משך: ${a.duration} דקות  |  ${a.place === 'שניהם' ? 'פנים/חוץ' : a.place}`);
  L.push(`ציוד: ${a.equipment.length ? a.equipment.join(', ') : 'ללא ציוד מיוחד'}`, '');
  if (a.description) L.push(a.description, '');

  if (a.goals?.length) {
    L.push('מטרות:');
    a.goals.forEach((g) => L.push(`• ${g}`));
    L.push('');
  }

  L.push('מהלך הפעולה:');
  if (a.flow && a.flow.length > 0) {
    a.flow.forEach((s, i) => {
      L.push(`${i + 1}. ${s.label}`);
      if (s.body) L.push(s.body);
      s.items?.forEach((it) => L.push(`   - ${it}`));
      if (s.link) L.push(`   קישור: ${s.link.title} — ${s.link.url}`);
      if (s.note) L.push(`   (${s.note})`);
      L.push('');
    });
  } else {
    let n = 1;
    L.push(`${n++}. פתיחה: ${a.opening}`);
    if (a.game) L.push(`${n++}. משחק: ${a.game}`);
    L.push(`${n++}. מתודה: ${a.method}`);
    if (a.reading) L.push(`${n++}. קטע קריאה — ${a.reading.label}:\n${a.reading.text}`);
    if (a.discussion?.length) {
      L.push(`${n++}. דיון:`);
      a.discussion.forEach((q) => L.push(`   - ${q}`));
    }
    if (a.questions?.length) {
      L.push('שאלות נוספות:');
      a.questions.forEach((q) => L.push(`   - ${q}`));
    }
    L.push(`${n++}. סיכום: ${a.summary}`);
    L.push('');
  }

  if (a.sourceLink) L.push(`מקור חיצוני: ${a.sourceLink.title} — ${a.sourceLink.url}`);
  if (a.guideNotes) L.push('', `הערות למדריך: ${a.guideNotes}`);
  if (a.tip) L.push(`טיפ: ${a.tip}`);

  if (a.appendices?.length) {
    a.appendices.forEach((ap, i) => {
      // בלי נקודתיים בכותרת עצמה — אחרת הפרסר של printFile.ts (שמחפש ':' ראשון) חותך את התווית לאמצע
      const safeLabel = ap.label.replace(/:/g, ' –');
      L.push('', `${i + 1}. נספח — ${safeLabel}`);
      L.push(ap.content);
    });
  }

  return clean(L);
}

export function readingToText(r: Reading): string {
  const L = [
    r.title,
    `${r.ageLabel} · מקור: ${r.source}`,
    '',
    r.description,
    '',
    r.text,
    '',
  ];
  if (r.sourceLink) L.push(`לקריאת הטור המלא: ${r.sourceLink.title} — ${r.sourceLink.url}`, '');
  L.push(`איך משתמשים בזה בפעולה: ${r.howToUse}`);
  return clean(L);
}

export function chuparToText(c: Chupar): string {
  return clean([
    `צ׳ופר: ${c.title}`,
    `תקציב: ${c.budget} · הכנה: ${c.prepTime} · למי: ${c.forWhom} · סוג: ${c.kind}`,
    '',
    c.description,
    '',
    `איך עושים: ${c.tip}`,
  ]);
}

export function situationToText(s: Situation): string {
  const L = [s.title, '', s.scenario, '', 'מה כדאי לעשות:'];
  s.approach.forEach((a) => L.push(`• ${a}`));
  L.push('', 'ממה כדאי להימנע:');
  s.avoid.forEach((a) => L.push(`• ${a}`));
  L.push('', `טיפ: ${s.tip}`);
  return clean(L);
}

export function methodToText(m: Method): string {
  return clean([
    m.title,
    `מתאים ל: ${m.suitableFor}`,
    '',
    m.description,
    '',
    `איך משתמשים: ${m.howToUse}`,
  ]);
}

export function staffStudyToText(s: StaffStudy): string {
  const L: string[] = [s.title];
  if (s.series) L.push(`מערך: ${s.series.title} · מפגש ${s.series.part}${s.series.total ? `/${s.series.total}` : ''}`);
  L.push(`${s.topic} · ${s.duration} דק׳ · ${s.forWhom}`, '', s.description, '');
  if (s.goals?.length) {
    L.push('מטרות:');
    s.goals.forEach((g) => L.push(`• ${g}`));
    L.push('');
  }
  L.push(`פתיחה: ${s.opening}`, '', s.content, '');
  if (s.explanation) L.push('הסבר מעמיק:', '(אופציונלי — למי שרוצה להעמיק)', s.explanation, '');
  if (s.discussion?.length) {
    L.push('שאלות לדיון:');
    s.discussion.forEach((q) => L.push(`   - ${q}`));
    L.push('');
  }
  L.push(`לקחת מזה: ${s.takeaway}`);
  if (s.sourceLink) L.push(`מקור: ${s.sourceLink.title} — ${s.sourceLink.url}`);
  return clean(L);
}

export function quickGameToText(g: QuickGame): string {
  return clean([
    `${g.name} (${g.kind})`,
    `${g.players} · ${g.needs}`,
    '',
    g.description,
  ]);
}
