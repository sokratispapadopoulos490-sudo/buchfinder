/**
 * shoppingRegion.js – Verwaltung von bookLanguage und shoppingRegion.
 *
 * Drei klar getrennte Konzepte:
 *
 *   uiLanguage     (in LanguageContext, key: 'appLanguage')
 *   → Sprache der App-Oberfläche (Buttons, Labels, Menüs)
 *   → Wird von LanguageContext/AuthContext verwaltet
 *
 *   bookLanguage   (key: 'bc_book_lang', dieser Service)
 *   → Sprache der gesuchten Bücher (langRestrict für Google Books)
 *   → '' = alle Sprachen
 *   → Standard: '' (keine Einschränkung)
 *
 *   shoppingRegion (key: 'bc_shop_region', dieser Service)
 *   → Region für Kauf-/Affiliate-Links (Amazon.de vs. Amazon.fr etc.)
 *   → Standard: 'DE' (oder aus Browser-Locale abgeleitet)
 *   → Unabhängig von uiLanguage: z.B. UI=Greek, Region=DE ist gültig
 */

const BOOK_LANG_KEY      = 'bc_book_lang';
const SHOP_REGION_KEY    = 'bc_shop_region';
const SHOP_EXPLICIT_KEY  = 'bc_shop_region_explicit';

// ─── bookLanguage ─────────────────────────────────────────────────────────────

export function getBookLanguage() {
  try { return localStorage.getItem(BOOK_LANG_KEY) || ''; } catch { return ''; }
}

export function setBookLanguage(lang) {
  try {
    if (lang) localStorage.setItem(BOOK_LANG_KEY, lang);
    else localStorage.removeItem(BOOK_LANG_KEY);
    // CustomEvent statt StorageEvent – konsistenter Cross-Browser-Support
    window.dispatchEvent(new CustomEvent('bc:book_lang', { detail: { key: BOOK_LANG_KEY, newValue: lang } }));
  } catch {}
}

// ─── shoppingRegion ───────────────────────────────────────────────────────────

/**
 * Leitet die Standard-Region aus dem Browser-Locale ab.
 * Kein API-Call, kein IP-Lookup — rein client-seitig.
 */
/**
 * Leitet die Standard-Region NUR aus dem Browser-Locale ab.
 * appLanguage und bookLanguage werden NICHT berücksichtigt —
 * die Kaufregion ist strikt unabhängig von der App-/Buchsprache.
 */
function detectDefaultRegion() {
  try {
    const locale = navigator.language || 'de-DE';
    // 1. Versuch: expliziter Ländercode im Locale (z.B. "de-DE" → "DE")
    const country = locale.split('-')[1]?.toUpperCase();
    const supported = ['DE', 'AT', 'CH', 'GR', 'TR', 'FR', 'ES', 'IT', 'UK', 'US'];
    if (supported.includes(country)) return country;
    // 2. Fallback: Sprachteil des Locale (z.B. "de" → "DE")
    const lang = locale.split('-')[0].toLowerCase();
    const langMap = { de: 'DE', el: 'GR', tr: 'TR', fr: 'FR', es: 'ES', it: 'IT', en: 'UK' };
    return langMap[lang] || 'DE';
  } catch { return 'DE'; }
}

export function getShoppingRegion() {
  try {
    return localStorage.getItem(SHOP_REGION_KEY) || detectDefaultRegion();
  } catch { return 'DE'; }
}

/**
 * Setzt die Kaufregion.
 * @param {string} region  – Regionscode (z.B. 'DE', 'GR')
 * @param {object} [options]
 * @param {boolean} [options.explicit=true] – true wenn der Nutzer die Region bewusst gewählt hat.
 *   Nur bei internem/automatischem Setzen (z.B. Profil-Sync) auf false setzen.
 */
export function setShoppingRegion(region, options = {}) {
  const { explicit = true } = options;
  try {
    localStorage.setItem(SHOP_REGION_KEY, region);
    if (explicit) {
      localStorage.setItem(SHOP_EXPLICIT_KEY, '1');
    }
    window.dispatchEvent(new CustomEvent('bc:shop_region', { detail: { key: SHOP_REGION_KEY, newValue: region } }));
  } catch {}
}

// ─── Persistence für User-Profil ─────────────────────────────────────────────

/**
 * Schreibt bookLanguage + shoppingRegion in das User-Profil (stille Operation).
 * Wird nach Login aufgerufen, um Einstellungen geräteübergreifend zu synchronisieren.
 */
export async function syncPreferencesToProfile(base44) {
  try {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) return;
    await base44.auth.updateMe({
      book_language: getBookLanguage(),
      shopping_region: getShoppingRegion(),
      shopping_region_explicit: hasExplicitShoppingRegion(),
    }).catch(() => {});
  } catch {}
}

/**
 * Lädt gespeicherte Präferenzen aus dem User-Profil und schreibt sie in localStorage.
 * Wird nach me()-Call aufgerufen.
 */
export function loadPreferencesFromProfile(user) {
  if (!user) return;
  try {
    if (user.book_language !== undefined && user.book_language !== null) {
      const current = localStorage.getItem(BOOK_LANG_KEY);
      if (!current) {
        localStorage.setItem(BOOK_LANG_KEY, user.book_language);
        window.dispatchEvent(new CustomEvent('bc:book_lang', { detail: { key: BOOK_LANG_KEY, newValue: user.book_language } }));
      }
    }
    if (user.shopping_region) {
      const current = localStorage.getItem(SHOP_REGION_KEY);
      if (!current) {
        localStorage.setItem(SHOP_REGION_KEY, user.shopping_region);
        // Nur als explizit markieren, wenn das Profil es ausdrücklich sagt.
        // Falls shopping_region_explicit im Profil nicht existiert (undefined),
        // wird konservativ NICHT als explizit markiert — der Nutzer muss
        // die Region erneut in den Einstellungen wählen, damit sie als
        // bewusste Wahl gilt.
        if (user.shopping_region_explicit === true) {
          localStorage.setItem(SHOP_EXPLICIT_KEY, '1');
        }
        window.dispatchEvent(new CustomEvent('bc:shop_region', { detail: { key: SHOP_REGION_KEY, newValue: user.shopping_region } }));
      }
    }
  } catch {}
}

/**
 * Returns true only when the user has EXPLICITLY chosen a shopping region
 * (via Account settings UI). Automatically guessed or profile-synced values
 * without explicit flag do NOT count as explicit.
 */
export function hasExplicitShoppingRegion() {
  try { return localStorage.getItem(SHOP_EXPLICIT_KEY) === '1'; } catch { return false; }
}

/**
 * Bereinigt alle Präferenzen bei Logout.
 * bookLanguage und shoppingRegion werden gelöscht (nicht uiLanguage).
 */
export function clearBookPreferences() {
  try {
    localStorage.removeItem(BOOK_LANG_KEY);
    localStorage.removeItem(SHOP_REGION_KEY);
    localStorage.removeItem(SHOP_EXPLICIT_KEY);
  } catch {}
}