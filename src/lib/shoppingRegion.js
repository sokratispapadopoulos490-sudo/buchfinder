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

const BOOK_LANG_KEY   = 'bc_book_lang';
const SHOP_REGION_KEY = 'bc_shop_region';

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
function detectDefaultRegion() {
  try {
    const locale = navigator.language || 'de-DE';
    const country = locale.split('-')[1]?.toUpperCase();
    // Unterstützte Regionen
    const supported = ['DE', 'AT', 'CH', 'GR', 'TR', 'FR', 'ES', 'IT', 'UK', 'US'];
    if (supported.includes(country)) return country;
    // Sprach-Fallback
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

export function setShoppingRegion(region) {
  try {
    localStorage.setItem(SHOP_REGION_KEY, region);
    // CustomEvent statt StorageEvent – konsistenter Cross-Browser-Support
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
      if (!current) localStorage.setItem(BOOK_LANG_KEY, user.book_language);
    }
    if (user.shopping_region) {
      const current = localStorage.getItem(SHOP_REGION_KEY);
      if (!current) localStorage.setItem(SHOP_REGION_KEY, user.shopping_region);
    }
  } catch {}
}

/**
 * Bereinigt alle Präferenzen bei Logout.
 * bookLanguage und shoppingRegion werden gelöscht (nicht uiLanguage).
 */
export function clearBookPreferences() {
  try {
    localStorage.removeItem(BOOK_LANG_KEY);
    localStorage.removeItem(SHOP_REGION_KEY);
  } catch {}
}