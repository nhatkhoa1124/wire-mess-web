"use client";
import { useState } from 'react';
import ConversationList from '../../components/chat/conversation-list';
import MessageThread from '../../components/chat/message-thread';

const mockConversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2m',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastMessage: 'Did you see the game last night?',
    timestamp: '1h',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastMessage: 'Thanks for your help! 😊',
    timestamp: '3h',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'See you tomorrow!',
    timestamp: '5h',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    lastMessage: 'Can you send me that file?',
    timestamp: '1d',
    unread: 1,
    online: false,
  },
];

const mockMessages = {
  1: [
    { id: 1, sender: 'other', text: 'Hey! How are you doing?', timestamp: '2:30 PM' },
    { id: 2, sender: 'me', text: "I'm doing great! How about you?", timestamp: '2:32 PM' },
    { id: 3, sender: 'other', text: "Pretty good! Just finished a big project at work.", timestamp: '2:33 PM' },
    { id: 4, sender: 'me', text: 'That sounds awesome! Congrats! 🎉', timestamp: '2:35 PM' },
    { id: 5, sender: 'other', text: 'Thanks! Want to grab coffee this weekend?', timestamp: '2:36 PM' },
  ],
  2: [
    { id: 1, sender: 'other', text: 'Did you see the game last night?', timestamp: '1:15 PM' },
    { id: 2, sender: 'me', text: 'Yes! It was incredible!', timestamp: '1:20 PM' },
  ],
  3: [
    { id: 1, sender: 'me', text: 'No problem! Happy to help!', timestamp: '11:30 AM' },
    { id: 2, sender: 'other', text: 'Thanks for your help! 😊', timestamp: '11:45 AM' },
  ],
  4: [
    { id: 1, sender: 'other', text: 'See you tomorrow!', timestamp: '9:00 AM' },
  ],
  5: [
    { id: 1, sender: 'other', text: 'Can you send me that file?', timestamp: 'Yesterday' },
  ],
};

export default function MessengerPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages[selectedConversation.id].length + 1,
      sender: 'me',
      text,
      timestamp: 'Just now',
    };

    setMessages({
      ...messages,
      [selectedConversation.id]: [...messages[selectedConversation.id], newMessage],
    });
  };

  return (
    <div className="h-screen w-full flex bg-gray-900">
      <ConversationList
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <MessageThread
        conversation={selectedConversation}
        messages={messages[selectedConversation.id] || []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}