import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';

// מפתחות הצפיות והדירוגים נשמרים כ-"סוג:id" — כאן הופכים אותם לשם קריא וקישור
const KINDS: Record<string, { label: string; path: string; find: (id: string) => string | undefined }> = {
  activity: { label: 'פעולה', path: 'activity', find: (id) => activities.find((a) => a.id === id)?.title },
  reading: { label: 'קטע קריאה', path: 'reading', find: (id) => readings.find((r) => r.id === id)?.title },
  'staff-study': { label: 'לימוד צוות', path: 'staff-study', find: (id) => staffStudy.find((s) => s.id === id)?.title },
  chupar: { label: 'צ׳ופר', path: 'chupar', find: (id) => chuparim.find((c) => c.id === id)?.title },
};

export function describeKey(key: string): { title: string; href: string | null; kind: string } {
  const [kind, ...rest] = key.split(':');
  const id = rest.length ? rest.join(':') : kind;
  const k = KINDS[rest.length ? kind : 'activity'];
  if (!k) return { title: id, href: null, kind: kind };
  return { title: k.find(id) ?? id, href: `/${k.path}/${id}`, kind: k.label };
}

export function describeTarget(kind: string, id: string): { title: string; href: string | null } {
  const k = KINDS[kind];
  if (!k) return { title: id, href: null };
  return { title: k.find(id) ?? id, href: `/${k.path}/${id}` };
}

export const CONTENT_COUNTS = [
  { label: 'פעולות', n: activities.length },
  { label: 'קטעי קריאה', n: readings.length },
  { label: 'לימודי צוות', n: staffStudy.length },
  { label: 'צ׳ופרים', n: chuparim.length },
];
