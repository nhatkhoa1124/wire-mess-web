"use client";
import { Search, Edit, MoreHorizontal } from 'lucide-react';

export default function ConversationList({ conversations, selectedConversation, onSelectConversation }) {
  return (
    <div className="w-full md:w-96 border-r border-gray-800 flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Chats</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Edit className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Messenger"
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-gray-800 transition-colors ${
              selectedConversation.id === conversation.id ? 'bg-gray-800' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              {conversation.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                {conversation.unread > 0 && (
                  <span className="ml-2 bg-gray-700 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}