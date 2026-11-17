// כותרת עמוד נושא. פרשות וחגים מקבלים ניסוח טבעי כמו שמחפשים בגוגל.
export function topicTitle(topic: string): string {
  if (topic.startsWith('פרשת ')) return `פעולות ל${topic}: רעיונות להדרכה בתנועות נוער`;
  return `פעולות בנושא ${topic}: רעיונות להדרכה בתנועות נוער`;
}
