"use client";
import { useState } from 'react';
import { Plus, Image, Smile, Send } from 'lucide-react';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-800 bg-gray-900">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
        >
          <Image className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Aa"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-75"
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <button
          type="submit"
          className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 disabled:opacity-50"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}