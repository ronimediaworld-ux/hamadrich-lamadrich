import type { Reading } from './types';
import readingsData from './readings.json';

export const readings = readingsData as Reading[];

export function getReading(id: string): Reading | undefined {
  return readings.find((r) => r.id === id);
}
