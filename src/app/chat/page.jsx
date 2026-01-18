"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/contexts/auth-context';
import useChat from '../../lib/hooks/useChat';
import Sidebar from '../../components/chat/sidebar';
import ConversationList from '../../components/chat/conversation-list';
import MessageThread from '../../components/chat/message-thread';
import UserProfileModal from '../../components/user/user-profile-modal';

export default function MessengerPage() {
  const { isAuthenticated, loading: authLoading, setUser, user } = useAuth();
  const router = useRouter();
  
  // Use the chat hook for SignalR + REST API integration
  const {
    isConnected,
    connectionError,
    conversations,
    activeMessages,
    activeConversation,
    activeConversationId,
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,
    loadConversations,
    joinConversation,
    leaveConversation,
    sendMessage,
    setActiveConversationId,
  } = useChat();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState('messages');

  // Redirect to login if not authenticated
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
        console.log('Full user data from API:', userData);
        
        // Update user in auth context with API data
        const formattedUser = {
          id: userData.id,
          name: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          avatar: userData.avatarUrl || '/default-avatar.svg',
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

  // Load conversations when connected to SignalR
  useEffect(() => {
    if (isConnected && isAuthenticated) {
      loadConversations();
    }
  }, [isConnected, isAuthenticated, loadConversations]);

  // Handle conversation selection
  const handleSelectConversation = useCallback(async (conversation) => {
    // Leave previous conversation if any
    if (activeConversationId && activeConversationId !== conversation.id) {
      await leaveConversation(activeConversationId);
    }
    
    setSelectedConversation(conversation);
    
    // Join the new conversation (this will also load messages)
    if (isConnected) {
      await joinConversation(conversation.id);
    }
  }, [activeConversationId, isConnected, joinConversation, leaveConversation]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (text) => {
    if (!selectedConversation || !text.trim()) return;
    
    try {
      await sendMessage(selectedConversation.id, text);
    } catch (error) {
      console.error('Failed to send message:', error);
      // You could add a toast notification here
    }
  }, [selectedConversation, sendMessage]);

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Handle navigation based on the view
    switch(view) {
      case 'feed':
        router.push('/feed');
        break;
      case 'messages':
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
        onSelectConversation={handleSelectConversation}
        onOpenProfile={() => setIsProfileOpen(true)}
        isLoading={isLoadingConversations}
      />
      
      {/* Connection Status Banner */}
      {connectionError && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
          Connection error: {connectionError}
        </div>
      )}
      
      {/* Message Thread */}
      {selectedConversation ? (
        <MessageThread
          conversation={selectedConversation}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          currentUserId={user?.id}
          isLoading={isLoadingMessages}
          isSending={isSendingMessage}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-black">
          {!isConnected ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Connecting to chat...</p>
            </div>
          ) : (
            <p className="text-gray-400">Select a conversation to start messaging</p>
          )}
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