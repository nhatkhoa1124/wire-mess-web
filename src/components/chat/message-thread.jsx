"use client";
import { Phone, Video, Info } from 'lucide-react';
import MessageInput from './message-input';

export default function MessageThread({ conversation, messages, onSendMessage }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation.name}</h3>
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-md ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
              {message.sender === 'other' && (
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 px-2 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}