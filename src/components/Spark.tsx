import { useId } from 'react';

// ניצוץ: להבה חמודה עם משקפיים, ידיים ורגליים, מונפשת (נשימה, ריצוד להבה, מצמוץ, נפנוף ידיים וניצנוצים).
// בגדלים גדולים מוצג הגוף כולו; באייקונים קטנים רק הראש (עם קווים עבים יותר כדי שהמשקפיים יישארו ברורים).
// האנימציות מוגדרות ב-global.css (.spark-*), ומושבתות כשהמשתמש מבקש פחות תנועה.
type SparkProps = {
  size?: number;
  className?: string;
  /** ברירת מחדל: גוף שלם מגודל 64 ומעלה, ראש בלבד מתחת לכך */
  body?: boolean;
  /** ברירת מחדל: מונפש מגודל 30 ומעלה */
  animate?: boolean;
};

const NAVY = '#2A2040';

export function Spark({ size = 40, className, body, animate }: SparkProps) {
  const uid = useId().replace(/:/g, '');
  const full = body ?? size >= 64;
  const anim = animate ?? size >= 30;
  const k = full ? 1 : 2.3; // עובי קווים דקים (משקפיים, גבות, חיוך)
  const viewBox = full ? '340 40 810 930' : '410 40 680 830';
  const width = full ? (size * 810) / 930 : (size * 680) / 830;
  const height = size;
  const cls = ['spark', anim ? (full ? 'spark-anim' : 'spark-anim spark-lite') : '', className].filter(Boolean).join(' ');

  return (
    <svg width={width} height={height} viewBox={viewBox} className={cls} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}o`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF4A06" />
          <stop offset="1" stopColor="#FF7A12" />
        </linearGradient>
        <linearGradient id={`${uid}m`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF8A00" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
        <radialGradient id={`${uid}f`} cx="0.55" cy="0.5" r="0.65">
          <stop offset="0" stopColor="#FFDC4D" />
          <stop offset="1" stopColor="#FFBE00" />
        </radialGradient>
      </defs>

      <g className="spark-root">
        {full && (
          <>
            {/* רגליים */}
            <g className="spark-leg spark-leg-l" stroke={NAVY} strokeWidth="26" strokeLinecap="round" fill="none">
              <path d="M692 846 L668 912" />
              <path d="M612 934 q-4-22 30-22 q38 2 46 14 q2 20-30 22 q-34 4-46-14z" fill={NAVY} stroke="none" />
            </g>
            <g className="spark-leg spark-leg-r" stroke={NAVY} strokeWidth="26" strokeLinecap="round" fill="none">
              <path d="M786 848 L782 915" />
              <path d="M770 936 q0-24 30-22 q40-2 52 18 q-2 24-34 24 q-44 2-48-20z" fill={NAVY} stroke="none" />
            </g>
            {/* ידיים */}
            <g className="spark-arm spark-arm-l">
              <path d="M522 760 Q470 794 420 774" stroke={NAVY} strokeWidth="23" strokeLinecap="round" fill="none" />
              <circle cx="418" cy="774" r="22" fill={NAVY} />
            </g>
            <g className="spark-arm spark-arm-r">
              <path d="M1024 690 Q1080 664 1088 624 Q1094 596 1106 590" stroke={NAVY} strokeWidth="23" strokeLinecap="round" fill="none" />
              <circle cx="1106" cy="590" r="22" fill={NAVY} />
            </g>
          </>
        )}

        {/* להבה */}
        <g className="spark-flame">
          <path
            className="spark-outer"
            d="M708 62C880 88 976 232 970 420L965 440 1005 400C1052 470 1068 574 1020 692 960 794 876 860 740 860 580 860 468 790 438 680 418 560 468 450 560 346 600 306 620 288 632 250 650 264 662 286 669 307 722 250 742 168 708 62Z"
            fill={`url(#${uid}o)`}
          />
          <path
            className="spark-mid"
            d="M800 158C930 232 948 352 940 480 1000 540 1012 612 986 684 922 792 830 852 740 852 600 852 496 782 470 646 466 566 520 500 600 442 660 400 700 390 760 352 806 322 808 240 800 158Z"
            fill={`url(#${uid}m)`}
          />
          <path
            className="spark-face-layer"
            d="M853 285C906 340 930 420 936 482 992 560 1012 640 978 704 924 794 832 846 740 848 622 848 522 782 496 690 480 628 500 558 560 492 624 438 704 458 762 424 822 398 852 358 853 285Z"
            fill={`url(#${uid}f)`}
          />

          {/* לחיים */}
          <ellipse cx="626" cy="690" rx="40" ry="28" fill="#FF8A5C" />
          <ellipse cx="922" cy="652" rx="38" ry="28" fill="#FF8A5C" />

          {/* עיניים */}
          <g className="spark-eyes">
            <ellipse cx="648" cy="636" rx="27" ry="39" fill={NAVY} transform="rotate(-4 648 636)" />
            <ellipse cx="893" cy="602" rx="27" ry="39" fill={NAVY} transform="rotate(-4 893 602)" />
            <ellipse cx="657" cy="616" rx="7" ry="12" fill="#fff" />
            <ellipse cx="902" cy="582" rx="7" ry="12" fill="#fff" />
          </g>

          {/* גבות, חיוך */}
          <g className="spark-brows" stroke={NAVY} strokeWidth={8.5 * k} strokeLinecap="round" fill="none">
            <path d="M600 526 Q620 492 652 503" />
            <path d="M850 478 Q876 462 898 490" />
          </g>
          <path className="spark-smile" d="M752 690 C758 716 804 720 812 686" stroke={NAVY} strokeWidth={8.5 * k} strokeLinecap="round" fill="none" />

          {/* משקפיים */}
          <g className="spark-glasses" stroke={NAVY} strokeWidth={8 * k} strokeLinecap="round" fill="rgba(255,255,255,.08)">
            <circle cx="642" cy="637" r="93" />
            <circle cx="889" cy="604" r="93" />
            <path d="M735 612 Q765 588 796 600" fill="none" />
            <path d="M517 640 L548 634 M985 578 L997 578" fill="none" />
          </g>
        </g>

        {/* ניצנוצים */}
        {full && (
          <g className="spark-sparks" stroke="#FFC107" strokeWidth="22" strokeLinecap="round" fill="none">
            <path className="spark-s spark-s1" d="M424 318 L468 374" />
            <path className="spark-s spark-s2" d="M370 394 L436 420" />
            <path className="spark-s spark-s3" d="M1036 344 L1060 290" />
            <path className="spark-s spark-s4" d="M1068 372 L1126 334" />
          </g>
        )}
      </g>
    </svg>
  );
}
