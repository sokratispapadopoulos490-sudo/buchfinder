/**
 * ReadingPath – zeigt den persönlichen Lesepfad unterhalb der Ergebnisse.
 * Rein regelbasiert, kein LLM.
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import BookCover from '@/components/books/BookCover';

const PATH_DICT = {
  'path.title':       { de: '📖 Dein persönlicher Lesepfad',    en: '📖 Your Personal Reading Path',         el: '📖 Το προσωπικό σου μονοπάτι ανάγνωσης', tr: '📖 Kişisel Okuma Yolun',          fr: '📖 Votre parcours de lecture',      es: '📖 Tu camino de lectura',          it: '📖 Il tuo percorso di lettura' },
  'path.subtitle':    { de: 'Eine sinnvolle Reihenfolge für deine Bücher', en: 'A meaningful order for your books', el: 'Μια ουσιαστική σειρά για τα βιβλία σου', tr: 'Kitapların için anlamlı bir sıra', fr: 'Un ordre logique pour vos livres', es: 'Un orden lógico para tus libros', it: 'Un ordine logico per i tuoi libri' },
  'path.entry':       { de: 'Einstieg', en: 'Entry',       el: 'Εισαγωγή',       tr: 'Başlangıç',   fr: 'Entrée',       es: 'Entrada',    it: 'Ingresso' },
  'path.basics':      { de: 'Grundlagen', en: 'Basics',    el: 'Βασικά',          tr: 'Temel',       fr: 'Bases',        es: 'Fundamentos', it: 'Basi' },
  'path.deepen':      { de: 'Vertiefung', en: 'Deepening', el: 'Εμβάθυνση',       tr: 'Derinleştirme', fr: 'Approfondissement', es: 'Profundización', it: 'Approfondimento' },
  'path.apply':       { de: 'Praxis / Anwendung', en: 'Practice / Application', el: 'Πράξη / Εφαρμογή', tr: 'Pratik / Uygulama', fr: 'Pratique / Application', es: 'Práctica / Aplicación', it: 'Pratica / Applicazione' },
  'path.horizon':     { de: 'Horizont-Erweiterung', en: 'Horizon Expansion', el: 'Διεύρυνση οριζόντων', tr: 'Ufuk Genişletme', fr: 'Élargissement des horizons', es: 'Ampliación de horizontes', it: 'Espansione dell\'orizzonte' },
  'path.why.entry':   { de: 'Guter Einstieg – leicht zugänglich und motivierend', en: 'Good entry – easily accessible and motivating', el: 'Καλή εισαγωγή – εύκολα προσιτό και παρακινητικό', tr: 'İyi başlangıç – kolayca erişilebilir ve motive edici', fr: 'Bon point d\'entrée – accessible et motivant', es: 'Buen punto de entrada – accesible y motivador', it: 'Buon punto di partenza – accessibile e motivante' },
  'path.why.basics':  { de: 'Baut Grundwissen auf – ideal zum Aufwärmen', en: 'Builds foundational knowledge – ideal warm-up', el: 'Χτίζει βασικές γνώσεις – ιδανικό προθέρμανσμα', tr: 'Temel bilgi oluşturur – ideal ısınma', fr: 'Construit les bases – idéal pour commencer', es: 'Construye conocimiento base – ideal para empezar', it: 'Costruisce le basi – ideale per iniziare' },
  'path.why.deepen':  { de: 'Vertieft das Thema aus anderem Blickwinkel', en: 'Deepens the topic from another angle', el: 'Εμβαθύνει το θέμα από άλλη οπτική', tr: 'Konuyu farklı bir açıdan derinleştirir', fr: 'Approfondit le sujet sous un autre angle', es: 'Profundiza el tema desde otra ángulo', it: 'Approfondisce il tema da un\'altra angolazione' },
  'path.why.apply':   { de: 'Ermöglicht praktische Anwendung des Gelernten', en: 'Enables practical application of what you learned', el: 'Επιτρέπει πρακτική εφαρμογή', tr: 'Öğrendiklerini pratiğe dökmeni sağlar', fr: 'Permet une application pratique', es: 'Permite aplicación práctica', it: 'Consente applicazione pratica' },
  'path.why.horizon': { de: 'Bewusst anders – erweitert deinen Horizont', en: 'Deliberately different – expands your horizon', el: 'Σκόπιμα διαφορετικό – διευρύνει τον ορίζοντά σου', tr: 'Kasıtlı olarak farklı – ufkunu genişletir', fr: 'Délibérément différent – élargit vos horizons', es: 'Deliberadamente diferente – amplía tu horizonte', it: 'Deliberatamente diverso – amplia il tuo orizzonte' },
  'path.show':        { de: 'Lesepfad anzeigen', en: 'Show reading path', el: 'Εμφάνιση μονοπατιού', tr: 'Okuma yolunu göster', fr: 'Afficher le parcours', es: 'Mostrar camino', it: 'Mostra percorso' },
  'path.hide':        { de: 'Lesepfad ausblenden', en: 'Hide reading path', el: 'Απόκρυψη μονοπατιού', tr: 'Gizle', fr: 'Masquer le parcours', es: 'Ocultar camino', it: 'Nascondi percorso' },
};

function tP(key, lang) {
  const e = PATH_DICT[key];
  if (!e) return key;
  return e[lang] || e['de'] || key;
}

const PHASE_COLORS = [
  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800',
  'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
];

const PHASE_BADGES = [
  'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
  'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300',
  'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300',
  'bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300',
  'bg-rose-100 dark:bg-rose-800 text-rose-700 dark:text-rose-300',
];

const WHY_KEYS = ['path.why.entry', 'path.why.basics', 'path.why.deepen', 'path.why.apply', 'path.why.horizon'];

export default function ReadingPath({ phases }) {
  const { language } = useLanguage();
  const lang = language || 'de';
  const [open, setOpen] = useState(false);

  if (!phases || phases.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{tP('path.title', lang)}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{tP('path.subtitle', lang)}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {phases.map((phase, phaseIdx) => (
            <div
              key={phase.key}
              className={`rounded-2xl border p-4 ${PHASE_COLORS[phaseIdx % PHASE_COLORS.length]}`}
            >
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PHASE_BADGES[phaseIdx % PHASE_BADGES.length]}`}>
                  {phaseIdx + 1}
                </span>
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                  {tP(phase.key, lang)}
                </span>
              </div>
              {/* Phase reason */}
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3 ml-7">
                {tP(WHY_KEYS[phaseIdx] || 'path.why.entry', lang)}
              </p>
              {/* Books in phase */}
              <div className="flex flex-wrap gap-3 ml-7">
                {phase.books.map((book, bIdx) => (
                  <div key={book.id || book.isbn13 || bIdx} className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                      <BookCover book={book} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-800 dark:text-stone-100 truncate max-w-[140px]">{book.title}</p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate max-w-[140px]">{book.author || (book.authors || [])[0] || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}