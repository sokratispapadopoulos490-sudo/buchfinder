import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Target } from 'lucide-react';

export default function CreateChallengeModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState('books');
  const [goalValue, setGoalValue] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const goalTypes = [
    { value: 'books', label: 'Bücher lesen', unit: 'Bücher' },
    { value: 'pages', label: 'Seiten lesen', unit: 'Seiten' },
    { value: 'genres', label: 'Verschiedene Genres', unit: 'Genres' }
  ];

  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) return;

    setSubmitting(true);
    try {
      await onCreate({
        title,
        description,
        goal_type: goalType,
        goal_value: parseInt(goalValue),
        start_date: startDate,
        end_date: endDate,
        is_public: true
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-light text-stone-800">Challenge erstellen</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Titel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. 10 Bücher in 30 Tagen"
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Beschreibung
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Was ist das Ziel dieser Challenge?"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Ziel-Typ *
            </label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {goalTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Zielwert *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                min="1"
                className="flex-1 px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-sm text-stone-500">
                {goalTypes.find(t => t.value === goalType)?.unit}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Start *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Ende *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-stone-200 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !startDate || !endDate || submitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {submitting ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}