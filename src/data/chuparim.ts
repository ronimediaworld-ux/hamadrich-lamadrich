import type { Chupar } from './types';
import chuparimData from './chuparim.json';

export const chuparim = chuparimData as Chupar[];

export function getChupar(id: string): Chupar | undefined {
  return chuparim.find((c) => c.id === id);
}
