import type { StaffStudy } from './types';
import staffStudyData from './staffStudy.json';

export const staffStudy = staffStudyData as StaffStudy[];

export function getStaffStudy(id: string): StaffStudy | undefined {
  return staffStudy.find((s) => s.id === id);
}
