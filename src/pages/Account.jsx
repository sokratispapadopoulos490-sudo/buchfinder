import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Crown, ArrowRight, BookOpen, Sparkles, Clock, User as UserIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Account() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const recs = await base44.entities.Recommendation.list('-created_date');
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading account:', error);
      base44.auth.redirectToLogin();
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

  const isPremium = user?.is_premium || false;
  const freeLimit = 3;
  const usedRecommendations = recommendations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-stone-500 hover:text-stone-700 mb-8 transition-colors"
        >
          ← Zurück zur Startseite
        </button>

        {/* Header mit Premium Status */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-stone-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-stone-800">{user.full_name}</h1>
                  <p className="text-stone-500 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {isPremium ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium Mitglied
              </div>
            ) : (
              <Button
                onClick={() => navigate('/Premium')}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white gap-2"
              >
                <Crown className="w-4 h-4" />
                Auf Premium upgraden
              </Button>
            )}
          </div>

          {/* Nutzungsstatistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Compass className="w-4 h-4" />
                Empfehlungen erhalten
              </div>
              <div className="text-2xl font-light text-stone-800">
                {isPremium ? (
                  <span className="flex items-center gap-2">
                    {usedRecommendations}
                    <span className="text-sm text-amber-600 font-medium">unbegrenzt</span>
                  </span>
                ) : (
                  <span>{usedRecommendations} / {freeLimit}</span>
                )}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <BookOpen className="w-4 h-4" />
                Bücher entdeckt
              </div>
              <div className="text-2xl font-light text-stone-800">
                {recommendations.reduce((sum, rec) => sum + (rec.books?.length || 0), 0)}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                Mitglied seit
              </div>
              <div className="text-2xl font-light text-stone-800">
                {formatDistanceToNow(new Date(user.created_date), { addSuffix: false, locale: de })}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Info */}
        {!isPremium && usedRecommendations >= freeLimit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light text-stone-800 mb-2">
                  Du hast alle kostenlosen Empfehlungen genutzt
                </h3>
                <p className="text-stone-600 mb-4">
                  Upgrade auf Premium für unbegrenzte Empfehlungen und exklusive Features
                </p>
                <Button
                  onClick={() => navigate('/Premium')}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  Premium freischalten
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empfehlungsverlauf */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-stone-800">
              {isPremium ? 'Dein Empfehlungsverlauf' : 'Deine Empfehlungen'}
            </h2>
            {isPremium && (
              <div className="text-sm text-stone-500">
                {recommendations.length} gespeichert
              </div>
            )}
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Compass className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 mb-4">Noch keine Empfehlungen erhalten</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-stone-800 hover:bg-stone-700 text-white"
              >
                Erste Empfehlung erhalten
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, isPremium ? undefined : freeLimit).map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(rec.created_date), { addSuffix: true, locale: de })}
                    </div>
                    {rec.is_premium && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <Crown className="w-3 h-3" />
                        Premium
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-stone-500 mb-2">Empfohlene Bücher:</div>
                      <div className="flex flex-wrap gap-2">
                        {rec.books?.slice(0, 3).map((book, i) => (
                          <div key={i} className="bg-stone-50 px-3 py-1 rounded-full text-sm text-stone-700">
                            {book.title}
                          </div>
                        ))}
                        {rec.books?.length > 3 && (
                          <div className="bg-stone-100 px-3 py-1 rounded-full text-sm text-stone-600">
                            +{rec.books.length - 3} weitere
                          </div>
                        )}
                      </div>
                    </div>

                    {rec.profile && (
                      <div>
                        <div className="text-xs text-stone-500 mb-2">Dein Profil:</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.profile.mainTopics?.map((topic, i) => (
                            <div key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs">
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {!isPremium && recommendations.length > freeLimit && (
                <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-6 text-center">
                  <p className="text-stone-600 mb-3">
                    {recommendations.length - freeLimit} weitere Empfehlungen verfügbar
                  </p>
                  <Button
                    onClick={() => navigate('/Premium')}
                    variant="outline"
                    className="gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Mit Premium anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => base44.auth.logout()}
            variant="ghost"
            className="text-stone-500 hover:text-stone-700"
          >
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}