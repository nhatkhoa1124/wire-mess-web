"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/contexts/auth-context';
import Sidebar from '../../components/chat/sidebar';
import ConversationList from '../../components/chat/conversation-list';
import MessageThread from '../../components/chat/message-thread';
import UserProfileModal from '../../components/user/user-profile-modal';
import { fetchAPI } from '../../lib/api';

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
  const { isAuthenticated, loading: authLoading, setUser, user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState('messages');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch current user information in background (non-blocking)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated) return;
      
      // Skip if user already exists (from cache or previous fetch)
      if (user && user.id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }

        const userData = await response.json();
        
        // Update user in auth context with API data
        const formattedUser = {
          id: userData.id,
          name: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          avatar: userData.avatarUrl,
          status: userData.isOnline ? 'Available' : 'Offline',
          lastActive: userData.lastActive,
        };

        setUser(formattedUser);
        localStorage.setItem('user', JSON.stringify(formattedUser));
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, setUser, user]);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/chat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated]);

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

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Handle navigation based on the view
    switch(view) {
      case 'feed':
        router.push('/feed');
        break;
      case 'messages':
        // Already on messages page, just update state
        setActiveView('messages');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  // Only block on auth check, allow progressive rendering for data
  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-full flex bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onOpenProfile={() => setIsProfileOpen(true)}
        isLoading={conversationsLoading}
      />
      
      {/* Message Thread */}
      {selectedConversation ? (
        <MessageThread
          conversation={selectedConversation}
          messages={messages[selectedConversation.id] || []}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-black">
          <p className="text-gray-400">Select a conversation to start messaging</p>
        </div>
      )}
      
      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}