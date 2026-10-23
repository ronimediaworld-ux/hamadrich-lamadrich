import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';
import { getCategory, getActivityDomain } from '../data/categories';
import { parseFavKey } from './favorites';
import { getCopy } from './personalCopies';
import type { BinderEntry } from './activityPrint';

// ממיר מפתחות מועדפים (פעולות ושאר התכנים) לרשימת פריטים להדפסה במסמך אחד.
export function entriesForKeys(keys: string[]): BinderEntry[] {
  const out: BinderEntry[] = [];
  for (const key of keys) {
    const { kind, id } = parseFavKey(key);
    if (kind === 'activity') {
      const a = activities.find((x) => x.id === id);
      if (!a) continue;
      const cat = getCategory(a.categorySlug);
      out.push({ section: cat?.label ?? 'פעולות', title: a.title, activity: a, categoryLabel: cat?.label ?? 'פעולות', badge: a.categorySlug === 'activities' ? getActivityDomain(a.tags) : (cat?.label ?? '') });
    } else if (kind === 'reading') {
      const r = readings.find((x) => x.id === id);
      if (r) out.push({ section: 'קטעי קריאה', title: r.title, generic: { sub: `${r.ageLabel} · מקור: ${r.source}`, text: `${r.text}\n\nאיך משתמשים: ${r.howToUse}`, link: r.sourceLink?.url } });
    } else if (kind === 'staff-study') {
      const s = staffStudy.find((x) => x.id === id);
      if (s) out.push({ section: 'לימוד צוות', title: s.title, generic: { sub: `${s.topic} · ${s.duration} דק׳`, text: `${s.opening?.trim() ? `פתיחה: ${s.opening}\n\n` : ''}${s.content}\n\nשאלות לדיון:\n${s.discussion.map((q) => `• ${q}`).join('\n')}\n\nלקחת מזה: ${s.takeaway}${s.explanation ? `\n\nהסבר מעמיק (אופציונלי):\n${s.explanation}` : ''}`, link: s.sourceLink?.url } });
    } else if (kind === 'personal') {
      const c = getCopy(id);
      if (c) out.push({ section: 'התבניות והעותקים שלי', title: c.title, generic: { sub: c.kind === 'copy' ? 'עותק אישי של פעולה' : 'תבנית אישית לפי שבעת החלקים', text: '' }, personal: c });
    } else if (kind === 'chupar') {
      const c = chuparim.find((x) => x.id === id);
      if (c) out.push({ section: 'צ׳ופרים', title: c.title, generic: { sub: `${c.kind} · ${c.prepTime} · תקציב ${c.budget}`, text: `${c.description}\n\nטיפ: ${c.tip}` }, chupar: c });
    }
  }
  return out;
}
