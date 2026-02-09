import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, UserCheck, Book, MessageSquare, Users, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function PublicProfile() {
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedBooks, setSavedBooks] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get('user');

  useEffect(() => {
    loadProfile();
  }, [userEmail]);

  const loadProfile = async () => {
    try {
      const current = await base44.auth.me();
      setCurrentUser(current);

      const allUsers = await base44.entities.User.list();
      const profile = allUsers.find(u => u.email === userEmail);
      
      if (!profile) {
        navigate('/Community');
        return;
      }
      setProfileUser(profile);

      const [books, userQuotes, userPosts, follows, followers, following] = await Promise.all([
        base44.entities.SavedBook.filter({ created_by: userEmail }, '-created_date', 20),
        base44.entities.BookQuote.filter({ created_by: userEmail, is_public: true }, '-created_date', 10),
        base44.entities.CommunityPost.filter({ created_by: userEmail }, '-created_date', 10),
        base44.entities.UserFollow.filter({ created_by: current.email, following_email: userEmail }),
        base44.entities.UserFollow.filter({ following_email: userEmail }),
        base44.entities.UserFollow.filter({ created_by: userEmail })
      ]);

      setSavedBooks(books);
      setQuotes(userQuotes);
      setPosts(userPosts);
      setIsFollowing(follows.length > 0);
      setFollowerCount(followers.length);
      setFollowingCount(following.length);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const follows = await base44.entities.UserFollow.filter({
          created_by: currentUser.email,
          following_email: userEmail
        });
        if (follows.length > 0) {
          await base44.entities.UserFollow.delete(follows[0].id);
        }
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await base44.entities.UserFollow.create({
          following_email: userEmail
        });
        
        await base44.entities.Notification.create({
          type: 'follow',
          title: 'Neuer Follower',
          message: `${currentUser.full_name} folgt dir jetzt`,
          link: `/PublicProfile?user=${currentUser.email}`,
          from_user_email: currentUser.email,
          created_by: userEmail
        });
        
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.email === userEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-stone-500 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 inline mr-2" />
          Zurück
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-3xl font-light shadow-lg flex-shrink-0">
              {profileUser.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-light text-stone-800 mb-1">{profileUser.full_name}</h1>
              <p className="text-stone-500 mb-4">{profileUser.email}</p>
              
              {profileUser.bio && (
                <p className="text-stone-600 mb-4">{profileUser.bio}</p>
              )}

              {profileUser.favorite_genres && profileUser.favorite_genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileUser.favorite_genres.map((genre, i) => (
                    <span key={i} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <span>{savedBooks.length} Bücher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{followerCount} Follower</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{followingCount} Folgt</span>
                </div>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex gap-3">
              <Button
                onClick={handleFollowToggle}
                className={`flex-1 gap-2 ${
                  isFollowing
                    ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Folge ich
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Folgen
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  navigate('/Account?tab=messages');
                }}
                variant="outline"
                className="flex-1 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Nachricht
              </Button>
            </div>
          )}
        </div>

        {/* Completed Books */}
        {savedBooks.filter(b => b.is_completed).length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-light text-stone-800 mb-4">
              Gelesene Bücher ({savedBooks.filter(b => b.is_completed).length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedBooks.filter(b => b.is_completed).slice(0, 8).map((book) => (
                <div key={book.id} className="group">
                  <div className={`aspect-[2/3] rounded-lg ${book.book_data.coverColor || 'bg-stone-100'} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                    <span className="text-3xl font-serif text-stone-400">
                      {book.book_data.title.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-stone-800 truncate">{book.book_data.title}</h3>
                  <p className="text-xs text-stone-500 truncate">{book.book_data.author}</p>
                  {book.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: book.rating }).map((_, i) => (
                        <span key={i} className="text-amber-500">★</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Quotes */}
        {quotes.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <h2 className="text-xl font-light text-stone-800 mb-4">Zitate</h2>
            <div className="space-y-4">
              {quotes.slice(0, 5).map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-l-4 border-amber-600 pl-4 py-2"
                >
                  <blockquote className="text-stone-700 italic mb-2">
                    "{quote.quote_text}"
                  </blockquote>
                  <p className="text-sm text-stone-500">
                    — {quote.book_data.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        {posts.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-xl font-light text-stone-800 mb-4">Beiträge</h2>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors cursor-pointer"
                  onClick={() => navigate('/Community')}
                >
                  <h3 className="font-medium text-stone-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-stone-600 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
                    <span>{post.likes_count} Likes</span>
                    <span>{post.comments_count} Kommentare</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}