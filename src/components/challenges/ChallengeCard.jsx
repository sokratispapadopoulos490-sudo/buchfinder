import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Target, Users, Calendar, Trophy, TrendingUp, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { differenceInDays, format, isPast, isFuture } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function ChallengeCard({ challenge, isParticipating, participation, onJoin, onLeave, onUpdate, currentUser }) {
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const now = new Date();
  const daysLeft = differenceInDays(endDate, now);
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = isFuture(startDate);
  const isCompleted = isPast(endDate);

  const goalTypeLabels = {
    books: 'Bücher',
    pages: 'Seiten',
    genres: 'Genres'
  };

  const progressPercentage = participation 
    ? Math.min(100, Math.round((participation.current_progress / challenge.goal_value) * 100))
    : 0;

  const handleUpdateProgress = async (increment) => {
    if (!participation) return;
    
    setUpdatingProgress(true);
    try {
      const newProgress = Math.max(0, participation.current_progress + increment);
      const isNowCompleted = newProgress >= challenge.goal_value;
      
      await base44.entities.ChallengeParticipant.update(participation.id, {
        current_progress: newProgress,
        completed: isNowCompleted,
        completed_date: isNowCompleted && !participation.completed ? new Date().toISOString().split('T')[0] : participation.completed_date
      });

      if (isNowCompleted && !participation.completed) {
        // Create achievement notification
        await base44.entities.Notification.create({
          type: 'achievement',
          title: 'Challenge geschafft! 🎉',
          message: `Du hast "${challenge.title}" erfolgreich abgeschlossen!`,
          link: '/Challenges',
          created_by: currentUser.email
        });
      }

      await onUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border overflow-hidden",
        participation?.completed ? "border-green-200" : "border-stone-200"
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-stone-800">{challenge.title}</h3>
              {participation?.completed && (
                <Trophy className="w-5 h-5 text-green-600" />
              )}
            </div>
            {challenge.description && (
              <p className="text-sm text-stone-600 mb-3">{challenge.description}</p>
            )}
          </div>
          
          {/* Status Badge */}
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3",
            isActive && "bg-green-100 text-green-700",
            isUpcoming && "bg-blue-100 text-blue-700",
            isCompleted && "bg-stone-100 text-stone-700"
          )}>
            {isUpcoming && 'Startet bald'}
            {isActive && 'Läuft'}
            {isCompleted && 'Beendet'}
          </div>
        </div>

        {/* Challenge Info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{challenge.goal_value} {goalTypeLabels[challenge.goal_type]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{challenge.participant_count || 0} Teilnehmer</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {format(startDate, 'd. MMM', { locale: de })} - {format(endDate, 'd. MMM', { locale: de })}
            </span>
          </div>
          {isActive && daysLeft > 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <TrendingUp className="w-4 h-4" />
              <span>Noch {daysLeft} {daysLeft === 1 ? 'Tag' : 'Tage'}</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if participating) */}
        {isParticipating && participation && (
          <div className="mb-4 p-4 bg-stone-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone-700">Dein Fortschritt</span>
              <span className="text-sm text-stone-600">
                {participation.current_progress}/{challenge.goal_value}
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 mb-3">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all",
                  participation.completed ? "bg-green-600" : "bg-amber-600"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {isActive && !participation.completed && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateProgress(1)}
                  disabled={updatingProgress}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  +1
                </Button>
                {participation.current_progress > 0 && (
                  <Button
                    onClick={() => handleUpdateProgress(-1)}
                    disabled={updatingProgress}
                    size="sm"
                    variant="outline"
                  >
                    -1
                  </Button>
                )}
              </div>
            )}
            
            {participation.completed && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Geschafft am {format(new Date(participation.completed_date), 'd. MMMM', { locale: de })}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!isParticipating ? (
          <Button
            onClick={() => onJoin(challenge.id)}
            disabled={isCompleted}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isCompleted ? 'Challenge beendet' : 'Teilnehmen'}
          </Button>
        ) : (
          !participation?.completed && (
            <Button
              onClick={() => onLeave(challenge.id)}
              variant="outline"
              className="w-full"
            >
              Challenge verlassen
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
}