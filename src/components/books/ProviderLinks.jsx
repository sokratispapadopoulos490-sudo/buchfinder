/**
 * ProviderLinks – Zeigt Kauf-/Gebraucht-Links für ein Buch an.
 *
 * Nutzt providerRegistry.getProviderLinksForBook() mit der shoppingRegion.
 * Zeigt max. 3 neue Anbieter + optional 1-2 Gebraucht-Anbieter.
 * Used-Links sind klar als "Gebraucht" gekennzeichnet.
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { getProviderLinksForBook } from '@/lib/providerRegistry';
import { useLanguage } from '@/components/language/LanguageContext';

// Typ-Badges: Farbe + i18n-Key
const TYPE_STYLE = {
  new:        { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', key: 'provider.new' },
  used:       { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400',     key: 'provider.used' },
  marketplace:{ bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',       key: 'provider.marketplace' },
  ebook:      { bg: 'bg-purple-100 dark:bg-purple-900/30',   text: 'text-purple-700 dark:text-purple-400',   key: 'provider.ebook' },
  audiobook:  { bg: 'bg-pink-100 dark:bg-pink-900/30',       text: 'text-pink-700 dark:text-pink-400',       key: 'provider.audiobook' },
  discovery:  { bg: 'bg-stone-100 dark:bg-stone-800',        text: 'text-stone-500 dark:text-stone-400',     key: 'provider.discovery' },
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

export default function ProviderLinks({ book, shoppingRegion = 'DE', className = '' }) {
  const { t } = useLanguage();
  const [showUsed, setShowUsed] = useState(false);

  // Neue Bücher: top 3
  const newLinks = getProviderLinksForBook(book, shoppingRegion, { types: ['new', 'marketplace'], limit: 3 });
  // Gebraucht: top 2
  const usedLinks = getProviderLinksForBook(book, shoppingRegion, { types: ['used'], limit: 2 });

  const hasUsed = usedLinks.length > 0;

  if (newLinks.length === 0 && !hasUsed) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Neue Anbieter */}
      {newLinks.map(link => (
        <ProviderButton key={link.providerId + link.url} link={link} t={t} />
      ))}

      {/* Used-Toggle */}
      {hasUsed && (
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
    </div>
  );
}