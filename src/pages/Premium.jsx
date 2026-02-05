import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const navigate = useNavigate();

  const plans = {
    monthly: {
      name: 'Monatlich',
      price: '4,99€',
      period: 'pro Monat',
      priceId: Deno.env.get('STRIPE_PRICE_ID') || 'price_monthly', // Fallback für Development
      savings: null
    },
    yearly: {
      name: 'Jährlich',
      price: '49,99€',
      period: 'pro Jahr',
      priceId: 'price_yearly', // Muss in Stripe erstellt werden
      savings: '17% sparen'
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('createCheckoutSession', {
        priceId: plans[selectedPlan].priceId
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Es gab einen Fehler. Bitte versuche es später erneut.');
      setLoading(false);
    }
  };

  const features = [
    'Unbegrenzte Buchempfehlungen',
    'Erweiterte Persönlichkeitsprofile',
    'Zugriff auf neue Bücher als Erster',
    'Personalisierte Leselisten',
    'Empfehlungsverlauf speichern',
    'Prioritäts-Support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-stone-500 hover:text-stone-700 mb-8 transition-colors"
        >
          ← Zurück
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Premium Upgrade
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-stone-800 mb-4">
            Entdecke mehr Bücher
          </h1>
          
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Erhalte unbegrenzte personalisierte Empfehlungen und entdecke deine nächsten Lieblingsbücher
          </p>
        </motion.div>

        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-stone-800 text-white shadow-lg'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Monatlich
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
              selectedPlan === 'yearly'
                ? 'bg-stone-800 text-white shadow-lg'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Jährlich
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
              -17%
            </span>
          </button>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-amber-200 p-8 mb-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-light text-stone-800">
                {plans[selectedPlan].price}
              </span>
              <span className="text-stone-500">{plans[selectedPlan].period}</span>
            </div>
            {plans[selectedPlan].savings && (
              <p className="text-amber-700 font-medium">{plans[selectedPlan].savings}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-stone-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={loading}
            size="lg"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6 text-lg rounded-xl gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Wird geladen...
              </>
            ) : (
              <>
                Jetzt upgraden
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-stone-500 mt-4">
            Jederzeit kündbar. Sichere Zahlung via Stripe.
          </p>
        </motion.div>

        {/* FAQ/Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-stone-50 rounded-xl p-6 text-center"
        >
          <Compass className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <p className="text-stone-600 text-sm">
            Teste Premium 7 Tage kostenlos und entdecke, wie Book Compass dein Leseerlebnis transformiert
          </p>
        </motion.div>
      </div>
    </div>
  );
}