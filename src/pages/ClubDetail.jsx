import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, MessageSquare, Settings, Plus, Crown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

export default function ClubDetail() {
  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [readings, setReadings] = useState([]);
  const [myMembership, setMyMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions');
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const clubId = urlParams.get('id');

  useEffect(() => {
    if (clubId) {
      loadData();
    }
  }, [clubId]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [clubData, membersData, discussionsData, readingsData] = await Promise.all([
        base44.entities.BookClub.filter({ id: clubId }),
        base44.entities.ClubMember.filter({ club_id: clubId }),
        base44.entities.ClubDiscussion.filter({ club_id: clubId }, '-created_date'),
        base44.entities.ClubReading.filter({ club_id: clubId }, '-created_date')
      ]);

      if (clubData.length === 0) {
        navigate('/Clubs');
        return;
      }

      setClub(clubData[0]);
      setMembers(membersData);
      setDiscussions(discussionsData);
      setReadings(readingsData);

      const membership = membersData.find(m => m.created_by === currentUser.email);
      if (!membership && clubData[0].is_private) {
        navigate('/Clubs');
        return;
      }
      setMyMembership(membership);
    } catch (error) {
      console.error('Error loading club:', error);
      navigate('/Clubs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  const isAdmin = myMembership?.role === 'admin';
  const currentReading = readings.find(r => r.status === 'current');

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/Clubs')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Zurück zu Clubs</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 mb-6">
          <div className="flex gap-6">
            <div className={cn(
              "w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
              club.cover_color || 'bg-gradient-to-br from-amber-400 to-amber-600'
            )}>
              <BookOpen className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-light text-stone-800">{club.name}</h1>
                {isAdmin && (
                  <Button size="sm" variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Einstellungen</span>
                  </Button>
                )}
              </div>
              
              {club.description && (
                <p className="text-stone-600 mb-4">{club.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-stone-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {members.length} {members.length === 1 ? 'Mitglied' : 'Mitglieder'}
                </div>
              </div>
            </div>
          </div>

          {currentReading && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-stone-500 mb-1">Aktuelles Buch</div>
                  <div className="text-lg font-medium text-stone-800">{currentReading.book_data.title}</div>
                  <div className="text-sm text-stone-600">{currentReading.book_data.author}</div>
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Details ansehen
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 p-1.5 mb-6 flex gap-1.5">
          <button
            onClick={() => setActiveTab('discussions')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'discussions'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Diskussionen
          </button>
          <button
            onClick={() => setActiveTab('readings')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'readings'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Leseliste
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'members'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Mitglieder
          </button>
        </div>

        {/* Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Neue Diskussion
              </Button>
            </div>

            {discussions.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Noch keine Diskussionen</p>
              </div>
            ) : (
              discussions.map((discussion) => (
                <div key={discussion.id} className="bg-white rounded-xl border border-stone-200 p-6">
                  <h3 className="text-lg font-medium text-stone-800 mb-2">{discussion.title}</h3>
                  <p className="text-stone-600 mb-4">{discussion.content}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span>{discussion.created_by?.split('@')[0]}</span>
                    <span>•</span>
                    <span>{discussion.comments_count || 0} Kommentare</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'readings' && (
          <div className="space-y-4">
            {isAdmin && (
              <div className="flex justify-end">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Buch hinzufügen
                </Button>
              </div>
            )}

            {readings.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Noch keine Bücher auf der Leseliste</p>
              </div>
            ) : (
              readings.map((reading) => (
                <div key={reading.id} className="bg-white rounded-xl border border-stone-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-16 h-24 rounded flex items-center justify-center flex-shrink-0",
                      reading.book_data.coverColor || 'bg-stone-100'
                    )}>
                      <span className="text-2xl font-serif text-stone-400">
                        {reading.book_data.title.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-stone-800">{reading.book_data.title}</h3>
                      <p className="text-stone-600 mb-2">{reading.book_data.author}</p>
                      <span className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium",
                        reading.status === 'current' && "bg-green-100 text-green-700",
                        reading.status === 'upcoming' && "bg-blue-100 text-blue-700",
                        reading.status === 'completed' && "bg-stone-100 text-stone-700"
                      )}>
                        {reading.status === 'current' && 'Aktuell'}
                        {reading.status === 'upcoming' && 'Geplant'}
                        {reading.status === 'completed' && 'Abgeschlossen'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium">
                      {member.created_by?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-stone-800">
                        {member.created_by?.split('@')[0]}
                      </div>
                      <div className="text-xs text-stone-500">
                        {member.role === 'admin' && 'Administrator'}
                        {member.role === 'moderator' && 'Moderator'}
                        {member.role === 'member' && 'Mitglied'}
                      </div>
                    </div>
                  </div>
                  {member.role === 'admin' && (
                    <Crown className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}