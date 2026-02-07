import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ChatWindow({ conversation, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const allMessages = await base44.entities.DirectMessage.filter(
        { conversation_id: conversation.conversation_id },
        'created_date'
      );
      setMessages(allMessages);

      // Mark received messages as read
      const unreadMessages = allMessages.filter(
        msg => msg.recipient_email === currentUser.email && !msg.is_read
      );
      await Promise.all(
        unreadMessages.map(msg => base44.entities.DirectMessage.update(msg.id, { is_read: true }))
      );
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await base44.entities.DirectMessage.create({
        recipient_email: conversation.other_user,
        content: newMessage.trim(),
        conversation_id: conversation.conversation_id
      });

      // Create notification for recipient
      await base44.entities.Notification.create({
        type: 'message',
        title: 'Neue Nachricht',
        message: `${currentUser.full_name}: ${newMessage.trim().substring(0, 50)}...`,
        link: '/Account?tab=messages',
        from_user_email: currentUser.email,
        created_by: conversation.other_user
      });

      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex items-center gap-3">
        <button
          onClick={onBack}
          className="lg:hidden text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-sm font-medium">
          {conversation.other_user.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-stone-800">{conversation.other_user.split('@')[0]}</p>
          <p className="text-xs text-stone-500">{conversation.other_user}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isOwnMessage = msg.created_by === currentUser.email;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p className={`text-xs text-stone-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(msg.created_date), { addSuffix: true, locale: de })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-stone-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nachricht schreiben..."
            className="flex-1 px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}