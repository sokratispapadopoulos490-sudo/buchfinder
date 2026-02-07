import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Target, Plus, ArrowLeft, Users, Trophy, Calendar, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import { de } from 'date-fns/locale';
import CreateChallengeModal from '@/components/challenges/CreateChallengeModal';
import ChallengeCard from '@/components/challenges/ChallengeCard';

export default function Challenges() {
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [allChallenges, participations] = await Promise.all([
        base44.entities.ReadingChallenge.list('-created_date'),
        base44.entities.ChallengeParticipant.filter({ created_by: currentUser.email })
      ]);

      setChallenges(allChallenges);
      setMyParticipations(participations);
    } catch (error) {
      console.error('Error loading challenges:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (challengeData) => {
    try {
      const created = await base44.entities.ReadingChallenge.create(challengeData);
      
      // Auto-join own challenge
      await base44.entities.ChallengeParticipant.create({
        challenge_id: created.id,
        current_progress: 0
      });
      
      await base44.entities.ReadingChallenge.update(created.id, {
        participant_count: 1
      });

      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        current_progress: 0
      });

      const challenge = challenges.find(c => c.id === challengeId);
      await base44.entities.ReadingChallenge.update(challengeId, {
        participant_count: (challenge.participant_count || 0) + 1
      });

      await loadData();
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    if (!confirm('Challenge wirklich verlassen?')) return;

    try {
      const participation = myParticipations.find(p => p.challenge_id === challengeId);
      if (participation) {
        await base44.entities.ChallengeParticipant.delete(participation.id);

        const challenge = challenges.find(c => c.id === challengeId);
        await base44.entities.ReadingChallenge.update(challengeId, {
          participant_count: Math.max(0, (challenge.participant_count || 0) - 1)
        });

        await loadData();
      }
    } catch (error) {
      console.error('Error leaving challenge:', error);
    }
  };

  const isParticipating = (challengeId) => {
    return myParticipations.some(p => p.challenge_id === challengeId);
  };

  const getParticipation = (challengeId) => {
    return myParticipations.find(p => p.challenge_id === challengeId);
  };

  const now = new Date();
  const filteredChallenges = challenges.filter(challenge => {
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    
    if (filter === 'active') {
      return now >= startDate && now <= endDate;
    } else if (filter === 'upcoming') {
      return now < startDate;
    } else if (filter === 'completed') {
      return now > endDate;
    } else if (filter === 'my') {
      return isParticipating(challenge.id);
    }
    return true;
  });

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
            <Target className="w-6 h-6 text-amber-600" />
            Lese-Challenges
          </h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Erstellen</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 p-1.5 mb-6 flex gap-1.5 overflow-x-auto">
          {[
            { key: 'active', label: 'Aktiv', count: challenges.filter(c => {
              const start = new Date(c.start_date);
              const end = new Date(c.end_date);
              return now >= start && now <= end;
            }).length },
            { key: 'my', label: 'Meine', count: myParticipations.length },
            { key: 'upcoming', label: 'Bald', count: challenges.filter(c => now < new Date(c.start_date)).length },
            { key: 'completed', label: 'Beendet', count: challenges.filter(c => now > new Date(c.end_date)).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Challenges */}
        {filteredChallenges.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <Target className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 mb-4">Keine Challenges gefunden</p>
            {filter === 'my' && (
              <Button
                onClick={() => setFilter('active')}
                variant="outline"
              >
                Aktive Challenges ansehen
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isParticipating={isParticipating(challenge.id)}
                participation={getParticipation(challenge.id)}
                onJoin={handleJoinChallenge}
                onLeave={handleLeaveChallenge}
                onUpdate={loadData}
                currentUser={user}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateChallengeModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateChallenge}
          />
        )}
      </div>
    </div>
  );
}