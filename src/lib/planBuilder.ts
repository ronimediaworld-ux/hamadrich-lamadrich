// "בונה פעולה": מרכיב פעולה שלמה מהמאגר לפי גיל, זמן ונושא — בסיס נושאי (פתיחה, גוף, דיון, סיכום) + משחק + מתודה.
import { activities } from '../data/activities';
import { methods } from '../data/methods';
import { quickGames } from '../data/quickGames';
import { getActivityDomain } from '../data/categories';
import type { Activity, FlowStep } from '../data/types';

export interface PlanOptions {
  grade: [number, number]; // טווח כיתות (1–12)
  minutes: number;
  domain: 'הכל' | 'ערכים' | 'אמונה' | 'פרשת שבוע';
  keyword: string;
  shabbat: boolean;
}

export interface PlanSeeds { base: number; game: number; method: number }

export interface PlanStep { label: string; minutes: number; body?: string; items?: string[]; source?: string; kind: 'opening' | 'game' | 'main' | 'method' | 'discussion' | 'summary' }

export interface Plan {
  base: Activity | null;
  steps: PlanStep[];
  total: number;
  candidates: number;
}

function rng(seed: number) {
  let a = seed + 0x6D2B79F5;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(arr: T[], seed: number): T | undefined => (arr.length ? arr[Math.floor(rng(seed)() * arr.length)] : undefined);

function mins(label: string): number {
  const m = label.match(/\((\d+)\s*דק/);
  return m ? Number(m[1]) : 0;
}
function clean(label: string): string {
  return label.replace(/\s*\(\d+\s*דק[׳']\)\s*$/, '').trim();
}

function stepsOf(a: Activity): FlowStep[] {
  if (a.flow?.length) return a.flow;
  return [
    { label: 'פתיחה (5 דק׳)', body: a.opening },
    ...(a.game ? [{ label: 'משחק (8 דק׳)', body: a.game }] : []),
    { label: 'מתודה (15 דק׳)', body: a.method },
    { label: 'דיון (8 דק׳)', items: a.discussion },
    { label: 'סיכום (4 דק׳)', body: a.summary },
  ];
}

function classify(label: string): PlanStep['kind'] | null {
  if (/^פתיחה/.test(label)) return 'opening';
  if (/^משחק/.test(label)) return 'game';
  if (/^דיון/.test(label)) return 'discussion';
  if (/^סיכום/.test(label)) return 'summary';
  if (/שאלות נוספות|מקור חיצוני/.test(label)) return null;
  return 'main';
}

export function buildPlan(o: PlanOptions, seeds: PlanSeeds): Plan {
  const [g0, g1] = o.grade;
  const kw = o.keyword.trim();
  const pool = activities.filter((a) => {
    if (a.categorySlug !== 'activities') return false;
    if (a.ageMax < g0 || a.ageMin > g1) return false;
    if (o.domain !== 'הכל' && getActivityDomain(a.tags) !== o.domain) return false;
    if (o.shabbat && a.shabbat === 'חול') return false;
    if (kw) {
      const hay = [a.title, a.description, ...a.tags, ...a.values].join(' ');
      if (!kw.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const base = pick(pool, seeds.base) ?? null;
  const steps: PlanStep[] = [];
  if (!base) return { base: null, steps, total: 0, candidates: 0 };

  const own = stepsOf(base);
  let opening: PlanStep | null = null;
  let discussion: PlanStep | null = null;
  let summary: PlanStep | null = null;
  const mains: PlanStep[] = [];
  let ownGame: PlanStep | null = null;
  for (const s of own) {
    const k = classify(s.label);
    if (!k) continue;
    const st: PlanStep = { label: clean(s.label), minutes: mins(s.label) || (k === 'discussion' ? 8 : k === 'summary' ? 4 : k === 'opening' ? 5 : 10), body: s.body, items: s.items, source: base.title, kind: k };
    if (k === 'opening') opening = st; else if (k === 'discussion') discussion = st; else if (k === 'summary') summary = st; else if (k === 'game') ownGame = st; else mains.push(st);
  }

  // משחק: מהמאגר (משחק מהיר מתאים לשבת רק אם אינו דורש ציוד מורכב)
  const games = quickGames.filter((g) => !o.shabbat || !/טלפון|כתיבה|מחשב/.test(g.needs));
  const qg = pick(games, seeds.game);
  const gameStep: PlanStep | null = qg
    ? { label: `משחק: ${qg.name}`, minutes: 8, body: `${qg.description}\n(${qg.players} · ${qg.needs})`, source: 'משחקים מהירים', kind: 'game' }
    : ownGame;

  // מתודה נוספת (אם נשאר זמן)
  const metPool = methods.filter((m) => !o.shabbat || !/כתיב|פתק|הקרנ/.test(m.description + m.howToUse));
  const mt = pick(metPool, seeds.method);
  const methodStep: PlanStep | null = mt ? { label: `מתודה: ${mt.title}`, minutes: 12, body: `${mt.description}\nאיך משתמשים: ${mt.howToUse}`, source: 'מאגר המתודות', kind: 'method' } : null;

  const core = [opening, ...mains, discussion, summary].filter((x): x is PlanStep => !!x);
  const coreTotal = core.reduce((n, s) => n + s.minutes, 0);
  let out: PlanStep[] = [...core];
  // מוסיפים משחק פתיחה, ואז מתודה, כל עוד זה לא חורג מהזמן ביותר מ-5 דקות
  let total = coreTotal;
  if (gameStep && total + gameStep.minutes <= o.minutes + 5) {
    const at = opening ? 1 : 0;
    out.splice(at, 0, gameStep);
    total += gameStep.minutes;
  }
  if (methodStep && total + methodStep.minutes <= o.minutes + 5) {
    const di = out.findIndex((s) => s.kind === 'discussion');
    out.splice(di >= 0 ? di : out.length - 1, 0, methodStep);
    total += methodStep.minutes;
  }
  // אם עדיין ארוך מדי — מוותרים על שלבי גוף נוספים (מהסוף) כל עוד נשאר אחד
  while (total > o.minutes + 8) {
    const idx = [...out].reverse().findIndex((s) => s.kind === 'main' || s.kind === 'method');
    if (idx < 0 || out.filter((s) => s.kind === 'main').length <= 1 && out[out.length - 1 - idx].kind === 'main') break;
    const real = out.length - 1 - idx;
    total -= out[real].minutes;
    out = out.filter((_, k) => k !== real);
  }
  return { base, steps: out, total, candidates: pool.length };
}

// אובייקט פעולה מלא (לשימוש בהדפסה ובמצב "בפעולה")
export function planToActivity(plan: Plan, o: PlanOptions): Activity | null {
  if (!plan.base) return null;
  const b = plan.base;
  const flow: FlowStep[] = plan.steps.map((s) => ({ label: `${s.label} (${s.minutes} דק׳)`, body: s.body, items: s.items, note: s.source && s.source !== b.title ? `מקור: ${s.source}` : undefined }));
  return {
    ...b,
    id: 'custom-plan',
    title: `פעולה מותאמת: ${b.title}`,
    description: `פעולה שהורכבה מהמאגר סביב "${b.title}" — ${o.minutes} דקות בערך, מותאמת לכיתות ${o.grade[0]}–${o.grade[1]}.`,
    duration: plan.total,
    flow,
    appendices: b.appendices,
  };
}
