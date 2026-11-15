// ניצוץ: להבה חמודה עם ידיים, רגליים ומשקפיים. בלי קווי מתאר כהים, בצבעים שטוחים ורכים.
// בגדלים גדולים מוצג הגוף כולו, ובאייקונים קטנים רק הראש (כדי שיישאר ברור).
type SparkProps = {
  size?: number;
  className?: string;
  /** ברירת מחדל: גוף שלם מגודל 64 ומעלה, ראש בלבד מתחת לכך */
  body?: boolean;
  embers?: boolean;
};

export function Spark({ size = 40, className, body, embers }: SparkProps) {
  const full = body ?? size >= 64;
  const showEmbers = embers ?? (full && size >= 90);
  const viewBox = full ? '0 0 140 190' : '8 0 124 136';
  const width = full ? (size * 140) / 190 : size;
  const height = full ? size : (size * 136) / 124;
  return (
    <svg width={width} height={height} viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      {full && (
        <>
          <ellipse cx="70" cy="181" rx="34" ry="5.5" fill="#E9573A" opacity=".18" />
          <g fill="#E8472F">
            <path d="M55 150q-3 14-1 24 1 4 6 4 6 0 6-5l1-23z" />
            <path d="M85 150q3 14 1 24-1 4-6 4-6 0-6-5l-1-23z" />
          </g>
          <ellipse cx="58" cy="176.5" rx="9" ry="4.6" fill="#E03D28" />
          <ellipse cx="82" cy="176.5" rx="9" ry="4.6" fill="#E03D28" />
          <g fill="#EE5233">
            <path d="M44 136q-17-2-25-16-3-6 2-9 5-3 9 3 6 8 18 9z" />
            <path d="M93 134q17-1 27-9 5-4 9 0 3 5-1 9-11 12-35 12z" />
          </g>
          <path d="M46 126q-4 28 6 32 18 6 36 0 10-4 6-32z" fill="#F0502F" />
          <ellipse cx="70" cy="146" rx="11" ry="12" fill="#FF9A2E" />
        </>
      )}
      <path d="M73 4C79 24 108 38 114 74 120 106 100 132 70 134 40 132 20 106 26 76 30 56 42 52 47 38 52 54 58 58 63 56 56 40 62 20 73 4z" fill="#EE4A2E" />
      <path d="M71 28C76 42 98 52 102 78 106 102 90 124 70 126 50 124 34 104 38 80 41 66 50 62 54 52 58 62 63 64 66 62 62 52 65 38 71 28z" fill="#FF8A1F" />
      <ellipse cx="70" cy="96" rx="31" ry="27" fill="#FFC21E" />
      <circle cx="45" cy="106" r="5" fill="#FF8F6B" opacity=".55" />
      <circle cx="95" cy="106" r="5" fill="#FF8F6B" opacity=".55" />
      <circle cx="56" cy="93" r="4.4" fill="#3B3652" />
      <circle cx="84" cy="93" r="4.4" fill="#3B3652" />
      <circle cx="57.4" cy="91.6" r="1.4" fill="#fff" />
      <circle cx="85.4" cy="91.6" r="1.4" fill="#fff" />
      <g fill="rgba(255,255,255,.22)" stroke="#3A2A26" strokeWidth="2.6">
        <circle cx="56" cy="93" r="12.5" />
        <circle cx="84" cy="93" r="12.5" />
      </g>
      <path d="M68.5 91.5q1.5-2 3 0M43.6 90l-6-2M96.4 90l6-2" stroke="#3A2A26" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M49 86q3-3 7-3M77 86q3-3 7-3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M63 109Q70 116 77 109" stroke="#3B3652" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {showEmbers && (
        <g fill="#FF8A1F">
          <path d="M18 46q-6-9 0-18 6 9 0 18z" />
          <path d="M122 26q-5-8 0-16 5 8 0 16z" fill="#FF6A3A" />
          <path d="M128 98q-4-7 0-13 4 6 0 13z" />
          <path d="M14 122q-5-6 0-12 5 6 0 12z" fill="#FF6A3A" />
        </g>
      )}
    </svg>
  );
}
