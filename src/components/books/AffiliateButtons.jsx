/**
 * AffiliateButtons – Dynamic provider buttons for a book.
 * Renders provider links based on detected country, tracks clicks.
 */

import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { getProviderLinks, detectCountry, trackAffiliateClick } from '@/lib/affiliateService';

export default function AffiliateButtons({ book, user, className = '' }) {
  const country = detectCountry();
  const providers = useMemo(() => getProviderLinks(book, country), [book, country]);

  const handleClick = (e, provider) => {
    // Track click (fire-and-forget)
    trackAffiliateClick({
      book,
      providerKey: provider.providerKey,
      url: provider.url,
      country,
      userId: user?.email || null,
    });
  };

  if (providers.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {providers.map(provider => (
        <a
          key={provider.providerKey}
          href={provider.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleClick(e, provider)}
          className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base leading-none">{provider.logo}</span>
            <span className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
              {provider.label}
            </span>
          </div>
          <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-amber-500 flex-shrink-0 ml-1" />
        </a>
      ))}
    </div>
  );
}