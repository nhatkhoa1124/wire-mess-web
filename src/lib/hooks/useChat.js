'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import chatHub from '../services/chatHub';
import messageService from '../services/messageService';
import conversationService from '../services/conversationService';

/**
 * useChat Hook - Combines SignalR real-time messaging with REST API operations
 * Provides a unified interface for chat functionality
 */
export function useChat() {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Data state
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // { conversationId: [messages] }
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Loading states
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Track joined conversations to avoid duplicate joins
  const joinedConversations = useRef(new Set());
  const connectionAttempted = useRef(false);
  
  // Initialize SignalR connection
  useEffect(() => {
    const initializeConnection = async () => {
      // Check if token exists before attempting connection
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        console.log('No token available, skipping SignalR connection');
        return;
      }
      
      // Prevent multiple connection attempts
      if (connectionAttempted.current) {
        return;
      }
      connectionAttempted.current = true;
      
      try {
        // Set up event handlers before connecting
        chatHub.on('ReceiveMessage', handleReceiveMessage);
        chatHub.on('MessageUpdated', handleMessageUpdated);
        chatHub.on('MessageDeleted', handleMessageDeleted);
        chatHub.on('UserJoined', handleUserJoined);
        chatHub.on('UserLeft', handleUserLeft);
        chatHub.on('UserOnlineStatusChanged', handleUserOnlineStatusChanged);
        
        await chatHub.connect(token);
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        console.error('Failed to connect to chat hub:', error);
        setConnectionError(error.message);
        setIsConnected(false);
        connectionAttempted.current = false; // Allow retry
      }
    };
    
    initializeConnection();
    
    // Cleanup on unmount
    return () => {
      chatHub.off('ReceiveMessage', handleReceiveMessage);
      chatHub.off('MessageUpdated', handleMessageUpdated);
      chatHub.off('MessageDeleted', handleMessageDeleted);
      chatHub.off('UserJoined', handleUserJoined);
      chatHub.off('UserLeft', handleUserLeft);
      chatHub.off('UserOnlineStatusChanged', handleUserOnlineStatusChanged);
      chatHub.disconnect();
      joinedConversations.current.clear();
      connectionAttempted.current = false;
    };
  }, []);
  
  // SignalR event handlers
  const handleReceiveMessage = useCallback((messageData) => {
    console.log('handleReceiveMessage called with:', messageData);
    
    // Handle array of messages (backend may return array)
    const messages = Array.isArray(messageData) ? messageData : [messageData];
    
    messages.forEach((message) => {
      setMessages((prev) => {
        const conversationMessages = prev[message.conversationId] || [];
        // Avoid duplicates
        if (conversationMessages.some((m) => m.id === message.id)) {
          return prev;
        }
        // Append new message at the end (newest at bottom)
        return {
          ...prev,
          [message.conversationId]: [...conversationMessages, message],
        };
      });
      
      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? { ...conv, lastMessage: message, updatedAt: message.createdAt }
            : conv
        )
      );
    });
  }, []);
  
  const handleMessageUpdated = useCallback((message) => {
    setMessages((prev) => {
      const conversationMessages = prev[message.conversationId] || [];
      return {
        ...prev,
        [message.conversationId]: conversationMessages.map((m) =>
          m.id === message.id ? message : m
        ),
      };
    });
  }, []);
  
  const handleMessageDeleted = useCallback((messageId, conversationId) => {
    setMessages((prev) => {
      const conversationMessages = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: conversationMessages.filter((m) => m.id !== messageId),
      };
    });
  }, []);
  
  const handleUserJoined = useCallback((userId, username, conversationId) => {
    console.log(`User ${username} (${userId}) joined conversation ${conversationId}`);
    // You can add UI notification here
  }, []);
  
  const handleUserLeft = useCallback((userId, username, conversationId) => {
    console.log(`User ${username} (${userId}) left conversation ${conversationId}`);
    // You can add UI notification here
  }, []);
  
  const handleUserOnlineStatusChanged = useCallback((userId, isOnline, lastActive) => {
    // Update user online status in conversations
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        members: conv.members?.map((member) =>
          member.id === userId
            ? { ...member, isOnline, lastActive }
            : member
        ),
      }))
    );
  }, []);
  
  // Load user's conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const data = await conversationService.getMyConversations();
      setConversations(data);
      return data;
    } catch (error) {
      console.error('Failed to load conversations:', error);
      throw error;
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);
  
  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId, page = 1, pageSize = 50) => {
    setIsLoadingMessages(true);
    try {
      const data = await messageService.getMessagesByConversationId(
        conversationId,
        page,
        pageSize
      );
      
      // Backend returns messages in descending order (newest first)
      // Reverse to display oldest at top, newest at bottom
      const reversedData = [...data].reverse();
      
      if (page === 1) {
        // First page - replace messages (reversed so oldest is first)
        setMessages((prev) => ({
          ...prev,
          [conversationId]: reversedData,
        }));
      } else {
        // Subsequent pages - prepend older messages at the beginning
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...reversedData, ...(prev[conversationId] || [])],
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load messages:', error);
      throw error;
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);
  
  // Join a conversation (SignalR group)
  const joinConversation = useCallback(async (conversationId) => {
    if (!isConnected) {
      console.warn('Not connected to chat hub');
      return;
    }
    
    if (joinedConversations.current.has(conversationId)) {
      console.log(`Already joined conversation ${conversationId}`);
      return;
    }
    
    try {
      await chatHub.joinConversation(conversationId);
      joinedConversations.current.add(conversationId);
      setActiveConversationId(conversationId);
      
      // Load messages if not already loaded
      if (!messages[conversationId]) {
        await loadMessages(conversationId);
      }
    } catch (error) {
      console.error('Failed to join conversation:', error);
      throw error;
    }
  }, [isConnected, messages, loadMessages]);
  
  // Leave a conversation (SignalR group)
  const leaveConversation = useCallback(async (conversationId) => {
    if (!isConnected) return;
    
    try {
      await chatHub.leaveConversation(conversationId);
      joinedConversations.current.delete(conversationId);
      
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error('Failed to leave conversation:', error);
      throw error;
    }
  }, [isConnected, activeConversationId]);
  
  // Send a message (via SignalR for real-time)
  const sendMessage = useCallback(async (conversationId, content, attachment = null) => {
    setIsSendingMessage(true);
    try {
      if (attachment) {
        // Use REST API for file uploads
        const createdMessages = await messageService.createMessage({
          conversationId,
          content,
          attachment,
        });
        return createdMessages;
      } else {
        // Use SignalR for text-only messages (real-time)
        await chatHub.sendMessage(conversationId, content);
        // The message will come back via ReceiveMessage event
        return null;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsSendingMessage(false);
    }
  }, []);
  
  // Update a message
  const updateMessage = useCallback(async (messageId, conversationId, newContent) => {
    try {
      // Use SignalR for real-time update
      await chatHub.updateMessage(conversationId, messageId, newContent);
      // The update will come back via MessageUpdated event
    } catch (error) {
      console.error('Failed to update message:', error);
      throw error;
    }
  }, []);
  
  // Delete a message
  const deleteMessage = useCallback(async (messageId, conversationId) => {
    try {
      // Use SignalR for real-time delete
      await chatHub.deleteMessage(conversationId, messageId);
      // The deletion will be confirmed via MessageDeleted event
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }, []);
  
  // Create a new conversation
  const createConversation = useCallback(async (conversationData) => {
    try {
      const newConversation = await conversationService.createConversation(conversationData);
      setConversations((prev) => [newConversation, ...prev]);
      return newConversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }, []);
  
  // Get messages for active conversation
  const activeMessages = messages[activeConversationId] || [];
  
  // Get active conversation details
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  
  return {
    // Connection state
    isConnected,
    connectionError,
    
    // Data
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    activeMessages,
    
    // Loading states
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,
    
    // Actions
    loadConversations,
    loadMessages,
    joinConversation,
    leaveConversation,
    sendMessage,
    updateMessage,
    deleteMessage,
    createConversation,
    setActiveConversationId,
  };
}

export default useChat;
