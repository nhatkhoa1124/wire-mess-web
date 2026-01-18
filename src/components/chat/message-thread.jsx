"use client";
import { useEffect, useRef } from 'react';
import { Phone, Video, Info } from 'lucide-react';
import MessageInput from './message-input';

/**
 * Format timestamp for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

/**
 * MessageThread component - displays messages in a conversation
 * Supports both legacy format (sender: 'me'|'other') and new backend format (senderId)
 */
export default function MessageThread({ 
  conversation, 
  messages, 
  onSendMessage, 
  currentUserId,
  isLoading = false,
  isSending = false 
}) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  /**
   * Determine if a message was sent by the current user
   * Supports both legacy and new message formats
   */
  const isOwnMessage = (message) => {
    // Legacy format
    if (message.sender === 'me') return true;
    if (message.sender === 'other') return false;
    // New backend format
    return message.senderId === currentUserId;
  };
  
  /**
   * Get message content (supports both formats)
   */
  const getMessageContent = (message) => {
    return message.text || message.content || '';
  };
  
  /**
   * Get message timestamp (supports both formats)
   */
  const getMessageTimestamp = (message) => {
    if (message.timestamp) return message.timestamp;
    if (message.createdAt) return formatTimestamp(message.createdAt);
    return '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conversation.avatar || '/default-avatar.svg'}
              alt={conversation.name || 'Direct'}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation.name || 'Direct'}</h3>
            <p className="text-xs text-gray-400">{conversation.online ? 'Active now' : 'Offline'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = isOwnMessage(message);
            const content = getMessageContent(message);
            const timestamp = getMessageTimestamp(message);
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <img
                      src={conversation.avatar || '/default-avatar.svg'}
                      alt={conversation.name || 'Direct'}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    {/* Text content */}
                    {content && (
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{content}</p>
                      </div>
                    )}
                    
                    {/* Attachment */}
                    {message.attachment && (
                      <div className={`mt-1 ${content ? '' : ''}`}>
                        {message.attachment.type?.startsWith('image') ? (
                          <img
                            src={message.attachment.url}
                            alt="Attachment"
                            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                            onClick={() => window.open(message.attachment.url, '_blank')}
                          />
                        ) : (
                          <a
                            href={message.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm"
                          >
                            📎 {message.attachment.name || 'Download attachment'}
                          </a>
                        )}
                      </div>
                    )}
                    
                    <p className={`text-xs text-gray-500 mt-1 px-2 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} disabled={isSending} />
    </div>
  );
}