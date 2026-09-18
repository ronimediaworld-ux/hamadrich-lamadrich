import type { Situation } from './types';
import situationsData from './situations.json';

export const situations = situationsData as Situation[];

export function getSituation(id: string): Situation | undefined {
  return situations.find((s) => s.id === id);
}
