import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck } from 'lucide-react';

export default function FollowingSection() {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [myEmail, setMyEmail] = useState('');
  const [tab, setTab] = useState('following');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      setMyEmail(me.email);
      const [allFollows] = await Promise.all([
        base44.entities.UserFollow.list('-created_date', 100),
      ]);
      // Wen ich folge (created_by === meine Email)
      const iFollow = allFollows.filter(f => f.created_by === me.email);
      // Wer mir folgt (following_email === meine Email)
      const followMe = allFollows.filter(f => f.following_email === me.email);
      setFollowing(iFollow);
      setFollowers(followMe);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const list = tab === 'following' ? following : followers;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-amber-600" />
        <span className="font-medium text-stone-800 dark:text-stone-200">Mein Netzwerk</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('following')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'following'
              ? 'bg-amber-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          Ich folge <span className="ml-1 opacity-70">({following.length})</span>
        </button>
        <button
          onClick={() => setTab('followers')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'followers'
              ? 'bg-amber-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          Folgen mir <span className="ml-1 opacity-70">({followers.length})</span>
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-4 text-stone-400 text-sm">
          {tab === 'following' ? 'Du folgst noch niemandem.' : 'Noch keine Follower.'}
        </div>
      ) : (
        <div className="space-y-2">
          {list.slice(0, 5).map((follow, idx) => {
            const email = tab === 'following' ? follow.following_email : follow.created_by;
            const displayName = email?.split('@')[0] || email;
            return (
              <button
                key={idx}
                onClick={() => navigate(`/PublicProfile?email=${encodeURIComponent(email)}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{displayName}</div>
                  <div className="text-xs text-stone-400 truncate">{email}</div>
                </div>
                <UserCheck className="w-4 h-4 text-stone-300 flex-shrink-0" />
              </button>
            );
          })}
          {list.length > 5 && (
            <button
              onClick={() => navigate('/Community?tab=following')}
              className="w-full text-xs text-amber-600 text-center py-1 hover:underline"
            >
              Alle {list.length} anzeigen
            </button>
          )}
        </div>
      )}
    </div>
  );
}