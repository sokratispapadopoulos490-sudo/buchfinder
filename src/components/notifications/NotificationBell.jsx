import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';
import { de, enUS, el, tr, fr, es, it } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';
import { t as tStatic } from '@/lib/i18n';

const DATE_LOCALES = { de, en: enUS, el, tr, fr, es, it };

const NOTIF_KEY_MAP = {
  post_like:    { title: 'notif.like.title',    message: 'notif.like.message' },
  post_comment: { title: 'notif.comment.title', message: 'notif.comment.message' },
};

/** Ersetzt {actor} und {postTitle} im übersetzten String */
function interpolate(str, params = {}) {
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

/** Gibt lokalisiertes title/message zurück – fällt auf gespeicherte Felder zurück */
function resolveNotif(notif, lang) {
  const keys = NOTIF_KEY_MAP[notif.notif_type];
  if (!keys) return { title: notif.title, message: notif.message };
  const rawTitle   = tStatic(keys.title,   lang);
  const rawMessage = tStatic(keys.message, lang);
  return {
    title:   interpolate(rawTitle,   notif.params),
    message: interpolate(rawMessage, notif.params),
  };
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dateLocale = DATE_LOCALES[language] || de;

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const notifs = await base44.entities.Notification.list('-created_date', 10);
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await base44.entities.Notification.update(notification.id, { is_read: true });
        await loadNotifications();
      }
      setShowDropdown(false);
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(
        unread.map(n => base44.entities.Notification.update(n.id, { is_read: true }))
      );
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 z-50 max-h-96 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-stone-200 p-4 flex items-center justify-between">
                <h3 className="font-medium text-stone-800">{tStatic('account.notifications', language)}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-amber-600 hover:text-amber-700"
                  >
                    {tStatic('notif.markAllRead', language, 'Alle als gelesen')}
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-sm">
                  {tStatic('notif.empty', language, 'Keine Benachrichtigungen')}
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {notifications.map((notif) => {
                    const { title, message } = resolveNotif(notif, language);
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full p-4 text-left hover:bg-stone-50 transition-colors ${
                          !notif.is_read ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-800 text-sm">{title}</p>
                            <p className="text-stone-600 text-xs mt-1">{message}</p>
                            <p className="text-stone-400 text-xs mt-1">
                              {formatDistanceToNow(new Date(notif.created_date), { addSuffix: true, locale: dateLocale })}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}