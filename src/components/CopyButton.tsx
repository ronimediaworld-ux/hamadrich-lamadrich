import { useState } from 'react';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    /* אין הרשאת clipboard — ננסה fallback */
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    /* לא ניתן להעתיק — המשתמש יסמן ידנית */
  }
  document.body.removeChild(ta);
}

interface Props {
  text: string;
  label?: string;
  copiedLabel?: string;
  /** 'button' = כפתור מלא בסגנון האתר; 'mini' = כפתור טקסט קטן לפינת כרטיס */
  variant?: 'button' | 'mini';
  style?: React.CSSProperties;
}

export function CopyButton({ text, label = 'העתקה', copiedLabel = '✓ הועתק', variant = 'button', style }: Props) {
  const [copied, setCopied] = useState(false);

  async function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  if (variant === 'mini') {
    return (
      <button
        type="button"
        onClick={handle}
        className="no-print copy-mini"
        style={{
          border: '1px solid var(--line-strong)',
          background: copied ? 'var(--lime-tint)' : 'var(--paper)',
          color: copied ? 'var(--lime-ink)' : 'var(--ink-soft)',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Heebo, sans-serif',
          ...style,
        }}
      >
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="btn btn-outline no-print"
      style={{ justifyContent: 'center', background: copied ? 'var(--lime-tint)' : undefined, borderColor: copied ? 'var(--lime)' : undefined, ...style }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
