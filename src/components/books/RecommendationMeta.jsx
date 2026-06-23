/**
 * RecommendationMeta – zeigt Score-Badge + strukturierte Begründung
 * pro Buchkarte in den Bedarfsanalyse-Ergebnissen.
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

const SCORE_COLORS = [
  { min: 80, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-300 dark:ring-emerald-700' },
  { min: 60, bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-300',   ring: 'ring-amber-300 dark:ring-amber-700' },
  { min: 0,  bg: 'bg-stone-100 dark:bg-stone-800',      text: 'text-stone-500 dark:text-stone-400',    ring: 'ring-stone-300 dark:ring-stone-600' },
];

function scoreColor(score) {
  return SCORE_COLORS.find(c => score >= c.min) || SCORE_COLORS[2];
}

// Static i18n for new meta keys (same keys added to i18n.js)
const META_DICT = {
  'meta.why':        { de: 'Warum dieses Buch?',       en: 'Why this book?',         el: 'Γιατί αυτό το βιβλίο;',    tr: 'Neden bu kitap?',           fr: 'Pourquoi ce livre ?',       es: '¿Por qué este libro?',     it: 'Perché questo libro?' },
  'meta.need':       { de: 'Deckt ab:',                en: 'Covers:',                el: 'Καλύπτει:',                tr: 'Karşılar:',                 fr: 'Couvre :',                  es: 'Cubre:',                   it: 'Copre:' },
  'meta.suit':       { de: 'Geeignet für:',            en: 'Suitable for:',          el: 'Κατάλληλο για:',           tr: 'Uygun:',                    fr: 'Convient pour :',           es: 'Adecuado para:',           it: 'Adatto per:' },
  'meta.diff':       { de: 'Schwierigkeit:',           en: 'Difficulty:',            el: 'Δυσκολία:',                tr: 'Zorluk:',                   fr: 'Difficulté :',              es: 'Dificultad:',              it: 'Difficoltà:' },
  'meta.time':       { de: 'Zeitaufwand:',             en: 'Time effort:',           el: 'Χρόνος ανάγνωσης:',        tr: 'Zaman çabası:',             fr: 'Temps de lecture :',        es: 'Tiempo de lectura:',       it: 'Tempo di lettura:' },
  'meta.lang':       { de: 'Sprache:',                 en: 'Language:',              el: 'Γλώσσα:',                  tr: 'Dil:',                      fr: 'Langue :',                  es: 'Idioma:',                  it: 'Lingua:' },
  'meta.owned':      { de: '📚 Bereits in deiner Bibliothek', en: '📚 Already in your library', el: '📚 Ήδη στη βιβλιοθήκη σου', tr: '📚 Zaten kütüphanende', fr: '📚 Déjà dans ta bibliothèque', es: '📚 Ya en tu biblioteca', it: '📚 Già nella tua libreria' },
  'meta.wrongLang':  { de: '⚠ Nicht in gewählter Sprache', en: '⚠ Not in chosen language', el: '⚠ Δεν είναι στη γλώσσα που διάλεξες', tr: '⚠ Seçilen dilde değil', fr: '⚠ Pas dans la langue choisie', es: '⚠ No en el idioma elegido', it: '⚠ Non nella lingua scelta' },
  'meta.matchScore': { de: 'Übereinstimmung', en: 'Match', el: 'Ταιριάζει', tr: 'Uyum', fr: 'Correspondance', es: 'Coincidencia', it: 'Corrispondenza' },
  'meta.showWhy':    { de: 'Begründung anzeigen', en: 'Show reasons', el: 'Εμφάνιση λόγων', tr: 'Nedenleri göster', fr: 'Voir les raisons', es: 'Ver razones', it: 'Mostra i motivi' },
  'meta.hideWhy':    { de: 'Begründung ausblenden', en: 'Hide reasons', el: 'Απόκρυψη λόγων', tr: 'Gizle', fr: 'Masquer', es: 'Ocultar', it: 'Nascondi' },
};

function tMeta(key, lang) {
  const e = META_DICT[key];
  if (!e) return key;
  return e[lang] || e['de'] || key;
}

export default function RecommendationMeta({ reasons }) {
  const { language } = useLanguage();
  const lang = language || 'de';
  const [open, setOpen] = useState(false);

  if (!reasons) return null;

  const { score, whyFit, needsCovered, suitability, diffLabel, timeLabel, languageLabel, isOwned, isWrongLang } = reasons;

  const hasScore = typeof score === 'number' && score > 0;
  const col = hasScore ? scoreColor(score) : SCORE_COLORS[2];

  return (
    <div className="mt-2 mb-1">
      {/* Score-Badge + Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasScore && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${col.bg} ${col.text} ${col.ring}`}>
            <span className="opacity-70">{tMeta('meta.matchScore', lang)}</span>
            <span>{score}%</span>
          </span>
        )}
        {isOwned && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-700">
            {tMeta('meta.owned', lang)}
          </span>
        )}
        {isWrongLang && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-700">
            {tMeta('meta.wrongLang', lang)}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-0.5 text-[11px] text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors ml-auto"
        >
          {open ? tMeta('meta.hideWhy', lang) : tMeta('meta.showWhy', lang)}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="mt-2 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-800 text-[12px] space-y-1.5">
          {whyFit && (
            <div>
              <span className="font-semibold text-stone-500 dark:text-stone-400 mr-1">{tMeta('meta.why', lang)}</span>
              <span className="text-stone-700 dark:text-stone-200">{whyFit}</span>
            </div>
          )}
          {needsCovered && (
            <div>
              <span className="font-semibold text-stone-500 dark:text-stone-400 mr-1">{tMeta('meta.need', lang)}</span>
              <span className="text-stone-700 dark:text-stone-200">{needsCovered}</span>
            </div>
          )}
          {suitability && (
            <div>
              <span className="font-semibold text-stone-500 dark:text-stone-400 mr-1">{tMeta('meta.suit', lang)}</span>
              <span className="text-stone-700 dark:text-stone-200">{suitability}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-stone-100 dark:border-stone-800">
            {diffLabel && (
              <div>
                <span className="text-stone-400 dark:text-stone-500 mr-1">{tMeta('meta.diff', lang)}</span>
                <span className="text-stone-700 dark:text-stone-300 font-medium">{diffLabel}</span>
              </div>
            )}
            {timeLabel && (
              <div>
                <span className="text-stone-400 dark:text-stone-500 mr-1">{tMeta('meta.time', lang)}</span>
                <span className="text-stone-700 dark:text-stone-300 font-medium">{timeLabel}</span>
              </div>
            )}
            {languageLabel && (
              <div>
                <span className="text-stone-400 dark:text-stone-500 mr-1">{tMeta('meta.lang', lang)}</span>
                <span className="text-stone-700 dark:text-stone-300 font-medium">{languageLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}