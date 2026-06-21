/**
 * FindReadersSection – Leser finden und folgen.
 *
 * Ansatz (V1, datenschutzfreundlich):
 * - Lädt alle User via User.list() (Base44 schützt sensitive Felder automatisch)
 * - Suche nach Anzeigename/Username/E-Mail-Präfix
 * - Filter nach Genres
 * - Fallback: Zeigt aktive Community-Autoren wenn Suche leer
 * - Eigene Person wird nie angezeigt
 * - E-Mail wird NUR als technischer Key verwendet, nicht als Anzeige
 */

import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';
import { Search, UserPlus, UserCheck, Users } from 'lucide-react';

const GENRE_FILTERS = [
  "Fantasy", "Thriller", "Romance", "Sachbuch", "Philosophie",
  "Krimi", "Science-Fiction", "Biografie", "Selbstentwicklung"
];

export default function FindReadersSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [myFollows, setMyFollows] = useState([]); // following_email[] die ich folge
  const [communityAuthors, setCommunityAuthors] = useState([]); // Fallback
  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState({}); // email → bool
  const [me, setMe] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [currentUser, users, follows, posts] = await Promise.all([
        base44.auth.me(),
        base44.entities.User.list(),
        base44.entities.UserFollow.list('-created_date', 200),
        base44.entities.CommunityPost.list('-created_date', 50),
      ]);
      setMe(currentUser);

      // Nur Nutzer mit Profil und nicht ich selbst
      const others = users.filter(u => u.email !== currentUser.email);
      setAllUsers(others);

      // Meine aktuellen Follows
      const iFollow = follows
        .filter(f => f.created_by === currentUser.email)
        .map(f => f.following_email);
      setMyFollows(iFollow);

      // Fallback: aktive Post-Autoren
      const authorEmails = [...new Set(posts.map(p => p.created_by).filter(Boolean))];
      const activeAuthors = others.filter(u => authorEmails.includes(u.email)).slice(0, 10);
      setCommunityAuthors(activeAuthors);
    } catch (err) {
      console.error('FindReadersSection load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gefilterte Nutzerliste
  const filtered = useMemo(() => {
    if (!query && selectedGenres.length === 0) return [];

    return allUsers.filter(u => {
      const displayName = u.full_name || u.username || u.email?.split('@')[0] || '';
      const handle = u.username || u.email?.split('@')[0] || '';

      const matchesQuery = !query ||
        displayName.toLowerCase().includes(query.toLowerCase()) ||
        handle.toLowerCase().includes(query.toLowerCase());

      const matchesGenres = selectedGenres.length === 0 ||
        selectedGenres.every(g => u.favorite_genres?.includes(g));

      return matchesQuery && matchesGenres;
    }).slice(0, 20);
  }, [query, selectedGenres, allUsers]);

  const handleFollowToggle = async (targetEmail) => {
    if (!me) { base44.auth.redirectToLogin(); return; }
    setFollowLoading(prev => ({ ...prev, [targetEmail]: true }));
    try {
      if (myFollows.includes(targetEmail)) {
        const follows = await base44.entities.UserFollow.filter({
          created_by: me.email,
          following_email: targetEmail,
        });
        if (follows.length > 0) await base44.entities.UserFollow.delete(follows[0].id);
        setMyFollows(prev => prev.filter(e => e !== targetEmail));
      } else {
        await base44.entities.UserFollow.create({ following_email: targetEmail });
        try {
          await base44.entities.Notification.create({
            type: 'follow',
            title: t('notif.follow.title'),
            message: `${me.full_name || me.email?.split('@')[0]} ${t('notif.follow.action')}`,
            link: `/PublicProfile?email=${encodeURIComponent(me.email)}`,
            from_user_email: me.email,
            created_by: targetEmail,
          });
        } catch {}
        setMyFollows(prev => [...prev, targetEmail]);
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetEmail]: false }));
    }
  };

  const displayList = (query || selectedGenres.length > 0) ? filtered : communityAuthors;
  const showFallback = !query && selectedGenres.length === 0;

  const UserRow = ({ user }) => {
    const isFollowing = myFollows.includes(user.email);
    const isLoading = followLoading[user.email];
    const displayName = user.full_name || user.username || user.email?.split('@')[0] || '?';
    const handle = user.username ? `@${user.username}` : `@${user.email?.split('@')[0]}`;

    return (
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
        {/* Avatar */}
        <button
          onClick={() => navigate(`/PublicProfile?email=${encodeURIComponent(user.email)}`)}
          className="flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-medium shadow-sm overflow-hidden">
            {user.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="" className="w-full h-full object-cover" />
            ) : displayName.charAt(0).toUpperCase()}
          </div>
        </button>

        {/* Info */}
        <button
          onClick={() => navigate(`/PublicProfile?email=${encodeURIComponent(user.email)}`)}
          className="flex-1 min-w-0 text-left"
        >
          <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{displayName}</div>
          <div className="text-xs text-stone-400 truncate">{handle}</div>
          {user.favorite_genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {user.favorite_genres.slice(0, 3).map((g, i) => (
                <span key={i} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">{g}</span>
              ))}
            </div>
          )}
        </button>

        {/* Follow-Button */}
        <button
          onClick={() => handleFollowToggle(user.email)}
          disabled={isLoading}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isFollowing
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          } disabled:opacity-60`}
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? (
            <><UserCheck className="w-3 h-3" /> {t('community.following.unfollow')}</>
          ) : (
            <><UserPlus className="w-3 h-3" /> {t('profile.follow')}</>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-stone-400 text-sm">{t('status.loading')}</div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Suche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('findReaders.searchPlaceholder')}
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1a1a1a] text-stone-800 dark:text-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
        />
      </div>

      {/* Genre-Filter */}
      <div className="flex flex-wrap gap-2">
        {GENRE_FILTERS.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGenres(prev =>
              prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
            )}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              selectedGenres.includes(g)
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-amber-400'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Fallback-Label */}
      {showFallback && communityAuthors.length > 0 && (
        <p className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {t('findReaders.activeReaders')}
        </p>
      )}

      {/* Ergebnisse */}
      {displayList.length > 0 ? (
        <div className="space-y-1">
          {displayList.map(u => <UserRow key={u.id} user={u} />)}
        </div>
      ) : (
        <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-sm">
          {query || selectedGenres.length > 0 ? t('findReaders.noResults') : t('findReaders.empty')}
        </div>
      )}
    </div>
  );
}