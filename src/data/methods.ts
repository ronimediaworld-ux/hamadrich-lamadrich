import type { Method } from './types';
import methodsData from './methods.json';

export const methods = methodsData as Method[];

export function getMethod(id: string): Method | undefined {
  return methods.find((m) => m.id === id);
}
