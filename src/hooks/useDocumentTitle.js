import { useEffect } from 'react';

/**
 * Setzt den document.title der aktuellen Seite im Format "<title> | Book Compass".
 * Läuft bei jeder Änderung von title (z.B. Sprachwechsel) erneut.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Book Compass` : 'Book Compass';
  }, [title]);
}