export interface GeneratedActivity {
  title: string;
  ageLabel: string;
  duration: number;
  groupSize: string;
  equipment: string[];
  shabbat: 'שבת' | 'חול' | 'שניהם';
  shabbatNote?: string;
  description: string;
  goals: string[];
  opening: string;
  game?: string;
  method: string;
  discussion: string[];
  guideNotes: string;
  summary: string;
  tip: string;
}

export type GenerateResult =
  | { ok: true; activity: GeneratedActivity }
  | { ok: false; message: string };

export async function generateActivity(query: string): Promise<GenerateResult> {
  try {
    const response = await fetch('/api/generate-activity', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, message: data?.message ?? 'לא הצלחנו ליצור פעולה כרגע. נסו שוב.' };
    }

    if (!data?.activity) {
      return { ok: false, message: 'התקבלה תשובה לא תקינה מהשרת. נסו לנסח מחדש את הבקשה.' };
    }

    return { ok: true, activity: data.activity as GeneratedActivity };
  } catch {
    return { ok: false, message: 'לא הצלחנו להתחבר לשרת. ודאו שהשרת רץ (npm run dev:full) ונסו שוב.' };
  }
}
