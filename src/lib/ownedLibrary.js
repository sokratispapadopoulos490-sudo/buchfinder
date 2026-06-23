/**
 * ownedLibrary.js
 * Utility für das Matching empfohlener Bücher gegen physische Bestände.
 *
 * Matching-Priorität (absteigend):
 *   1. isbn13 (beide Seiten bereinigt)
 *   2. isbn10
 *   3. source_id (Google Books volumeId)
 *   4. normalisierter Titel + erster Autor
 *
 * "Owned" = physical_copy === true  ODER
 *            ownership_status in ['owned', 'read', 'currently_reading']
 *            ODER keine dieser Felder gesetzt aber physical_copy nicht explizit false
 *            (Abwärtskompatibilität: alte Einträge ohne Felder gelten als owned wenn vorhanden)
 */

import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/** Normalisiert eine ISBN-Zeichenkette (entfernt Bindestriche/Leerzeichen) */
function normalizeISBN(isbn) {
  return (isbn || '').replace(/[-\s]/g, '').trim();
}

/** Normalisiert einen Titel für den Fallback-Vergleich */
function normalizeTitle(title) {
  return (title || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Erster Autor normalisiert */
function firstAuthor(book) {
  const a = book.authors || book.author || '';
  const first = Array.isArray(a) ? a[0] : a.split(',')[0];
  return (first || '').toLowerCase().trim();
}

/**
 * Bestimmt, ob ein SavedBook als "owned" gilt.
 * Abwärtskompatibel: Fehlen die neuen Felder, gilt der Eintrag als owned.
 */
export function isOwnedEntry(savedBook) {
  // Explizit nicht-physisch und kein relevanter Status → nicht owned
  if (savedBook.physical_copy === false) {
    const ownedStatuses = ['owned', 'read', 'currently_reading'];
    return ownedStatuses.includes(savedBook.ownership_status);
  }
  // physical_copy=true → owned
  if (savedBook.physical_copy === true) return true;
  // Feld nicht gesetzt (ältere Einträge) → owned wenn ownership_status passt oder keiner gesetzt
  if (savedBook.ownership_status) {
    return ['owned', 'read', 'currently_reading'].includes(savedBook.ownership_status);
  }
  // Altes Buch ohne physische Felder → als owned betrachten (es ist in der Merkliste)
  return true;
}

/**
 * Baut eine Lookup-Map aus SavedBooks für schnelles Matching.
 * Gibt ein Objekt zurück: { ownedSet: Set<string>, savedBooks: [...] }
 */
export function buildOwnedIndex(savedBooks) {
  const ownedSet = new Set();
  for (const sb of savedBooks) {
    if (!isOwnedEntry(sb)) continue;
    const bd = sb.book_data || {};
    const isbn13 = normalizeISBN(bd.isbn13);
    const isbn10 = normalizeISBN(bd.isbn10);
    const sid = bd.source_id || '';
    const titleKey = `${normalizeTitle(bd.title)}|${firstAuthor(bd)}`;
    if (isbn13) ownedSet.add(`isbn13:${isbn13}`);
    if (isbn10) ownedSet.add(`isbn10:${isbn10}`);
    if (sid) ownedSet.add(`sid:${sid}`);
    if (bd.title) ownedSet.add(`title:${titleKey}`);
  }
  return ownedSet;
}

/**
 * Prüft, ob ein Buch (aus Recommendation/BookCard) im owned-Index enthalten ist.
 */
export function isBookOwned(book, ownedSet) {
  if (!ownedSet || ownedSet.size === 0) return false;
  const isbn13 = normalizeISBN(book.isbn13);
  const isbn10 = normalizeISBN(book.isbn10);
  const sid = book.source_id || '';
  const titleKey = `${normalizeTitle(book.title)}|${firstAuthor(book)}`;

  return (
    (isbn13 && ownedSet.has(`isbn13:${isbn13}`)) ||
    (isbn10 && ownedSet.has(`isbn10:${isbn10}`)) ||
    (sid && ownedSet.has(`sid:${sid}`)) ||
    (book.title && ownedSet.has(`title:${titleKey}`))
  );
}

/**
 * React-Hook: Lädt SavedBooks einmalig und stellt den owned-Index bereit.
 * Cached im Modul-Scope für die Sitzung (kein Netzwerk-Overhead bei mehreren BookCards).
 */
let _cachedIndex = null;
let _cachePromise = null;

export function useOwnedLibrary() {
  const [ownedSet, setOwnedSet] = useState(_cachedIndex);
  const [hasOwned, setHasOwned] = useState(_cachedIndex ? _cachedIndex.size > 0 : false);

  useEffect(() => {
    if (_cachedIndex !== null) {
      setOwnedSet(_cachedIndex);
      setHasOwned(_cachedIndex.size > 0);
      return;
    }
    if (!_cachePromise) {
      _cachePromise = base44.auth.isAuthenticated().then(auth => {
        if (!auth) return new Set();
        return base44.entities.SavedBook.list('-created_date', 500)
          .then(books => buildOwnedIndex(books))
          .catch(() => new Set());
      });
    }
    _cachePromise.then(idx => {
      _cachedIndex = idx;
      setOwnedSet(idx);
      setHasOwned(idx.size > 0);
    });
  }, []);

  const checkOwned = useCallback((book) => isBookOwned(book, ownedSet), [ownedSet]);

  return { ownedSet, hasOwned, checkOwned };
}

/** Cache-Invalidierung (nach LibraryCapture-Speicherung aufrufen falls gewünscht) */
export function invalidateOwnedCache() {
  _cachedIndex = null;
  _cachePromise = null;
}