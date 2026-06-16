import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2, Calendar, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CreateEventModal from './CreateEventModal';
import { useLanguage } from '@/components/language/LanguageContext';

const CATEGORY_LABELS = {
  lesen: '📖 Buch lesen',
  challenge: '🏆 Challenge',
  club: '👥 Buchclub',
  diskussion: '💬 Diskussion',
  geschenk: '🎁 Geschenk',
  sonstiges: '📌 Sonstiges',
};

const CATEGORY_COLORS = {
  lesen: 'text-amber-600 dark:text-amber-400',
  challenge: 'text-purple-600 dark:text-purple-400',
  club: 'text-blue-600 dark:text-blue-400',
  diskussion: 'text-green-600 dark:text-green-400',
  geschenk: 'text-pink-600 dark:text-pink-400',
  sonstiges: 'text-stone-500 dark:text-stone-400',
};

export default function EventsList() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    const data = await base44.entities.ReadingEvent.filter({ is_done: false }, 'date');
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => { loadEvents(); }, []);

  const markDone = async (id) => {
    await base44.entities.ReadingEvent.update(id, { is_done: true });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const deleteEvent = async (id) => {
    await base44.entities.ReadingEvent.delete(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isOverdue = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  const formatDate = (dateStr) => {
    if (isToday(dateStr)) return t('events.today');
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">{t('events.title')}</h3>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 hover:underline font-medium"
        >
          <Plus className="w-3 h-3" />
          {t('events.new')}
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-stone-400 dark:text-stone-500 py-2">{t('events.loading')}</div>
      ) : events.length === 0 ? (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full py-6 text-center text-sm text-stone-400 dark:text-stone-500 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
        >
          <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
          {t('events.empty')}
        </button>
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                isToday(event.date)
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                  : isOverdue(event.date)
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900'
                  : 'bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-700'
              }`}
            >
              <button
                onClick={() => markDone(event.id)}
                className="mt-0.5 w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <Check className="w-3 h-3 text-transparent hover:text-amber-600" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{event.title}</div>
                <div className={`text-xs font-medium mt-0.5 ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.sonstiges}`}>
                  {CATEGORY_LABELS[event.category] || event.category}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-400 dark:text-stone-500">
                  <span className={`flex items-center gap-1 ${isToday(event.date) ? 'text-amber-600 dark:text-amber-400 font-medium' : isOverdue(event.date) ? 'text-red-500' : ''}`}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(event.date)}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                  )}
                </div>
                {event.notes && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">{event.notes}</p>
                )}
              </div>

              <button
                onClick={() => deleteEvent(event.id)}
                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-300 dark:text-stone-600 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreated={loadEvents}
        />
      )}
    </div>
  );
}