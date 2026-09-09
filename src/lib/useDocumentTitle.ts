import { useEffect } from 'react';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — המדריך למדריך` : 'המדריך למדריך';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
