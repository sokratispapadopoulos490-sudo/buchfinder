import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, BookOpen, Crown, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function ClubCard({ club, isMember, membership, onUpdate }) {
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (club.is_private) {
      alert('Dieser Club ist privat. Du benötigst eine Einladung.');
      return;
    }

    try {
      await base44.entities.ClubMember.create({
        club_id: club.id,
        role: 'member',
        joined_date: new Date().toISOString().split('T')[0]
      });

      await base44.entities.BookClub.update(club.id, {
        member_count: (club.member_count || 0) + 1
      });

      await onUpdate();
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 transition-all"
    >
      <div className="flex gap-4 p-6">
        {/* Cover */}
        <div className={cn(
          "w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
          club.cover_color || 'bg-gradient-to-br from-amber-400 to-amber-600'
        )}>
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-stone-800 truncate">{club.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {club.is_private ? (
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Lock className="w-3 h-3" />
                    Privat
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Globe className="w-3 h-3" />
                    Öffentlich
                  </span>
                )}
                <span className="text-xs text-stone-400">•</span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Users className="w-3 h-3" />
                  {club.member_count || 0} {(club.member_count || 0) === 1 ? 'Mitglied' : 'Mitglieder'}
                </span>
              </div>
            </div>
            
            {isMember && membership && (
              <div className="flex items-center gap-1 text-xs text-amber-600 ml-2">
                {membership.role === 'admin' ? (
                  <>
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Mitglied</span>
                  </>
                )}
              </div>
            )}
          </div>

          {club.description && (
            <p className="text-sm text-stone-600 line-clamp-2 mb-3">{club.description}</p>
          )}

          {club.current_book && (
            <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-amber-600 mb-1">Aktuelles Buch</div>
              <div className="text-sm font-medium text-stone-800">{club.current_book.title}</div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Erstellt {formatDistanceToNow(new Date(club.created_date), { addSuffix: true, locale: de })}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        {isMember ? (
          <Button
            onClick={() => navigate(`/ClubDetail?id=${club.id}`)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            Club öffnen
          </Button>
        ) : (
          <Button
            onClick={handleJoin}
            variant="outline"
            className="w-full"
          >
            {club.is_private ? 'Einladung anfragen' : 'Beitreten'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}