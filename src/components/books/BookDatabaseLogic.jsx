/**
 * @deprecated Verwende stattdessen bookService.js
 *
 * Dieser File ist ein Thin Wrapper für Rückwärtskompatibilität.
 * Alle neuen Komponenten sollen getMatchingBooksFromDB() aus lib/bookService.js verwenden.
 * Nach vollständiger Migration kann dieser File gelöscht werden.
 */
export { getMatchingBooksSync as getMatchingBooks } from '@/lib/bookService';