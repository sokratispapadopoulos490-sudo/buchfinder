import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Quote, Plus, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/language/LanguageContext';

export default function QuotesSection() {
  const { t } = useLanguage();
  const [quotes, setQuotes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuote, setNewQuote] = useState({ book_data: null, quote_text: '', page_number: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraImage, setCameraImage] = useState(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const data = await base44.entities.BookQuote.list('-created_date', 5);
      setQuotes(data);
    } catch (error) {
      console.error('Fehler beim Laden der Zitate:', error);
    }
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const uploadedFile = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: 'Extrahiere den Text aus diesem Bild. Gib NUR den Text zurück, den du siehst, ohne Erklärungen oder Formatierung.',
        file_urls: [uploadedFile.file_url],
      });

      if (result) {
        setNewQuote({ ...newQuote, quote_text: result });
        setUseCamera(false);
        setCameraImage(null);
        toast.success('Text erfolgreich erfasst');
      }
    } catch (error) {
      toast.error('Fehler beim Erfassen des Textes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (!newQuote.quote_text.trim()) {
      toast.error('Bitte gib ein Zitat ein');
      return;
    }

    setIsLoading(true);
    try {
      await base44.entities.BookQuote.create({
        book_data: newQuote.book_data || { title: 'Unbekannt', author: 'Unbekannt' },
        quote_text: newQuote.quote_text,
        page_number: newQuote.page_number ? parseInt(newQuote.page_number) : null,
        is_public: false,
      });
      toast.success('Zitat hinzugefügt');
      setNewQuote({ book_data: null, quote_text: '', page_number: '' });
      setShowAddForm(false);
      loadQuotes();
    } catch (error) {
      toast.error('Fehler beim Speichern des Zitats');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">{t('quotes.title')}</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> {t('quotes.new')}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddQuote} className="mb-4 p-4 bg-stone-50 dark:bg-[#0a0a0a] rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUseCamera(!useCamera)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
                useCamera
                  ? 'bg-amber-600 text-white'
                  : 'border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              {t('quotes.camera')}
            </button>
            <button
              type="button"
              onClick={() => setUseCamera(false)}
              className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                !useCamera
                  ? 'bg-amber-600 text-white'
                  : 'border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {t('quotes.manual')}
            </button>
          </div>

          {useCamera ? (
            <div className="mb-3">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                disabled={isLoading}
                className="w-full"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">{t('quotes.cameraHint')}</p>
            </div>
          ) : (
            <>
              <textarea
                value={newQuote.quote_text}
                onChange={(e) => setNewQuote({ ...newQuote, quote_text: e.target.value })}
                placeholder={t('quotes.placeholder')}
                className="w-full p-2 text-sm mb-2 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] text-stone-900 dark:text-white resize-none"
                rows="3"
              />
            </>
          )}

          <input
            type="number"
            value={newQuote.page_number}
            onChange={(e) => setNewQuote({ ...newQuote, page_number: e.target.value })}
            placeholder={t('quotes.pageNumber')}
            className="w-full p-2 text-sm mb-3 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] text-stone-900 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !newQuote.quote_text.trim()}
              className="flex-1 px-3 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded disabled:opacity-50"
            >
              {isLoading ? t('quotes.saving') : t('quotes.save')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setUseCamera(false);
                setCameraImage(null);
              }}
              className="flex-1 px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded hover:bg-stone-50 dark:hover:bg-[#0a0a0a]"
            >
              {t('quotes.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {quotes.length === 0 ? (
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-4">{t('quotes.empty')}</p>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className="p-3 bg-stone-50 dark:bg-[#0a0a0a] rounded-lg border border-stone-200 dark:border-stone-700">
              <p className="text-sm italic text-stone-800 dark:text-stone-200 mb-2">"{quote.quote_text}"</p>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>{quote.book_data?.title || 'Unbekannt'}</span>
                {quote.page_number && <span>{t('quotes.pageAbbrev')} {quote.page_number}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}