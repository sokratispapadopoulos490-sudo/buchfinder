import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, BookOpen, User, Crown, Mail, AlertTriangle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

export default function PostCard({ post, onLike, onComment, isLiked, currentUser, onReport, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const isAuthor = currentUser?.email === post.created_by;
  const isPremium = currentUser?.is_premium || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';
  
  const handleSendMessage = () => {
    navigate('/Account?tab=messages&user=' + post.created_by);
  };

  const categoryColors = {
    allgemein: "bg-stone-100 text-stone-700",
    buchempfehlung: "bg-amber-100 text-amber-700",
    diskussion: "bg-blue-100 text-blue-700",
    frage: "bg-purple-100 text-purple-700"
  };

  const categoryLabels = {
    allgemein: "Allgemein",
    buchempfehlung: "Buchempfehlung",
    diskussion: "Diskussion",
    frage: "Frage"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-stone-200 p-6 hover:border-stone-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => !isAuthor && navigate(`/PublicProfile?user=${post.created_by}`)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium hover:scale-105 transition-transform"
          >
            {post.created_by?.charAt(0).toUpperCase() || 'U'}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => !isAuthor && navigate(`/PublicProfile?user=${post.created_by}`)}
                className="font-medium text-stone-800 hover:text-amber-600 transition-colors"
              >
                {isAuthor ? 'Du' : post.created_by?.split('@')[0] || 'Anonym'}
              </button>
              {isPremium && <Crown className="w-3 h-3 text-amber-600" />}
            </div>
            <span className="text-xs text-stone-500">
              {formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: de })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", categoryColors[post.category])}>
            {categoryLabels[post.category]}
          </span>
          {(isAdmin || !isAuthor) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <span className="text-stone-500">⋮</span>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                  {!isAuthor && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onReport(post);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Melden
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(post.id);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Löschen
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-medium text-stone-800 mb-2">{post.title}</h3>
      <p className="text-stone-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Book Reference */}
      {post.book_title && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800 font-medium">{post.book_title}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={cn(
              "flex items-center gap-2 transition-colors",
              isLiked ? "text-red-500" : "text-stone-500 hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            <span className="text-sm font-medium">{post.likes_count || 0}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </button>
        </div>
        
        {!isAuthor && (
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Nachricht</span>
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <Button
            onClick={() => onComment(post)}
            size="sm"
            variant="outline"
            className="w-full"
          >
            Kommentar hinzufügen
          </Button>
        </div>
      )}
    </motion.div>
  );
}