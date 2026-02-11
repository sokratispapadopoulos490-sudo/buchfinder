import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReadingJourneyTeaser({ completedBooksCount, recentBooks }) {
  const navigate = useNavigate();

  if (completedBooksCount < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8 shadow-lg mb-8"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-stone-800 mb-2">
            Deine Lesereise wartet auf dich
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Du hast {completedBooksCount} Bücher gelesen und wichtige Reflexionen festgehalten.
            Premium-Nutzer erhalten jetzt einen persönlichen Einblick, was diese Bücher
            über ihre aktuelle Lebensphase verraten.
          </p>
        </div>
      </div>

      {/* Preview Content (Blurred) */}
      <div className="relative mb-6">
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-stone-500 mb-2">📚 Deine Lesereise im {new Date().toLocaleDateString('de', { month: 'long', year: 'numeric' })}</div>
              <p className="text-sm text-stone-700 leading-relaxed">
                In den letzten Wochen hast du {completedBooksCount} Bücher abgeschlossen. 
                Ein klarer roter Faden zeigt sich: Du suchst nach...
              </p>
            </div>
            
            <div>
              <div className="text-xs font-medium text-stone-500 mb-2">💡 Dein größter Erkenntnissprung</div>
              <p className="text-sm text-stone-700 leading-relaxed">
                Aus deinen Notizen: "Die Art, wie ich über..."
              </p>
            </div>

            <div>
              <div className="text-xs font-medium text-stone-500 mb-2">🔄 Muster, die auffallen</div>
              <p className="text-sm text-stone-700 leading-relaxed">
                In allen Büchern taucht ein Thema immer wieder auf...
              </p>
            </div>
          </div>
        </div>
        
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-transparent via-white/40 to-white/90 rounded-xl flex items-end justify-center pb-6">
          <div className="text-center">
            <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">Premium Feature</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => navigate('/Premium')}
          className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white gap-2"
        >
          <Crown className="w-4 h-4" />
          Lesereise freischalten
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate('/Premium')}
        >
          Mehr erfahren
        </Button>
      </div>

      {/* Premium Benefits */}
      <div id="premium-benefits" className="mt-6 pt-6 border-t border-amber-200">
        <div className="text-xs font-medium text-stone-600 mb-3">Was du mit Premium bekommst:</div>
        <div className="grid gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Monatlicher Reflexionsbericht über deine Lesemuster</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Erkenne, wie Bücher dich verändern</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Unbegrenzte Buchempfehlungen</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}