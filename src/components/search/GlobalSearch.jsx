import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Book, Users, MessageSquare, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ books: [], users: [], posts: [], clubs: [] });
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults({ books: [], users: [], posts: [], clubs: [] });
      return;
    }

    setSearching(true);
    try {
      const [savedBooks, users, posts, clubs] = await Promise.all([
        base44.entities.SavedBook.list(),
        base44.entities.User.list(),
        base44.entities.CommunityPost.list('-created_date', 20),
        base44.entities.BookClub.list()
      ]);

      const q = searchQuery.toLowerCase();

      setResults({
        books: savedBooks.filter(book => 
          book.book_data.title.toLowerCase().includes(q) ||
          book.book_data.author.toLowerCase().includes(q)
        ).slice(0, 5),
        users: users.filter(user => 
          user.full_name?.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
        ).slice(0, 5),
        posts: posts.filter(post =>
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q)
        ).slice(0, 5),
        clubs: clubs.filter(club =>
          club.name.toLowerCase().includes(q) ||
          club.description?.toLowerCase().includes(q)
        ).slice(0, 5)
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleNavigate = (type, item) => {
    onClose();
    if (type === 'book') {
      navigate('/Library');
    } else if (type === 'user') {
      // Navigate to user profile when implemented
      console.log('Navigate to user:', item.email);
    } else if (type === 'post') {
      navigate('/Community');
    } else if (type === 'club') {
      navigate(`/ClubDetail?id=${item.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-hidden"
      >
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Bücher, Nutzer, Posts, Clubs durchsuchen..."
            autoFocus
            className="flex-1 text-lg focus:outline-none"
          />
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
          {!query ? (
            <div className="p-12 text-center text-stone-500">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p>Suche nach Büchern, Nutzern, Posts oder Clubs</p>
            </div>
          ) : searching ? (
            <div className="p-12 text-center text-stone-500">Suche...</div>
          ) : (
            <div className="p-4 space-y-4">
              {results.books.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                    <Book className="w-4 h-4" />
                    <span>Bücher</span>
                  </div>
                  <div className="space-y-2">
                    {results.books.map(book => (
                      <button
                        key={book.id}
                        onClick={() => handleNavigate('book', book)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors text-left"
                      >
                        <div className={cn(
                          "w-10 h-14 rounded flex items-center justify-center flex-shrink-0",
                          book.book_data.coverColor || 'bg-stone-100'
                        )}>
                          <span className="text-lg font-serif text-stone-400">
                            {book.book_data.title.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-stone-800 truncate">{book.book_data.title}</div>
                          <div className="text-sm text-stone-600 truncate">{book.book_data.author}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.clubs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                    <Users className="w-4 h-4" />
                    <span>Clubs</span>
                  </div>
                  <div className="space-y-2">
                    {results.clubs.map(club => (
                      <button
                        key={club.id}
                        onClick={() => handleNavigate('club', club)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-full ${club.cover_color || 'bg-stone-200'} flex items-center justify-center`}>
                          <span className="text-lg font-serif text-stone-600">{club.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-stone-800 truncate">{club.name}</div>
                          <div className="text-sm text-stone-600">{club.member_count} Mitglieder</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.posts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Posts</span>
                  </div>
                  <div className="space-y-2">
                    {results.posts.map(post => (
                      <button
                        key={post.id}
                        onClick={() => handleNavigate('post', post)}
                        className="w-full p-3 hover:bg-stone-50 rounded-lg transition-colors text-left"
                      >
                        <div className="font-medium text-stone-800 truncate mb-1">{post.title}</div>
                        <div className="text-sm text-stone-600 line-clamp-2">{post.content}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                    <Users className="w-4 h-4" />
                    <span>Nutzer</span>
                  </div>
                  <div className="space-y-2">
                    {results.users.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleNavigate('user', user)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-stone-800 truncate">{user.full_name}</div>
                          <div className="text-sm text-stone-600 truncate">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Object.values(results).every(arr => arr.length === 0) && (
                <div className="p-12 text-center text-stone-500">
                  <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p>Keine Ergebnisse gefunden</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}