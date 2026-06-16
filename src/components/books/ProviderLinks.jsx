/**
 * ProviderLinks – Zeigt Kauf-/Gebraucht-Links für ein Buch an.
 *
 * Strategie:
 *   - Wenn bookLanguage und shoppingRegion auf DIESELBE Region zeigen → einfache Liste (bisheriges Verhalten)
 *   - Wenn sie UNTERSCHIEDLICH sind → 3 Gruppen:
 *       1. "Passend zur Buchsprache"  – Provider der Buchsprach-Region (z.B. GR für 'el')
 *       2. "In deiner Kaufregion"     – Provider der Shopping-Region (z.B. DE)
 *       3. "Gebraucht & Marktplatz"  – Used-Provider aus beiden Regionen, dedupliziert
 *
 * bookLanguage und shoppingRegion bleiben vollständig getrennt – keine implizite Ableitung.
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Tag, Headphones } from 'lucide-react';
import { getProviderLinksForBook } from '@/lib/providerRegistry';
import { useLanguage } from '@/components/language/LanguageContext';

// ISO 639-1 bookLanguage → REGION_REGISTRY key
const LANG_TO_REGION = {
  el: 'GR', tr: 'TR', fr: 'FR', es: 'ES', it: 'IT', en: 'UK', de: 'DE',
};

// Typ-Badges
const TYPE_STYLE = {
  new:         { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', key: 'provider.new' },
  used:        { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400',     key: 'provider.used' },
  marketplace: { bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',       key: 'provider.marketplace' },
  ebook:       { bg: 'bg-purple-100 dark:bg-purple-900/30',   text: 'text-purple-700 dark:text-purple-400',   key: 'provider.ebook' },
  audiobook:   { bg: 'bg-pink-100 dark:bg-pink-900/30',       text: 'text-pink-700 dark:text-pink-400',       key: 'provider.audiobook' },
  discovery:   { bg: 'bg-stone-100 dark:bg-stone-800',        text: 'text-stone-500 dark:text-stone-400',     key: 'provider.discovery' },
};

function TypeBadge({ type, t }) {
  const style = TYPE_STYLE[type] || TYPE_STYLE.new;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
      {t(style.key, type)}
    </span>
  );
}

function ProviderButton({ link, t }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
          {link.providerName}
        </span>
        <TypeBadge type={link.type} t={t} />
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 flex-shrink-0 transition-colors" />
    </a>
  );
}

function SectionHeader({ title, subtitle, isFirst = false }) {
  return (
    <div className={`${isFirst ? '' : 'mt-4'} mb-2`}>
      <p className="text-xs font-semibold text-stone-700 dark:text-stone-200 leading-tight">{title}</p>
      {subtitle && (
        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 leading-tight">{subtitle}</p>
      )}
    </div>
  );
}

/** Deduplicate by providerId, keeping first occurrence */
function dedup(links) {
  const seen = new Set();
  return links.filter(l => {
    if (seen.has(l.providerId)) return false;
    seen.add(l.providerId);
    return true;
  });
}

