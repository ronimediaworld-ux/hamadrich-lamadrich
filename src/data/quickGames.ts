// משחקים מהירים — לקט משחקי חצר, מעגל, כדור, חשיבה והצגה, לשליפה מהירה בפעולה.
// מבוסס על "לקט המשחקים" של רועי צוריאלי; התיאורים נכתבו כאן בקצרה ובמילים שלנו.
import quickGamesData from './quickGames.json';

export type QuickGameKind =
  | 'ריצה'
  | 'תופסת'
  | 'מעגל'
  | 'כוח'
  | 'כדור'
  | 'חשיבה'
  | 'הצגה'
  | 'שטח'
  | 'רגיעה'
  | 'יצירה'
  | 'קבוצתי'
  | 'ראווה';

export interface QuickGame {
  id: string;
  name: string;
  kind: QuickGameKind;
  players: string;
  needs: string;
  description: string;
}

export const quickGames = quickGamesData as QuickGame[];
