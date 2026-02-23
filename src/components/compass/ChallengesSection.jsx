import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const allChallenges = await base44.entities.ReadingChallenge.list('-created_date', 10);
      setChallenges(allChallenges);
      
      const participated = await base44.entities.ChallengeParticipant.list('-created_date');
      setUserChallenges(participated);
    } catch (error) {
      console.error('Fehler beim Laden der Challenges:', error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    setIsLoading(true);
    try {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        current_progress: 0,
        completed: false,
      });
      toast.success('Challenge beigetreten!');
      loadChallenges();
    } catch (error) {
      toast.error('Fehler beim Beitreten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    setIsLoading(true);
    try {
      const participation = userChallenges.find(uc => uc.challenge_id === challengeId);
      if (participation) {
        await base44.entities.ChallengeParticipant.delete(participation.id);
        toast.success('Challenge verlassen!');
        loadChallenges();
      }
    } catch (error) {
      toast.error('Fehler beim Verlassen');
    } finally {
      setIsLoading(false);
    }
  };

  const isUserParticipating = (challengeId) => {
    return userChallenges.some((uc) => uc.challenge_id === challengeId);
  };

  const getDifficultyColor = (goalValue) => {
    if (goalValue <= 5) return 'text-green-600 dark:text-green-400';
    if (goalValue <= 12) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDifficultyLabel = (goalValue) => {
    if (goalValue <= 5) return 'Einfach';
    if (goalValue <= 12) return 'Mittel';
    return 'Schwer';
  };

  const sortedChallenges = [...challenges].sort((a, b) => a.goal_value - b.goal_value);
  const availableChallenges = sortedChallenges.filter(c => !userChallenges.some(uc => uc.challenge_id === c.id));
  const joinedChallenges = sortedChallenges.filter(c => userChallenges.some(uc => uc.challenge_id === c.id));
  const displayedChallenges = showAllChallenges ? availableChallenges : availableChallenges.slice(0, 1);

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">Reading Challenges</h3>
        </div>
      </div>

      <div className="space-y-3">
        {joinedChallenges.length > 0 && (
          <>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-2">Deine aktiven Challenges:</p>
            {joinedChallenges.map((challenge) => {
              const userProgress = userChallenges.find((uc) => uc.challenge_id === challenge.id);
              return (
                <div key={challenge.id} className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200">{challenge.title}</h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">{challenge.description}</p>
                    </div>
                    <span className={`text-xs font-semibold whitespace-nowrap ml-2 ${getDifficultyColor(challenge.goal_value)}`}>
                      {getDifficultyLabel(challenge.goal_value)}
                    </span>
                  </div>

                  {userProgress && (
                    <div className="mb-3">
                      <div className="w-full bg-stone-300 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full transition-all"
                          style={{ width: `${Math.min((userProgress.current_progress / challenge.goal_value) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                        {userProgress.current_progress} / {challenge.goal_value}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleLeaveChallenge(challenge.id)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-xs rounded font-medium transition-colors bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Verlassen
                  </button>
                </div>
              );
            })}
          </>
        )}

        {challenges.length === 0 ? (
          <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-4">Keine Challenges verfügbar</p>
        ) : (
          displayedChallenges.length === 0 && availableChallenges.length > 0 ? null : displayedChallenges.length === 0 ? (
            <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-4">Du hast an allen Challenges teilgenommen 🎉</p>
          ) : (
            <>
              {joinedChallenges.length > 0 && <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-4">Weitere Challenges:</p>}
              {displayedChallenges.map((challenge) => {
            const isParticipating = isUserParticipating(challenge.id);
            const userProgress = userChallenges.find((uc) => uc.challenge_id === challenge.id);
            
            return (
              <div key={challenge.id} className="p-3 bg-stone-50 dark:bg-[#0a0a0a] rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200">{challenge.title}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">{challenge.description}</p>
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ml-2 ${getDifficultyColor(challenge.goal_value)}`}>
                    {getDifficultyLabel(challenge.goal_value)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <div>
                    📚 {challenge.goal_value} {challenge.goal_type === 'books' ? 'Bücher' : 'Seiten'}
                  </div>
                  {challenge.participant_count > 0 && (
                    <div>👥 {challenge.participant_count} Teilnehmer</div>
                  )}
                </div>

                {isParticipating && userProgress && (
                  <div className="mb-3">
                    <div className="w-full bg-stone-300 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full transition-all"
                        style={{ width: `${Math.min((userProgress.current_progress / challenge.goal_value) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      {userProgress.current_progress} / {challenge.goal_value}
                    </p>
                  </div>
                )}

                <button
                   onClick={() => handleJoinChallenge(challenge.id)}
                   disabled={isLoading}
                   className={`w-full px-3 py-2 text-xs rounded font-medium transition-colors ${
                     isLoading
                       ? 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                       : 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                   }`}
                 >
                   {isLoading ? 'Wird beigetreten...' : 'Beitreten'}
                 </button>
                 </div>
                 );
                 })
                 }
                 </>
                 )
                 )}

        {availableChallenges.length > 1 && !showAllChallenges && (
          <button
            onClick={() => setShowAllChallenges(true)}
            className="w-full px-3 py-2 text-xs text-amber-600 dark:text-amber-500 hover:underline font-medium mt-3"
          >
            Alle Challenges anzeigen ({availableChallenges.length})
          </button>
        )}

        {showAllChallenges && availableChallenges.length > 1 && (
          <button
            onClick={() => setShowAllChallenges(false)}
            className="w-full px-3 py-2 text-xs text-stone-500 dark:text-stone-400 hover:underline font-medium mt-3"
          >
            Weniger anzeigen
          </button>
        )}
      </div>
    </div>
  );
}