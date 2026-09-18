import type { Activity } from './types';
import activitiesData from './activities.json';

export const activities = activitiesData as Activity[];

export function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function activitiesByCategory(slug: string): Activity[] {
  return activities.filter((a) => a.categorySlug === slug);
}
