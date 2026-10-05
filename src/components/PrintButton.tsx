import { useState } from 'react';
import { DownloadIcon } from './Icons';
import { offerPrint, offerHtml } from '../lib/printFile';

interface Props {
  filename: string;
  title: string;
  text?: string;
  buildHtml?: () => string;
  label?: string;
  style?: React.CSSProperties;
}

export function PrintButton({ filename, title, text, buildHtml, label = 'הורדה להדפסה', style }: Props) {
  const [status, setStatus] = useState<'idle' | 'working' | 'downloaded' | 'declined'>('idle');

  async function handleClick() {
    if (status === 'working') return;
    setStatus('working');
    const result = buildHtml ? await offerHtml(filename, buildHtml()) : await offerPrint(filename, title, text ?? '');
    if (result === 'downloaded') {
      setStatus('downloaded');
      window.setTimeout(() => setStatus('idle'), 5000);
    } else if (result === 'declined') {
      setStatus('declined');
      window.setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('idle');
    }
  }

  const shownLabel =
    status === 'downloaded' ? '✓ הקובץ ירד — פתחו והדפיסו'
    : status === 'declined' ? 'לא הורד'
    : status === 'working' ? 'רגע...'
    : label;

  return (
    <button
      type="button"
      className="btn btn-flame no-print"
      onClick={handleClick}
      disabled={status === 'working'}
      style={{ justifyContent: 'center', ...style }}
    >
      <DownloadIcon size={15} />{shownLabel}
    </button>
  );
}
