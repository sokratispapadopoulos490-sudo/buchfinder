/**
 * clientCache.js – Leichtgewichtiger In-Memory TTL-Cache für den Browser.
 *
 * Zweck: Dedupliziert identische Google-Books-Queries innerhalb eines Tabs.
 * Verhindert unnötige API-Calls bei wiederholter Suche oder Sprachänderung.
 *
 * Features:
 * - TTL pro Eintrag (default: 15 Minuten)
 * - Key = queryString + bookLanguage (zwei unabhängige Suchparameter)
 * - Kein localStorage – nur Arbeitsspeicher, wird bei Tab-Close geleert
 * - Automatische Expiry-Bereinigung
 * - Sicher für Multi-User: kein Cross-User-Cache (Instanz pro Tab)
 */

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 Minuten

const _store = new Map(); // key → { value, expiresAt }

/**
 * Erstellt einen Cache-Key aus Query + optionalen Parametern.
 * bookLanguage ist relevant, shoppingRegion NICHT (Links werden dynamisch generiert).
 */
export function makeCacheKey(query, bookLanguage = '', startIndex = 0) {
  return `${query.trim().toLowerCase()}|${bookLanguage}|${startIndex}`;
}

export function cacheGet(key) {
  const entry = _store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _store.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  _store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheDelete(key) {
  _store.delete(key);
}

/**
 * Löscht alle gecachten Einträge – z.B. nach Logout oder User-Wechsel.
 */
export function cacheClear() {
  _store.clear();
}

/**
 * Löscht alle abgelaufenen Einträge (housekeeping).
 */
export function cachePurgeExpired() {
  const now = Date.now();
  for (const [key, entry] of _store) {
    if (now > entry.expiresAt) _store.delete(key);
  }
}

// Automatisches Housekeeping alle 5 Minuten
setInterval(cachePurgeExpired, 5 * 60 * 1000);