export default function ProviderLinks({ book, shoppingRegion = 'DE', bookLanguage = '', className = '' }) {
  const { t } = useLanguage();
  const [showUsed, setShowUsed] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  // Derive region from bookLanguage (if set)
  const langRegion = bookLanguage ? (LANG_TO_REGION[bookLanguage] || null) : null;

  // Are the two regions actually different?
  const hasDualRegion = langRegion && langRegion !== shoppingRegion;

  // ── Audiobook links (always from shoppingRegion, no grouping needed)
  const audioLinks = getProviderLinksForBook(book, shoppingRegion, { types: ['audiobook'], limit: 2 });
  const hasAudio = audioLinks.length > 0;

  if (hasDualRegion) {
    // ── GROUP MODE ─────────────────────────────────────────────────────────────
    // Group 1: Buchsprach-Region (new + marketplace, top 3)
    const langLinks = getProviderLinksForBook(book, langRegion, { types: ['new', 'marketplace'], limit: 3 });
    // Group 2: Kaufregion (new + marketplace, top 3, exclude any already shown)
    const shoppingLinksRaw = getProviderLinksForBook(book, shoppingRegion, { types: ['new', 'marketplace'], limit: 4 });
    const shownIds = new Set(langLinks.map(l => l.providerId));
    const shopLinks = shoppingLinksRaw.filter(l => !shownIds.has(l.providerId)).slice(0, 3);
    // Group 3: Used from both regions, deduplicated
    const usedLang = getProviderLinksForBook(book, langRegion, { types: ['used'], limit: 3 });
    const usedShop = getProviderLinksForBook(book, shoppingRegion, { types: ['used'], limit: 3 });
    const usedLinks = dedup([...usedLang, ...usedShop]);

    const FLAG_MAP = { GR: '🇬🇷', DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭', TR: '🇹🇷', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', UK: '🇬🇧', US: '🇺🇸' };
    const LANG_LABEL = { el: 'Griechisch', tr: 'Türkisch', fr: 'Französisch', es: 'Spanisch', it: 'Italienisch', en: 'Englisch', de: 'Deutsch' };

    const hasAnyContent = langLinks.length > 0 || shopLinks.length > 0 || usedLinks.length > 0 || hasAudio;
    if (!hasAnyContent) return null;

    return (
      <div className={`space-y-0.5 ${className}`}>
        {/* Group 1: Buchsprach-Region */}
        {langLinks.length > 0 && (
          <>
            <SectionHeader
              isFirst
              title={`${FLAG_MAP[langRegion] || ''} Passend zur Buchsprache`}
              subtitle={`${LANG_LABEL[bookLanguage] || bookLanguage}sprachige Anbieter`}
            />
            <div className="space-y-2">
              {langLinks.map(link => <ProviderButton key={link.providerId + link.url} link={link} t={t} />)}
            </div>
          </>
        )}

        {/* Group 2: Kaufregion */}
        {shopLinks.length > 0 && (
          <>
            <SectionHeader
              title={`${FLAG_MAP[shoppingRegion] || ''} In deiner Kaufregion`}
              subtitle={`Suche in ${shoppingRegion}`}
            />
            <div className="space-y-2">
              {shopLinks.map(link => <ProviderButton key={link.providerId + link.url} link={link} t={t} />)}
            </div>
          </>
        )}

        {/* Group 3: Used toggle */}
        {usedLinks.length > 0 && (
          <>
            <button
              onClick={() => setShowUsed(v => !v)}
              className="w-full flex items-center justify-between gap-2 px-1 py-2 mt-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors border-t border-stone-100 dark:border-stone-800"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Gebraucht &amp; Marktplatz
              </span>
              {showUsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showUsed && (
              <div className="space-y-2">
                {usedLinks.map(link => <ProviderButton key={link.providerId + link.url} link={link} t={t} />)}
              </div>
            )}
          </>
        )}

        {/* Audiobook */}
        {hasAudio && (
          <>
            <button
              onClick={() => setShowAudio(v => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              <Headphones className="w-3 h-3" />
              {t('provider.audiobook', 'Hörbuch')}
              {showAudio ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showAudio && audioLinks.map(link => (
              <ProviderButton key={link.providerId + link.url} link={link} t={t} />
            ))}
          </>
        )}
      </div>
    );
  }

  // ── SIMPLE MODE (same region or no bookLanguage) ────────────────────────────
  const effectiveRegion = langRegion || shoppingRegion;
  const newLinks  = getProviderLinksForBook(book, effectiveRegion, { types: ['new', 'marketplace'], limit: 3 });
  const usedLinks = getProviderLinksForBook(book, effectiveRegion, { types: ['used'], limit: 2 });
  const hasUsedSimple = usedLinks.length > 0;

  if (newLinks.length === 0 && !hasUsedSimple && !hasAudio) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {newLinks.map(link => (
        <ProviderButton key={link.providerId + link.url} link={link} t={t} />
      ))}

      {hasUsedSimple && (
        <>
          <button
            onClick={() => setShowUsed(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
          >
            <Tag className="w-3 h-3" />
            {showUsed ? t('provider.hideUsed') : t('provider.showUsed')}
            {showUsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showUsed && usedLinks.map(link => (
            <ProviderButton key={link.providerId + link.url} link={link} t={t} />
          ))}
        </>
      )}

      {hasAudio && (
        <>
          <button
            onClick={() => setShowAudio(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <Headphones className="w-3 h-3" />
            {t('provider.audiobook', 'Hörbuch')}
            {showAudio ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showAudio && (
            <>
              {audioLinks.map(link => (
                <ProviderButton key={link.providerId + link.url} link={link} t={t} />
              ))}
              <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center px-2">
                {t('provider.audioHint', 'Verfügbarkeit unbekannt – Suche auf der Anbieter-Seite')}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}