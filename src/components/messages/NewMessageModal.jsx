import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function NewMessageModal({ currentUser, onClose, onMessageSent }) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (recipient) {
      const filtered = users.filter(u => 
        u.email.toLowerCase().includes(recipient.toLowerCase()) ||
        u.full_name.toLowerCase().includes(recipient.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [recipient, users]);

  const loadUsers = async () => {
    try {
      const allUsers = await base44.entities.User.list();
      setUsers(allUsers.filter(u => u.email !== currentUser.email));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSend = async () => {
    if (!recipient || !message.trim()) return;

    setSending(true);
    try {
      const conversationId = [currentUser.email, recipient].sort().join('_');
      
      await base44.entities.DirectMessage.create({
        recipient_email: recipient,
        content: message.trim(),
        conversation_id: conversationId
      });

      await base44.entities.Notification.create({
        type: 'message',
        title: 'Neue Nachricht',
        message: `${currentUser.full_name}: ${message.trim().substring(0, 50)}...`,
        link: '/Account?tab=messages',
        from_user_email: currentUser.email,
        created_by: recipient
      });

      onMessageSent();
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-xl font-light text-stone-800">Neue Nachricht</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              An
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Name oder E-Mail eingeben..."
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            
            {filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredUsers.slice(0, 5).map((user) => (
                  <button
                    key={user.email}
                    onClick={() => {
                      setRecipient(user.email);
                      setFilteredUsers([]);
                    }}
                    className="w-full p-3 text-left hover:bg-stone-50 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-sm flex-shrink-0">
                      {user.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm">{user.full_name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Nachricht
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deine Nachricht..."
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={5}
            />
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
            onClick={handleSend}
            disabled={!recipient || !message.trim() || sending}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Wird gesendet...' : 'Senden'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}