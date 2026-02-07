import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Users, Crown, Filter, ArrowLeft, Search, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import CommentSection from '@/components/community/CommentSection';
import ReportModal from '@/components/community/ReportModal';
import { LanguageProvider } from '@/components/language/LanguageContext';

function CommunityContent() {
  const [posts, setPosts] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [postToReport, setPostToReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [postsData, booksData, likesData] = await Promise.all([
        base44.entities.CommunityPost.list('-created_date'),
        base44.entities.SavedBook.list(),
        base44.entities.CommunityLike.filter({ created_by: currentUser.email })
      ]);

      setPosts(postsData);
      setSavedBooks(booksData);
      setUserLikes(likesData);
    } catch (error) {
      console.error('Error loading data:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId) => {
    try {
      const commentsData = await base44.entities.CommunityComment.filter(
        { post_id: postId },
        '-created_date'
      );
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await base44.entities.CommunityPost.create(postData);
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const existingLike = userLikes.find(like => like.post_id === postId);
      const post = posts.find(p => p.id === postId);
      
      if (existingLike) {
        await base44.entities.CommunityLike.delete(existingLike.id);
        await base44.entities.CommunityPost.update(postId, {
          likes_count: Math.max(0, (post.likes_count || 0) - 1)
        });
      } else {
        await base44.entities.CommunityLike.create({ post_id: postId });
        await base44.entities.CommunityPost.update(postId, {
          likes_count: (post.likes_count || 0) + 1
        });
        
        // Create notification for post author
        if (post && post.created_by !== user.email) {
          await base44.entities.Notification.create({
            type: 'like',
            title: 'Neuer Like',
            message: `${user.full_name} hat deinen Post "${post.title}" geliked`,
            link: '/Community',
            from_user_email: user.email,
            created_by: post.created_by
          });
        }
      }
      
      await loadData();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId, content, isAI = false) => {
    try {
      await base44.entities.CommunityComment.create({
        post_id: postId,
        content,
        is_ai_response: isAI
      });

      const post = posts.find(p => p.id === postId);
      await base44.entities.CommunityPost.update(postId, {
        comments_count: (post.comments_count || 0) + 1
      });

      // Create notification for post author
      if (post && post.created_by !== user.email && !isAI) {
        await base44.entities.Notification.create({
          type: 'comment',
          title: 'Neuer Kommentar',
          message: `${user.full_name} hat deinen Post "${post.title}" kommentiert`,
          link: '/Community',
          from_user_email: user.email,
          created_by: post.created_by
        });
      }

      await loadComments(postId);
      await loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAskAI = async (post) => {
    try {
      const prompt = `Du bist der Book Compass KI-Assistent. Ein Nutzer hat folgenden Post geschrieben:

Titel: ${post.title}
${post.book_title ? `Buch: ${post.book_title}` : ''}
Inhalt: ${post.content}

Gib eine hilfreiche, freundliche Antwort (max. 150 Wörter). Sei persönlich und auf Bücher fokussiert.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      await handleAddComment(post.id, response, true);
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  };

  const handleReportPost = async () => {
    await loadData();
    setPostToReport(null);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Post wirklich löschen?')) return;
    try {
      await base44.entities.CommunityPost.delete(postId);
      await loadData();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isPremium = user?.is_premium || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const filteredPosts = posts.filter(post => {
    const matchesCategory = categoryFilter === 'alle' || post.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.created_by.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/Account')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Zurück zum Account</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-stone-800">Community</h1>
                <p className="text-sm text-stone-500">
                  {posts.length} {posts.length === 1 ? 'Beitrag' : 'Beiträge'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate('/Moderation')}
                  variant="outline"
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Moderation</span>
                </Button>
              )}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Neuer Post
              </Button>
            </div>
          </div>

          {/* Premium Info */}
          {!isPremium && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    Premium-Vorteil
                  </p>
                  <p className="text-xs text-amber-700">
                    Als Premium-Mitglied kannst du die Book Compass KI in Diskussionen einbinden und erhältst personalisierte Antworten auf deine Fragen.
                  </p>
                  <Button
                    onClick={() => navigate('/Premium')}
                    size="sm"
                    className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Jetzt upgraden
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Posts durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['alle', 'allgemein', 'buchempfehlung', 'diskussion', 'frage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-stone-800 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat === 'alle' ? 'Alle' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 mb-4">
                {categoryFilter === 'alle' 
                  ? 'Noch keine Beiträge. Sei der Erste!' 
                  : 'Keine Beiträge in dieser Kategorie'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id}>
                <PostCard
                  post={post}
                  onLike={handleLikePost}
                  onComment={(post) => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                  isLiked={userLikes.some(like => like.post_id === post.id)}
                  currentUser={user}
                  onReport={setPostToReport}
                  onDelete={handleDeletePost}
                />
                
                {selectedPost?.id === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white border-x border-b border-stone-200 rounded-b-xl p-6 -mt-3"
                  >
                    <CommentSection
                      comments={comments}
                      onAddComment={(content) => handleAddComment(post.id, content)}
                      onLikeComment={() => {}}
                      onAskAI={() => handleAskAI(post)}
                      currentUser={user}
                      isPremium={isPremium}
                    />
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePost}
          savedBooks={savedBooks}
        />
      )}

      {/* Report Modal */}
      {postToReport && (
        <ReportModal
          post={postToReport}
          onClose={() => setPostToReport(null)}
          onReported={handleReportPost}
        />
      )}
    </div>
  );
}

export default function Community() {
  return (
    <LanguageProvider>
      <CommunityContent />
    </LanguageProvider>
  );
}