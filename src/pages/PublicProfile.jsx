/**
 * PublicProfile – Öffentliches Leseprofil eines Nutzers.
 *
 * Routing-Priorität:
 *   1. ?username=solos  → User.list() + clientseitiger Match auf username-Feld
 *   2. ?email=...       → Fallback für alte Links (nie UI-sichtbar)
 *   3. kein Parameter   → Empty State
 *
 * Datenschutz:
 *   - E-Mail niemals angezeigt
 *   - profile_is_public !== true → "Profil privat"-Meldung
 *   - username fehlt → kein Handle angezeigt
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, UserCheck, MessageSquare, Users, BookOpen, Lock, UserSearch } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';

export default function PublicProfile() {
  const { t } = useLanguage();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const usernameParam = urlParams.get('username');
  const emailParam = urlParams.get('email') || urlParams.get('user');

  // Wir haben einen Parameter wenn entweder username oder email vorhanden
  const hasParam = !!(usernameParam || emailParam);

  useEffect(() => {
    if (!hasParam) { setLoading(false); return; }
    loadProfile();
  }, [usernameParam, emailParam]);

  const loadProfile = async () => {
    try {
      const [current, allUsers] = await Promise.all([
        base44.auth.me(),
        base44.entities.User.list(),
      ]);
      setCurrentUser(current);

      // Lookup: username bevorzugt, email als Fallback
      let profile = null;
      if (usernameParam) {
        const lower = usernameParam.toLowerCase();
        const matches = allUsers.filter(u => u.username?.toLowerCase() === lower);
        if (matches.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        // Bei Duplikaten (Altdaten): keinen blinden Treffer anzeigen, sondern sicheren Zustand
        if (matches.length > 1) {
          setNotFound(true); // ambiguous – sicherer als falsches Profil zeigen
          setLoading(false);
          return;
        }
        profile = matches[0];
      } else {
        profile = allUsers.find(u => u.email === emailParam);
        if (!profile) {
          setNotFound(true);
          setLoading(false);
          return;
        }
      }

      setProfileUser(profile);

      // Datenschutz: Profil privat? (undefined = nicht explizit öffentlich → privat behandeln)
      if (profile.profile_is_public !== true && profile.email !== current?.email) {
        setIsPrivate(true);
        setLoading(false);
        return;
      }

      const profileEmail = profile.email;

      // Parallele Abfragen – NUR öffentliche Daten
      const [userPosts, myFollows, followers, following] = await Promise.all([
        base44.entities.CommunityPost.filter({ created_by: profileEmail }, '-created_date', 10),
        current ? base44.entities.UserFollow.filter({ created_by: current.email, following_email: profileEmail }) : Promise.resolve([]),
        base44.entities.UserFollow.filter({ following_email: profileEmail }),
        base44.entities.UserFollow.filter({ created_by: profileEmail }),
      ]);

      setPosts(userPosts);
      setIsFollowing(myFollows.length > 0);
      setFollowerCount(followers.length);
      setFollowingCount(following.length);
    } catch (err) {
      console.error('PublicProfile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) { base44.auth.redirectToLogin(); return; }
    if (!profileUser) return;
    const profileEmail = profileUser.email;
    try {
      if (isFollowing) {
        const follows = await base44.entities.UserFollow.filter({
          created_by: currentUser.email,
          following_email: profileEmail
        });
        if (follows.length > 0) await base44.entities.UserFollow.delete(follows[0].id);
        setIsFollowing(false);
        setFollowerCount(c => Math.max(0, c - 1));
      } else {
        await base44.entities.UserFollow.create({ following_email: profileEmail });
        // Notification: Link via username wenn vorhanden, sonst via email (intern)
        try {
          const actorName = currentUser.full_name || currentUser.username || null;
          const actorLink = currentUser.username
            ? `/PublicProfile?username=${encodeURIComponent(currentUser.username)}`
            : `/PublicProfile?email=${encodeURIComponent(currentUser.email)}`;
          await base44.entities.Notification.create({
            notif_type: 'user_follow',
            type: 'mention',
            title: null,
            message: null,
            params: { actor: actorName || '?' },
            link: actorLink,
            from_user_email: currentUser.email,
            created_by: profileEmail,
          });
        } catch {}
        setIsFollowing(true);
        setFollowerCount(c => c + 1);
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
    }
  };

  // ── Kein Parameter ───────────────────────────────────────────────────────
  if (!hasParam && !loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 px-4">
        <UserSearch className="w-12 h-12 text-stone-300 dark:text-stone-600" />
        <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">{t('profile.noEmail')}</p>
        <p className="text-stone-400 dark:text-stone-500 text-xs text-center max-w-xs">{t('profile.noEmailHint')}</p>
        <Button variant="outline" onClick={() => navigate('/Community')} className="gap-2 mt-2">
          <ArrowLeft className="w-4 h-4" /> {t('nav.community')}
        </Button>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-stone-400 text-sm">{t('status.loading')}</div>
      </div>
    );
  }

  // ── Nicht gefunden ───────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 px-4">
        <UserSearch className="w-12 h-12 text-stone-300 dark:text-stone-600" />
        <p className="text-stone-600 dark:text-stone-400 text-sm font-medium">{t('profile.notFound')}</p>
        <p className="text-stone-400 dark:text-stone-500 text-xs text-center max-w-xs">{t('profile.notFoundHint')}</p>
        <Button variant="outline" onClick={() => navigate('/Community')} className="gap-2 mt-2">
          <ArrowLeft className="w-4 h-4" /> {t('nav.community')}
        </Button>
      </div>
    );
  }

  // ── Profil privat ────────────────────────────────────────────────────────
  if (isPrivate) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-6 flex flex-col items-center justify-center gap-4">
        <Lock className="w-10 h-10 text-stone-300" />
        <p className="text-stone-500 dark:text-stone-400 text-sm">{t('profile.private')}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('btn.back')}
        </Button>
      </div>
    );
  }

  if (!profileUser) return null;

  const isOwnProfile = currentUser?.email === profileUser.email;
  // Anzeigename: full_name → username → '?' (nie E-Mail)
  const displayName = profileUser.full_name || profileUser.username || '?';
  const usernameHandle = profileUser.username ? `@${profileUser.username}` : null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-6 md:px-6 md:py-10">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {t('btn.back')}
        </button>

        {/* ── Profil-Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6 mb-4 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-light shadow-md flex-shrink-0 overflow-hidden">
              {profileUser.profile_picture_url ? (
                <img src={profileUser.profile_picture_url} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name + Handle + Bio */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100 truncate">{displayName}</h1>
              {usernameHandle && (
                <p className="text-sm text-stone-400 dark:text-stone-500 truncate mb-1">{usernameHandle}</p>
              )}
              {profileUser.bio && (
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{profileUser.bio}</p>
              )}

              {/* Genres */}
              {profileUser.favorite_genres?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profileUser.favorite_genres.slice(0, 5).map((g, i) => (
                    <span key={i} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statistiken */}
          <div className="flex items-center gap-5 text-sm text-stone-500 dark:text-stone-400 mb-5">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span><strong className="text-stone-800 dark:text-stone-200">{followerCount}</strong> {t('network.followMe')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span><strong className="text-stone-800 dark:text-stone-200">{followingCount}</strong> {t('network.iFollow')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span><strong className="text-stone-800 dark:text-stone-200">{posts.length}</strong> {t('community.tab.posts')}</span>
            </div>
          </div>

          {/* Aktions-Buttons */}
          {!isOwnProfile && (
            <div className="flex gap-3">
              <Button
                onClick={handleFollowToggle}
                className={`flex-1 gap-2 text-sm ${
                  isFollowing
                    ? 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isFollowing ? (
                  <><UserCheck className="w-4 h-4" /> {t('community.following.unfollow')}</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> {t('profile.follow')}</>
                )}
              </Button>
              <Button
                onClick={() => navigate(`/Community?tab=messages&to=${encodeURIComponent(profileUser.email)}`)}
                variant="outline"
                className="flex-1 gap-2 text-sm dark:border-stone-600 dark:text-stone-300"
              >
                <MessageSquare className="w-4 h-4" /> {t('post.message')}
              </Button>
            </div>
          )}

          {isOwnProfile && (
            <Button
              onClick={() => navigate('/Account')}
              variant="outline"
              className="w-full text-sm dark:border-stone-600 dark:text-stone-300"
            >
              {t('account.editProfile')}
            </Button>
          )}
        </motion.div>

        {/* ── Öffentliche Posts ──────────────────────────────────────────── */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
              {t('community.tab.posts')}
            </h2>
            <div className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate('/Community')}
                  className="p-4 border border-stone-100 dark:border-stone-700 rounded-xl hover:border-amber-200 dark:hover:border-amber-800 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{post.content}</p>
                  <div className="flex gap-4 mt-2 text-xs text-stone-400">
                    <span>♥ {post.likes_count || 0}</span>
                    <span>💬 {post.comments_count || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-8 text-stone-400 dark:text-stone-500 text-sm">
            {t('profile.noPosts')}
          </div>
        )}
      </div>
    </div>
  );
}