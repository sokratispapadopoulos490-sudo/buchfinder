import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, User, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de, el as elLocale, tr as trLocale, fr, es, it } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/components/language/LanguageContext';

export default function CommentSection({ 
  comments, 
  onAddComment, 
  onLikeComment, 
  onAskAI,
  currentUser,
  isPremium 
}) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { t, language } = useLanguage();

  const dateLocaleMap = { de, el: elLocale, tr: trLocale, fr, es, it };
  const dateLocale = dateLocaleMap[language] || de;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    await onAddComment(newComment.trim());
    setNewComment('');
    setLoading(false);
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    await onAskAI();
    setAiLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* AI Button für Premium */}
      {isPremium && (
        <Button
          onClick={handleAskAI}
          disabled={aiLoading}
          variant="outline"
          className="w-full gap-2 border-amber-300 hover:bg-amber-50"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          {aiLoading ? t('comment.askAILoading') : t('comment.askAI')}
        </Button>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('comment.placeholder')}
          className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <Button
          type="submit"
          disabled={loading || !newComment.trim()}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700"
        >
          {t('comment.send')}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment, index) => {
          const isAuthor = currentUser?.email === comment.created_by;
          const isUserPremium = currentUser?.is_premium || currentUser?.role === 'admin';

          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-lg",
                comment.is_ai_response 
                  ? "bg-amber-50 border border-amber-200" 
                  : "bg-stone-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0",
                  comment.is_ai_response 
                    ? "bg-gradient-to-br from-amber-500 to-amber-600" 
                    : "bg-gradient-to-br from-stone-500 to-stone-600"
                )}>
                  {comment.is_ai_response ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    comment.created_by?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-800">
                      {comment.is_ai_response 
                        ? 'Book Compass' 
                        : isAuthor 
                        ? t('post.you')
                        : comment.created_by?.split('@')[0] || t('post.anon')}
                    </span>
                    {comment.is_ai_response && (
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
                        {t('comment.aiLabel')}
                      </span>
                    )}
                    {!comment.is_ai_response && isUserPremium && (
                      <Crown className="w-3 h-3 text-amber-600" />
                    )}
                    <span className="text-xs text-stone-500">
                      {formatDistanceToNow(new Date(comment.created_date), { 
                        addSuffix: true, 
                        locale: dateLocale 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className="flex items-center gap-1 mt-2 text-stone-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">{comment.likes_count || 0}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-stone-500 text-sm py-4">
          {t('comment.empty')}
        </p>
      )}
    </div>
  );
}