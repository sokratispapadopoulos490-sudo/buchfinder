import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Users, Crown, Search, Shield, MessageSquare, UserCheck, Mail, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import CommentSection from '@/components/community/CommentSection';
import ReportModal from '@/components/community/ReportModal';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import NewMessageModal from '@/components/messages/NewMessageModal';
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
  const [activeTab, setActiveTab] = useState('posts');

  // Messages state
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Following state
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followingLoaded, setFollowingLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedPost) loadComments(selectedPost.id);
  }, [selectedPost]);

  useEffect(() => {
    if (activeTab === 'following' && !followingLoaded && user) {
      loadFollowing();
    }
  }, [activeTab, user]);

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
    } catch {
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    try {
      const myFollowing = await base44.entities.UserFollow.list('-created_date');
      const myFollowers = await base44.entities.UserFollow.filter({ following_email: user.email });
      const allUsers = await base44.entities.User.list();
      setFollowing(myFollowing.map(f => ({ ...f, user: allUsers.find(u => u.email === f.following_email) })));
      setFollowers(myFollowers.map(f => ({ ...f, user: allUsers.find(u => u.email === f.created_by) })));
      setFollowingLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const loadComments = async (postId) => {
    const commentsData = await base44.entities.CommunityComment.filter({ post_id: postId }, '-created_date');
    setComments(commentsData);
  };

  const handleCreatePost = async (postData) => {
    await base44.entities.CommunityPost.create(postData);
    await loadData();
    setShowCreateModal(false);
  };

  const handleLikePost = async (postId) => {
    const existingLike = userLikes.find(like => like.post_id === postId);
    const post = posts.find(p => p.id === postId);
    if (existingLike) {
      await base44.entities.CommunityLike.delete(existingLike.id);
      await base44.entities.CommunityPost.update(postId, { likes_count: Math.max(0, (post.likes_count || 0) - 1) });
    } else {
      await base44.entities.CommunityLike.create({ post_id: postId });
      await base44.entities.CommunityPost.update(postId, { likes_count: (post.likes_count || 0) + 1 });
      if (post && post.created_by !== user.email) {
        await base44.entities.Notification.create({
          type: 'like', title: 'Neuer Like',
          message: `${user.full_name} hat deinen Post "${post.title}" geliked`,
          link: '/Community', from_user_email: user.email, created_by: post.created_by
        });
      }
    }
    await loadData();
  };

  const handleAddComment = async (postId, content, isAI = false) => {
    await base44.entities.CommunityComment.create({ post_id: postId, content, is_ai_response: isAI });
    const post = posts.find(p => p.id === postId);
    await base44.entities.CommunityPost.update(postId, { comments_count: (post.comments_count || 0) + 1 });
    if (post && post.created_by !== user.email && !isAI) {
      await base44.entities.Notification.create({
        type: 'comment', title: 'Neuer Kommentar',
        message: `${user.full_name} hat deinen Post "${post.title}" kommentiert`,
        link: '/Community', from_user_email: user.email, created_by: post.created_by
      });
    }
    await loadComments(postId);
    await loadData();
  };

  const handleAskAI = async (post) => {
    const prompt = `Du bist der Book Compass KI-Assistent. Ein Nutzer hat folgenden Post geschrieben:\n\nTitel: ${post.title}\n${post.book_title ? `Buch: ${post.book_title}` : ''}\nInhalt: ${post.content}\n\nGib eine hilfreiche, freundliche Antwort (max. 150 Wörter). Sei persönlich und auf Bücher fokussiert.`;
    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    await handleAddComment(post.id, response, true);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Post wirklich löschen?')) return;
    await base44.entities.CommunityPost.delete(postId);
    await loadData();
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Beiträge', icon: Users },
    { id: 'messages', label: 'Nachrichten', icon: MessageSquare },
    { id: 'following', label: 'Following', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-light text-stone-800 dark:text-stone-100">Community</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={() => navigate('/Moderation')} variant="outline" size="sm" className="gap-2">
                <Shield className="w-4 h-4" />
                Moderation
              </Button>
            )}
            <Button onClick={() => navigate('/Clubs')} variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Clubs
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-700 p-1.5 mb-6 flex gap-1.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-stone-800 dark:bg-amber-600 text-white'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Beiträge */}
        {activeTab === 'posts' && (
          <div>
            {/* Premium Info */}
            {!isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium mb-1">Premium-Vorteil</p>
                    <p className="text-xs text-amber-700">Als Premium-Mitglied kannst du die Book Compass KI in Diskussionen einbinden.</p>
                    <Button onClick={() => navigate('/Premium')} size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white">
                      Jetzt upgraden
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Plus className="w-4 h-4" /> Neuer Post
              </Button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Posts durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1a1a1a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {['alle', 'allgemein', 'buchempfehlung', 'diskussion', 'frage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-stone-800 dark:bg-amber-600 text-white'
                      : 'bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {cat === 'alle' ? 'Alle' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700">
                  <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">{categoryFilter === 'alle' ? 'Noch keine Beiträge. Sei der Erste!' : 'Keine Beiträge in dieser Kategorie'}</p>
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
        )}

        {/* Tab: Nachrichten */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Nachrichten</h2>
              <Button onClick={() => setShowNewMessage(true)} className="bg-amber-600 hover:bg-amber-700 text-white gap-2" size="sm">
                <Mail className="w-4 h-4" /> Neue Nachricht
              </Button>
            </div>
            <div className="grid lg:grid-cols-[300px,1fr] h-[550px]">
              <ConversationList
                currentUser={user}
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.conversation_id}
              />
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  currentUser={user}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="hidden lg:flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a] text-stone-500">
                  <div className="text-center">
                    <MessageSquare className="w-14 h-14 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm">Wähle eine Konversation aus</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Following */}
        {activeTab === 'following' && (
          <div className="space-y-5">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5">
              <h2 className="text-base font-semibold text-stone-800 dark:text-stone-200 mb-4">Ich folge ({following.length})</h2>
              {following.length === 0 ? (
                <p className="text-stone-500 text-sm text-center py-6">Du folgst noch niemandem</p>
              ) : (
                <div className="space-y-2">
                  {following.map((f) => f.user && (
                    <div key={f.id} className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 transition-colors">
                      <button
                        onClick={() => navigate(`/PublicProfile?user=${f.user.email}`)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium text-sm">
                          {f.user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{f.user.full_name}</div>
                          <div className="text-xs text-stone-500">{f.user.email}</div>
                        </div>
                      </button>
                      <Button size="sm" variant="outline" onClick={async () => {
                        await base44.entities.UserFollow.delete(f.id);
                        await loadFollowing();
                      }}>
                        Entfolgen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5">
              <h2 className="text-base font-semibold text-stone-800 dark:text-stone-200 mb-4">Meine Follower ({followers.length})</h2>
              {followers.length === 0 ? (
                <p className="text-stone-500 text-sm text-center py-6">Noch keine Follower</p>
              ) : (
                <div className="space-y-2">
                  {followers.map((f) => f.user && (
                    <button
                      key={f.id}
                      onClick={() => navigate(`/PublicProfile?user=${f.user.email}`)}
                      className="w-full flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium text-sm">
                        {f.user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{f.user.full_name}</div>
                        <div className="text-xs text-stone-500">{f.user.email}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 ml-auto" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} onCreate={handleCreatePost} savedBooks={savedBooks} />
      )}
      {postToReport && (
        <ReportModal post={postToReport} onClose={() => setPostToReport(null)} onReported={async () => { await loadData(); setPostToReport(null); }} />
      )}
      {showNewMessage && (
        <NewMessageModal currentUser={user} onClose={() => setShowNewMessage(false)} onMessageSent={() => setShowNewMessage(false)} />
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