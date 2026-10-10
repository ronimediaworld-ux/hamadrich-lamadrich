// עותקים אישיים ותבניות אישיות: נשמרים רק בדפדפן של המשתמש, ולא משפיעים על הפעולה המקורית או על אחרים.
import type { Activity } from '../data/types';
import { SEVEN_BONUS, SEVEN_PARTS } from '../data/sevenParts';
import { escapeHtml } from './printFile';

export interface CopyStep { label: string; body: string; color?: string; hint?: string }

export interface PersonalCopy {
  id: string; // "copy-<activityId>" לעותק של פעולה, "template-<מספר>" לתבנית אישית
  baseId: string | null; // הפעולה המקורית
  kind: 'copy' | 'template';
  title: string;
  goals: string; // שורה לכל מטרה
  steps: CopyStep[];
  notes: string;
  updatedAt: number;
}

const KEY = 'hlm-personal-copies';

function readAll(): Record<string, PersonalCopy> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, PersonalCopy>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('personal-copies-changed'));
  } catch { /* האחסון מלא או חסום: העריכה תימשך בלי שמירה */ }
}

export const listCopies = (): PersonalCopy[] => Object.values(readAll()).sort((a, b) => b.updatedAt - a.updatedAt);
export const getCopy = (id: string): PersonalCopy | null => readAll()[id] ?? null;
export function saveCopy(c: PersonalCopy) { const all = readAll(); all[c.id] = { ...c, updatedAt: Date.now() }; writeAll(all); }
export function deleteCopy(id: string) { const all = readAll(); delete all[id]; writeAll(all); }

function stepText(s: { body?: string; items?: string[]; note?: string }): string {
  const parts: string[] = [];
  if (s.body) parts.push(s.body);
  if (s.items?.length) parts.push(s.items.map((i) => `• ${i}`).join('\n'));
  if (s.note) parts.push(`הערה: ${s.note}`);
  return parts.join('\n\n');
}

export function copyFromActivity(a: Activity): PersonalCopy {
  const steps: CopyStep[] = a.flow?.length
    ? a.flow.map((f) => ({ label: f.label, body: stepText(f) }))
    : [
        { label: 'פתיחה', body: a.opening },
        { label: 'מהלך הפעולה', body: a.method },
        { label: 'דיון', body: a.discussion.map((q) => `• ${q}`).join('\n') },
        { label: 'סיכום', body: a.summary },
      ];
  return { id: `copy-${a.id}`, baseId: a.id, kind: 'copy', title: a.title, goals: a.goals.join('\n'), steps, notes: '', updatedAt: Date.now() };
}

export function newTemplate(): PersonalCopy {
  const steps: CopyStep[] = [...SEVEN_PARTS, SEVEN_BONUS].map((p) => ({ label: p.name, body: '', color: p.color, hint: p.write }));
  return { id: `template-${Date.now()}`, baseId: null, kind: 'template', title: 'הפעולה שלי', goals: '', steps, notes: '', updatedAt: Date.now() };
}

const para = (t: string) => escapeHtml(t).replace(/\n/g, '<br>');

export function personalText(c: PersonalCopy): string {
  return [c.title, c.goals && `מטרות:\n${c.goals}`, ...c.steps.map((s) => `${s.label}\n${s.body}`), c.notes && `הערות אישיות:\n${c.notes}`].filter(Boolean).join('\n\n');
}

export function buildPersonalPrintHtml(c: PersonalCopy): string {
  const steps = c.steps.map((s, i) => `
  <section class="st" style="--c:${s.color || '#D96A2B'}">
    <h2><span class="n">${i + 1}</span>${escapeHtml(s.label)}</h2>
    <p>${s.body.trim() ? para(s.body) : '<span class="blank">&nbsp;</span>'}</p>
  </section>`).join('');
  const goals = c.goals.trim() ? `<h3>מטרות</h3><ul>${c.goals.split('\n').filter(Boolean).map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul>` : '';
  const notes = c.notes.trim() ? `<div class="notes"><b>הערות אישיות:</b><br>${para(c.notes)}</div>` : '';
  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(c.title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;800&family=Heebo:wght@400;700&display=swap');
  * { box-sizing: border-box; }
  @page { size: A4; margin: 12mm; }
  body { margin: 0; color: #241C11; direction: rtl; font-family: 'Heebo', sans-serif; font-size: 14px; line-height: 1.75; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .doc { max-width: 186mm; margin: 0 auto; }
  h1 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 26px; margin: 0 0 4px; }
  .by { color: #8C7F6B; font-size: 12px; margin: 0 0 12px; }
  h3 { font-family: 'Rubik', sans-serif; font-size: 16px; margin: 10px 0 4px; }
  .st { break-inside: avoid; border-inline-start: 5px solid var(--c); padding: 6px 14px 8px; margin: 0 0 10px; background: #FFFEFA; border-radius: 6px; }
  .st h2 { font-family: 'Rubik', sans-serif; font-weight: 800; font-size: 17px; margin: 0 0 3px; display: flex; align-items: center; gap: 8px; }
  .n { background: var(--c); color: #fff; border-radius: 50%; width: 24px; height: 24px; line-height: 24px; text-align: center; font-size: 13px; }
  .st p { margin: 0; }
  .blank { display: block; height: 46px; border-bottom: 1px solid #C9BFA9; }
  .notes { margin-top: 12px; padding: 10px 14px; border: 1.5px dashed #8C7F6B; border-radius: 8px; }
  .foot { margin-top: 14px; font-size: 11px; color: #8C7F6B; }
</style></head><body><div class="doc">
  <h1>${escapeHtml(c.title)}</h1>
  <p class="by">${c.kind === 'copy' ? 'עותק אישי · ' : ''}המדריך למדריך</p>
  ${goals}${steps}${notes}
  <p class="foot">${c.kind === 'copy' ? 'הנספחים המודפסים נמצאים בפעולה המקורית באתר.' : 'נבנה לפי שיטת שבעת החלקים.'}</p>
</div><script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 600); });</script></body></html>`;
}
