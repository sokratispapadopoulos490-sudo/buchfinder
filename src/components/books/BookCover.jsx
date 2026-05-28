import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Liefert eine Cover-URL aus Open Library oder Google Books.
 * Gibt null zurück wenn keine ISBN oder bekannte Cover-URL vorhanden.
 */
export function getCoverUrl(bookData) {
  // Neues Schema zuerst
  if (bookData?.cover_front_url) return bookData.cover_front_url;
  // Legacy
  if (bookData?.coverUrl) return bookData.coverUrl;
  if (bookData?.cover_image_url) return bookData.cover_image_url;
  // ISBN → OpenLibrary
  const isbn = bookData?.isbn13 || bookData?.isbn10 || bookData?.isbn;
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  return null;
}

/**
 * Universelle Buchcover-Komponente.
 * Zeigt das echte Cover wenn möglich, sonst einen farbigen Platzhalter.
 */
export default function BookCover({ bookData, className, placeholderClassName, width = 'w-10', height = 'h-14', textSize = 'text-sm' }) {
  const [imgError, setImgError] = useState(false);
  const coverUrl = getCoverUrl(bookData);

  const placeholder = (
    <div
      className={cn(
        width, height,
        'rounded flex-shrink-0 flex items-center justify-center',
        bookData?.coverColor || 'bg-stone-100',
        placeholderClassName
      )}
    >
      <span className={cn('font-serif text-stone-400', textSize)}>
        {bookData?.title?.charAt(0) || '?'}
      </span>
    </div>
  );

  if (!coverUrl || imgError) return placeholder;

  return (
    <img
      src={coverUrl}
      alt={bookData?.title || 'Buchcover'}
      className={cn(width, height, 'rounded flex-shrink-0 object-cover', className)}
      onError={() => setImgError(true)}
    />
  );
}