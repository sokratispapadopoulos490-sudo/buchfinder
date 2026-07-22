import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Users, Search, Shield, MessageSquare, UserCheck, Mail, ChevronRight, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import CommentSection from '@/components/community/CommentSection';
import ReportModal from '@/components/community/ReportModal';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import NewMessageModal from '@/components/messages/NewMessageModal';
import FindReadersSection from '@/components/community/FindReadersSection';
import { useLanguage } from '@/components/language/LanguageContext';

/** Rate-Limit-Zähler im localStorage – Modul-Level damit kein Re-Create bei Render */
function getAiUsageToday(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `ai_limit_${today}_${userId || 'anon'}`;
  const stored = parseInt(localStorage.getItem(key) || '0', 10);
  return { count: stored, key };
}

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
  const [userMap, setUserMap] = useState({});

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Sprachname für den AI-Prompt (damit die KI in der App-Sprache antwortet)
  const AI_LANG_NAMES = {
    de: 'Deutsch', en: 'English', el: 'Ελληνικά', tr: 'Türkçe',
    fr: 'Français', es: 'Español', it: 'Italiano', pt: 'Português',
    nl: 'Nederlands', pl: 'Polski', ru: 'Русский', ar: 'العربية',
    zh: '中文', ja: '日本語', ko: '한국어',
  };

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
        base44.entities.SavedBook.list('-created_date', 50),
        base44.entities.CommunityLike.list(),
      ]);
      setPosts(postsData);
      setSavedBooks(booksData);
      setUserLikes(likesData);
      // UserMap für sichere Anzeigenamen (nie E-Mail zeigen) – nur best-effort:
      // nicht-Admin-Nutzer dürfen ggf. nicht alle User auflisten, das ist kein Auth-Fehler.
      try {
        const allUsers = await base44.entities.User.list();
        const uMap = {};
        allUsers.forEach(u => { uMap[u.email] = u; });
        setUserMap(uMap);
      } catch (e) {
        // Kein Absturz, kein Redirect – Anzeigenamen fallen auf Standardwerte zurück
      }
    } catch (err) {
      // Nur bei echten Auth-Fehlern weiterleiten, nicht bei Netzwerkfehlern
      const isAuthErr = err?.status === 401 || err?.status === 403 ||
        String(err?.message).includes('401') || String(err?.message).includes('unauthorized');
      if (isAuthErr) base44.auth.redirectToLogin();
      else console.error('Community loadData error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    try {
      const myFollowing = await base44.entities.UserFollow.list('-created_date');
      const myFollowers = await base44.entities.UserFollow.filter({ following_email: user.email });
      let allUsers = [];
      try {
        allUsers = await base44.entities.User.list();
      } catch (e) {
        // Best-effort – ohne Admin-Rechte bleibt die Liste leer, kein Absturz
      }
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
          type: 'like',
          title: 'Neuer Like',                          // Fallback für alte Clients
          message: `${user.full_name} hat deinen Post "${post.title}" geliked`, // Fallback
          notif_type: 'post_like',
          params: { actor: user.full_name, postTitle: post.title },
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
        type: 'comment',
        title: 'Neuer Kommentar',                       // Fallback für alte Clients
        message: `${user.full_name} hat deinen Post "${post.title}" kommentiert`, // Fallback
        notif_type: 'post_comment',
        params: { actor: user.full_name, postTitle: post.title },
        link: '/Community', from_user_email: user.email, created_by: post.created_by
      });
    }
    await loadComments(postId);
    await loadData();
  };

  const AI_DAILY_LIMIT = 5;
  const AI_TIMEOUT_MS = 20000;

  const handleAskAI = async (post) => {
    if (!user?.id && !user?.email) return; // kein User – kein AI
    const userId = user.id || user.email;
    const { count, key } = getAiUsageToday(userId);

    if (count >= AI_DAILY_LIMIT) {
      alert(t('ai.limitMessage').replace('{n}', AI_DAILY_LIMIT));
      return;
    }

    // Zähler erhöhen BEVOR der API-Call – verhindert Doppel-Spend bei Fehler
    localStorage.setItem(key, String(count + 1));

    const langName = AI_LANG_NAMES[language] || 'Deutsch';
    const prompt = `Du bist der Book Compass KI-Assistent. Antworte IMMER auf ${langName}.\n\nEin Nutzer hat folgenden Post geschrieben:\n\nTitel: ${post.title}\n${post.book_title ? `Buch: ${post.book_title}` : ''}\nInhalt: ${post.content}\n\nGib eine hilfreiche, freundliche Antwort (max. 150 Wörter). Sei persönlich und auf Bücher fokussiert.`;

    // Timeout-Guard: kein Page-Crash bei LLM-Timeout
    let response;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), AI_TIMEOUT_MS)
      );
      response = await Promise.race([
        base44.integrations.Core.InvokeLLM({ prompt }),
        timeoutPromise,
      ]);
    } catch (err) {
      const isTimeout = err?.message === 'AI timeout';
      const msg = isTimeout ? t('ai.timeoutMessage') : t('ai.errorMessage');
      // Zähler zurücksetzen bei Fehler (kein Verbrauch wenn kein Ergebnis)
      localStorage.setItem(key, String(count));
      alert(msg);
      return;
    }

    if (!response || typeof response !== 'string') {
      localStorage.setItem(key, String(count));
      return;
    }

    await handleAddComment(post.id, response, true);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm(t('community.deleteConfirm'))) return;
    await base44.entities.CommunityPost.delete(postId);
    await loadData();
  };

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
        <div className="text-stone-500">{t('community.loading')}</div>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: t('community.tab.posts'), icon: Users },
    { id: 'messages', label: t('community.tab.messages'), icon: MessageSquare },
    { id: 'following', label: t('community.tab.following'), icon: UserCheck },
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
            <h1 className="text-2xl font-light text-stone-800 dark:text-stone-100">{t('community.title')}</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={() => navigate('/Moderation')} variant="outline" size="sm" className="gap-2">
                <Shield className="w-4 h-4" />
                {t('community.moderation')}
              </Button>
            )}
            <Button onClick={() => navigate('/Clubs')} variant="outline" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              {t('community.clubs')}
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
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Plus className="w-4 h-4" /> {t('community.newPost')}
              </Button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={t('community.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1a1a1a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {[
                { key: 'alle', label: t('community.filter.all') },
                { key: 'allgemein', label: t('community.filter.allgemein') },
                { key: 'buchempfehlung', label: t('community.filter.buchempfehlung') },
                { key: 'diskussion', label: t('community.filter.diskussion') },
                { key: 'frage', label: t('community.filter.frage') },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === key
                      ? 'bg-stone-800 dark:bg-amber-600 text-white'
                      : 'bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700">
                  <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">{categoryFilter === 'alle' ? t('community.empty.all') : t('community.empty.category')}</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const author = userMap[post.created_by];
                  const authorName = author?.full_name || author?.username || null;
                  const authorUsername = author?.username || null;
                  return (
                  <div key={post.id}>
                    <PostCard
                      post={post}
                      onLike={handleLikePost}
                      onComment={(post) => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                      isLiked={userLikes.some(like => like.post_id === post.id)}
                      currentUser={user}
                      onReport={setPostToReport}
                      onDelete={handleDeletePost}
                      authorName={authorName}
                      authorUsername={authorUsername}
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
                        />
                      </motion.div>
                    )}
                  </div>
                );
                })
                )}
                </div>
                </div>
                )}

                {/* Tab: Nachrichten */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">{t('community.messages.title')}</h2>
              <Button onClick={() => setShowNewMessage(true)} className="bg-amber-600 hover:bg-amber-700 text-white gap-2" size="sm">
                <Mail className="w-4 h-4" /> {t('community.messages.new')}
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
                    <p className="text-sm">{t('community.messages.selectConversation')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Following */}
        {activeTab === 'following' && (
          <div className="space-y-5">

            {/* Leser finden */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
                {t('findReaders.title')}
              </h2>
              <FindReadersSection />
            </div>

            {/* Wen ich folge */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
                {t('community.following.iFollow')} ({following.length})
              </h2>
              {following.length === 0 ? (
                <p className="text-stone-400 dark:text-stone-500 text-sm text-center py-4">{t('community.following.noFollowing')}</p>
              ) : (
                <div className="space-y-2">
                  {following.map((f) => {
                    if (!f.user) return null;
                    const name = f.user.full_name || f.user.username || '?';
                    const handle = f.user.username ? `@${f.user.username}` : null;
                    return (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                        <button
                          onClick={() => navigate(`/PublicProfile?email=${encodeURIComponent(f.user.email)}`)}
                          className="flex items-center gap-3 flex-1 text-left min-w-0"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-medium text-sm flex-shrink-0 overflow-hidden">
                            {f.user.profile_picture_url
                              ? <img src={f.user.profile_picture_url} alt="" className="w-full h-full object-cover" />
                              : name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{name}</div>
                            {handle && <div className="text-xs text-stone-400 truncate">{handle}</div>}
                          </div>
                        </button>
                        <Button size="sm" variant="outline" className="flex-shrink-0 text-xs dark:border-stone-600 dark:text-stone-400" onClick={async () => {
                          await base44.entities.UserFollow.delete(f.id);
                          await loadFollowing();
                        }}>
                          {t('community.following.unfollow')}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Meine Follower */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
                {t('community.following.myFollowers')} ({followers.length})
              </h2>
              {followers.length === 0 ? (
                <p className="text-stone-400 dark:text-stone-500 text-sm text-center py-4">{t('community.following.noFollowers')}</p>
              ) : (
                <div className="space-y-2">
                  {followers.map((f) => {
                    if (!f.user) return null;
                    const name = f.user.full_name || f.user.username || '?';
                    const handle = f.user.username ? `@${f.user.username}` : null;
                    return (
                      <button
                        key={f.id}
                        onClick={() => navigate(`/PublicProfile?email=${encodeURIComponent(f.user.email)}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-medium text-sm flex-shrink-0 overflow-hidden">
                          {f.user.profile_picture_url
                            ? <img src={f.user.profile_picture_url} alt="" className="w-full h-full object-cover" />
                            : name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{name}</div>
                          {handle && <div className="text-xs text-stone-400 truncate">{handle}</div>}
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
                      </button>
                    );
                  })}
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
  return <CommunityContent />;
}