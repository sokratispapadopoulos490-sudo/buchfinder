import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ConversationList({ currentUser, onSelectConversation, selectedConversationId }) {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      const sent = await base44.entities.DirectMessage.filter({ created_by: currentUser.email });
      const received = await base44.entities.DirectMessage.filter({ recipient_email: currentUser.email });
      
      const allMessages = [...sent, ...received].sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );

      const conversationMap = new Map();
      
      allMessages.forEach(msg => {
        if (!conversationMap.has(msg.conversation_id)) {
          const otherUser = msg.created_by === currentUser.email 
            ? msg.recipient_email 
            : msg.created_by;
          
          conversationMap.set(msg.conversation_id, {
            conversation_id: msg.conversation_id,
            other_user: otherUser,
            last_message: msg.content,
            last_message_date: msg.created_date,
            unread: !msg.is_read && msg.recipient_email === currentUser.email
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-stone-200">
      <div className="p-4 border-b border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Konversationen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-stone-500 text-sm">Lädt...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">
              {searchQuery ? 'Keine Konversationen gefunden' : 'Noch keine Nachrichten'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredConversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full p-4 text-left hover:bg-stone-50 transition-colors ${
                  selectedConversationId === conv.conversation_id ? 'bg-amber-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {conv.other_user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate">
                        {conv.other_user.split('@')[0]}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{conv.last_message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <p className="text-xs text-stone-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(conv.last_message_date), { addSuffix: true, locale: de })}
                    </p>
                    {conv.unread && (
                      <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}