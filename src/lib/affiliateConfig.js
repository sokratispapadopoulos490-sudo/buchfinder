/**
 * affiliateConfig.js
 *
 * Central configuration for affiliate partner IDs.
 *
 * ─── HOW TO MONETIZE ───────────────────────────────────────────────────────────
 * 1. Sign up for each affiliate program:
 *    - Amazon: https://partnernet.amazon.de (DE) / affiliate-program.amazon.com (US/UK)
 *    - Thalia:  https://www.thalia.de/partnerprogramm
 *    - Hugendubel: Contact them directly for partner ID
 *    - Geniuslink: https://geniuslink.com (universal smart link wrapper)
 *
 * 2. Fill in your partner IDs below where it says "INSERT_YOUR_ID_HERE".
 *
 * 3. Set GENIUSLINK_ENABLED = true and provide GENIUSLINK_TAG to route ALL
 *    links through Geniuslink for automatic geo-routing and analytics.
 *
 * ─── MONETIZATION STATUS ───────────────────────────────────────────────────────
 * Links without a partner ID still work as regular shopper links —
 * users can buy, but you earn no commission.
 * isMonetized = false means the link is live but unmonetized.
 * ───────────────────────────────────────────────────────────────────────────────
 */

export const AFFILIATE_IDS = {
  // Amazon Associates
  amazon_de:      null, // ← INSERT your Amazon.de tag, e.g. "bookcompass-21"
  amazon_us:      null, // ← INSERT your Amazon.com tag, e.g. "bookcompass-20"
  amazon_uk:      null, // ← INSERT your Amazon.co.uk tag, e.g. "bookcompass-21"
  amazon_at:      null, // ← Same as amazon_de for Austria (uses .de marketplace)

  // German / European bookstores
  thalia:         null, // ← INSERT Thalia partner ID
  hugendubel:     null, // ← INSERT Hugendubel partner ID

  // Swiss bookstores
  exlibris:       null, // ← INSERT Ex Libris partner ID
  orellfuessli:   null, // ← INSERT Orell Füssli partner ID

  // UK / US
  bookshop_uk:    null, // ← INSERT Bookshop.org UK affiliate ID
  barnes_noble:   null, // ← INSERT Barnes & Noble affiliate ID

  // Greek bookstores
  ianos:          null, // ← INSERT Ianos partner ID
  public_gr:      null, // ← INSERT Public.gr partner ID
};

/**
 * Geniuslink (universal smart link) – wraps all URLs for geo-routing.
 * When enabled, a single link auto-redirects to the user's local store.
 * Set tag to your Geniuslink account tag to enable.
 */
export const GENIUSLINK_TAG = null; // ← INSERT your Geniuslink tag to enable

/**
 * Builds the affiliate query string for Amazon URLs.
 * Returns empty string if no tag is configured.
 */
export function getAmazonTag(providerKey) {
  const tag = AFFILIATE_IDS[providerKey];
  return tag ? `?tag=${tag}` : '';
}

/**
 * Wraps a URL through Geniuslink if configured.
 * Otherwise returns the original URL unchanged.
 */
export function wrapWithGeniuslink(url) {
  if (!GENIUSLINK_TAG) return url;
  return `https://go.geni.us/to?url=${encodeURIComponent(url)}&tag=${GENIUSLINK_TAG}`;
}

/**
 * Returns true if a given provider has a real affiliate ID configured.
 * Useful for internal dashboards / debugging.
 */
export function isMonetized(providerKey) {
  return !!AFFILIATE_IDS[providerKey] || !!GENIUSLINK_TAG;
}