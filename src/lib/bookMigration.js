/**
 * bookMigration.js – Migrationshilfe: Lokale BookDatabase → Book-Entität (DB)
 *
 * Nutzung (einmalig, manuell auslösen):
 *   import { migrateLocalBooksToEntity } from '@/lib/bookMigration';
 *   await migrateLocalBooksToEntity();
 *
 * Danach können BookDatabase.js und BookDatabaseLogic.js als deprecated markiert werden.
 */

import { base44 } from '@/api/base44Client';
import { books as localBooks } from '@/components/books/BookDatabase';
import { normalizeLocalBook } from '@/lib/bookService';

/**
 * Migriert alle lokalen Bücher in die Book-Entität.
 * Überspringt Bücher, die bereits via ISBN13 in der DB existieren.
 * Gibt { migrated, skipped, errors } zurück.
 */
export async function migrateLocalBooksToEntity(onProgress = null) {
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const localBook of localBooks) {
    try {
      const normalized = normalizeLocalBook(localBook);

      // Duplikat-Check
      if (normalized.isbn13) {
        const existing = await base44.entities.Book.filter({ isbn13: normalized.isbn13 });
        if (existing.length > 0) {
          skipped++;
          onProgress?.({ migrated, skipped, errors, current: localBook.title, status: 'skipped' });
          continue;
        }
      }

      // Titel-Duplikat-Check (Fallback wenn keine ISBN)
      const existingByTitle = await base44.entities.Book.filter({ title: normalized.title });
      if (existingByTitle.length > 0) {
        skipped++;
        onProgress?.({ migrated, skipped, errors, current: localBook.title, status: 'skipped' });
        continue;
      }

      await base44.entities.Book.create({
        isbn13: normalized.isbn13,
        isbn10: normalized.isbn10,
        title: normalized.title,
        subtitle: normalized.subtitle,
        authors: normalized.authors,
        publisher: normalized.publisher,
        published_date: normalized.published_date,
        page_count: normalized.page_count,
        language: normalized.language,
        categories: normalized.categories,
        tags: normalized.tags,
        age_group: normalized.age_group,
        difficulty: normalized.difficulty,
        reading_style: normalized.reading_style,
        style: normalized.style,
        time_effort: normalized.time_effort,
        description: normalized.description,
        cover_front_url: normalized.cover_front_url,
        cover_color: normalized.cover_color,
        affiliate_providers: {},
        country_availability: [],
        translations: {},
        alternate_titles: [],
        source: 'local',
        is_active: true,
      });

      migrated++;
      onProgress?.({ migrated, skipped, errors, current: localBook.title, status: 'migrated' });

      // Rate-Limit: kurze Pause zwischen Writes
      await new Promise(r => setTimeout(r, 100));

    } catch (e) {
      errors++;
      console.error(`Migration error for "${localBook.title}":`, e);
      onProgress?.({ migrated, skipped, errors, current: localBook.title, status: 'error' });
    }
  }

  return { migrated, skipped, errors, total: localBooks.length };
}