import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowLeft, Lock, Globe, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import CreateClubModal from '@/components/clubs/CreateClubModal';
import ClubCard from '@/components/clubs/ClubCard';

export default function Clubs() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [allClubs, memberships] = await Promise.all([
        base44.entities.BookClub.list('-created_date'),
        base44.entities.ClubMember.filter({ created_by: currentUser.email })
      ]);

      setClubs(allClubs);
      setMyMemberships(memberships);
    } catch (error) {
      console.error('Error loading clubs:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async (clubData) => {
    try {
      const created = await base44.entities.BookClub.create(clubData);
      
      await base44.entities.ClubMember.create({
        club_id: created.id,
        role: 'admin',
        joined_date: new Date().toISOString().split('T')[0]
      });

      await loadData();
      setShowCreateModal(false);
      navigate(`/ClubDetail?id=${created.id}`);
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  const isMember = (clubId) => {
    return myMemberships.some(m => m.club_id === clubId);
  };

  const filteredClubs = clubs.filter(club => {
    if (filter === 'my') {
      return isMember(club.id);
    } else if (filter === 'public') {
      return !club.is_private;
    } else if (filter === 'private') {
      return club.is_private && isMember(club.id);
    }
    return !club.is_private || isMember(club.id);
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
            <BookOpen className="w-6 h-6 text-amber-600" />
            Buch-Clubs
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
            { key: 'all', label: 'Alle', icon: Globe },
            { key: 'my', label: 'Meine', icon: Users },
            { key: 'public', label: 'Öffentlich', icon: Globe },
            { key: 'private', label: 'Privat', icon: Lock }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${
                filter === tab.key
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clubs */}
        {filteredClubs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 mb-4">
              {filter === 'my' ? 'Du bist noch in keinem Club' : 'Keine Clubs gefunden'}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Ersten Club erstellen
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                isMember={isMember(club.id)}
                membership={myMemberships.find(m => m.club_id === club.id)}
                onUpdate={loadData}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateClubModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateClub}
          />
        )}
      </div>
    </div>
  );
}