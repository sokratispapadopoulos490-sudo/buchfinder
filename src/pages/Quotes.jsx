import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Quote, Plus, ArrowLeft, BookOpen, Search, Filter, Globe, Lock, Trash2, Edit, Share2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import AddQuoteModal from '@/components/quotes/AddQuoteModal';
import { cn } from "@/lib/utils";

export default function Quotes() {
  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [quotesData, booksData] = await Promise.all([
        base44.entities.BookQuote.list('-created_date'),
        base44.entities.SavedBook.list()
      ]);

      setQuotes(quotesData);
      setSavedBooks(booksData);
    } catch (error) {
      console.error('Error loading quotes:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = async (quoteData) => {
    try {
      if (editingQuote) {
        await base44.entities.BookQuote.update(editingQuote.id, quoteData);
      } else {
        await base44.entities.BookQuote.create(quoteData);
      }
      await loadData();
      setShowAddModal(false);
      setEditingQuote(null);
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!confirm('Zitat wirklich löschen?')) return;
    
    try {
      await base44.entities.BookQuote.delete(quoteId);
      await loadData();
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const handleShareQuote = async (quote) => {
    try {
      await navigator.clipboard.writeText(
        `"${quote.quote_text}"\n\n— ${quote.book_data.title} von ${quote.book_data.author}${quote.page_number ? `, Seite ${quote.page_number}` : ''}`
      );
      alert('Zitat in Zwischenablage kopiert!');
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'public' && quote.is_public) ||
      (filter === 'private' && !quote.is_public);
    
    const matchesSearch = !searchQuery ||
      quote.quote_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.book_data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.book_data.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Group quotes by book
  const quotesByBook = filteredQuotes.reduce((acc, quote) => {
    const bookId = quote.book_data.id || quote.book_data.title;
    if (!acc[bookId]) {
      acc[bookId] = {
        book: quote.book_data,
        quotes: []
      };
    }
    acc[bookId].quotes.push(quote);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/Account')}
            className="text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-light text-stone-800 flex items-center gap-2">
            <Quote className="w-6 h-6 text-amber-600" />
            Meine Zitate
          </h1>
          <Button
            onClick={() => {
              setEditingQuote(null);
              setShowAddModal(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Hinzufügen</span>
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Zitate durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter === 'public' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Globe className="w-3 h-3" />
                Öffentlich
              </button>
              <button
                onClick={() => setFilter('private')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter === 'private' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Lock className="w-3 h-3" />
                Privat
              </button>
            </div>
          </div>
        </div>

        {/* Quotes */}
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <Quote className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 mb-4">
              {searchQuery ? 'Keine Zitate gefunden' : 'Noch keine Zitate gespeichert'}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Erstes Zitat hinzufügen
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(quotesByBook).map(([bookId, { book, quotes }]) => (
              <div key={bookId} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {/* Book Header */}
                <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-16 rounded flex items-center justify-center flex-shrink-0",
                    book.coverColor || 'bg-stone-200'
                  )}>
                    <span className="text-xl font-serif text-stone-400">
                      {book.title.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-800">{book.title}</h3>
                    <p className="text-sm text-stone-600">{book.author}</p>
                  </div>
                </div>

                {/* Quotes */}
                <div className="p-4 space-y-4">
                  {quotes.map((quote) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Quote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-800 leading-relaxed mb-2 italic">
                            "{quote.quote_text}"
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                            {quote.page_number && (
                              <span className="bg-stone-100 px-2 py-1 rounded">
                                Seite {quote.page_number}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              {quote.is_public ? (
                                <>
                                  <Globe className="w-3 h-3" />
                                  Öffentlich
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" />
                                  Privat
                                </>
                              )}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(quote.created_date), { addSuffix: true, locale: de })}
                            </span>
                          </div>
                          {quote.notes && (
                            <p className="text-sm text-stone-600 mt-2 bg-stone-50 p-2 rounded">
                              {quote.notes}
                            </p>
                          )}
                          {quote.tags && quote.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {quote.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-8">
                        <Button
                          onClick={() => handleShareQuote(quote)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          Teilen
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingQuote(quote);
                            setShowAddModal(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Bearbeiten
                        </Button>
                        <Button
                          onClick={() => handleDeleteQuote(quote.id)}
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Löschen
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <AddQuoteModal
            quote={editingQuote}
            savedBooks={savedBooks}
            onClose={() => {
              setShowAddModal(false);
              setEditingQuote(null);
            }}
            onSave={handleAddQuote}
          />
        )}
      </div>
    </div>
  );
}