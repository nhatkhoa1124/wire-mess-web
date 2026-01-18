import * as signalR from '@microsoft/signalr';

const HUB_URL = 'https://localhost:7096/chatHub';

class ChatHubService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
  }

  /**
   * Get access token from localStorage
   * @returns {string|null} JWT token
   */
  getAccessToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Connect to SignalR hub
   * @param {string} [accessToken] - JWT token (optional, will read from localStorage if not provided)
   */
  async connect(accessToken) {
    if (this.isConnected) {
      console.log('Already connected to ChatHub');
      return;
    }

    // Get token from parameter or localStorage
    const token = accessToken || this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available. Please log in first.');
    }

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupConnectionHandlers();
      this.setupHubHandlers();

      await this.connection.start();
      this.isConnected = true;
      console.log('Connected to ChatHub successfully');
    } catch (error) {
      console.error('Error connecting to ChatHub:', error);
      this.isConnected = false;
      throw error;
    }
  }

  setupConnectionHandlers() {
    this.connection.onclose((error) => {
      this.isConnected = false;
      console.log('Connection closed', error);
      this.notifyHandlers('connectionClosed', { error });
    });

    this.connection.onreconnecting((error) => {
      this.isConnected = false;
      console.log('Reconnecting...', error);
      this.notifyHandlers('reconnecting', { error });
    });

    this.connection.onreconnected((connectionId) => {
      this.isConnected = true;
      console.log('Reconnected:', connectionId);
      this.notifyHandlers('reconnected', { connectionId });
    });
  }

  setupHubHandlers() {
    // Event names must match exactly what useChat.js subscribes to
    this.connection.on('ReceiveMessage', (message) => {
      console.log('Received message:', message);
      this.notifyHandlers('ReceiveMessage', message);
    });

    this.connection.on('MessageUpdated', (message) => {
      console.log('Message updated:', message);
      this.notifyHandlers('MessageUpdated', message);
    });

    this.connection.on('MessageDeleted', (data) => {
      console.log('Message deleted:', data);
      this.notifyHandlers('MessageDeleted', data);
    });

    this.connection.on('UserJoinedConversation', (data) => {
      console.log('User joined:', data);
      this.notifyHandlers('UserJoined', data);
    });

    this.connection.on('UserLeftConversation', (data) => {
      console.log('User left:', data);
      this.notifyHandlers('UserLeft', data);
    });

    this.connection.on('Error', (errorMessage) => {
      console.error('Hub error:', errorMessage);
      this.notifyHandlers('Error', { message: errorMessage });
    });
  }

  async joinConversation(conversationId) {
    if (!this.isConnected) {
      throw new Error('Not connected to ChatHub');
    }
    await this.connection.invoke('JoinConversation', conversationId.toString());
    console.log(`Joined conversation: ${conversationId}`);
  }

  async leaveConversation(conversationId) {
    if (!this.isConnected) {
      throw new Error('Not connected to ChatHub');
    }
    await this.connection.invoke('LeaveConversation', conversationId.toString());
    console.log(`Left conversation: ${conversationId}`);
  }

  /**
   * Send a message to a conversation
   * @param {number|string} conversationId - Conversation ID
   * @param {string} content - Message content
   */
  async sendMessage(conversationId, content) {
    if (!this.isConnected) {
      throw new Error('Not connected to ChatHub');
    }
    // Backend expects MessageCreateDto: { conversationId: int, content: string }
    const messageData = {
      conversationId: parseInt(conversationId, 10),
      content: content,
    };
    await this.connection.invoke('SendMessage', messageData);
    console.log('Message sent via SignalR');
  }

  async updateMessage(messageId, newContent, conversationId) {
    if (!this.isConnected) {
      throw new Error('Not connected to ChatHub');
    }
    await this.connection.invoke('UpdateMessage', messageId, newContent, conversationId);
  }

  async deleteMessage(messageId, conversationId) {
    if (!this.isConnected) {
      throw new Error('Not connected to ChatHub');
    }
    await this.connection.invoke('DeleteMessage', messageId, conversationId);
  }

  on(event, handler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  notifyHandlers(event, data) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in handler for ${event}:`, error);
        }
      });
    }
  }

  async disconnect() {
    if (this.connection && this.isConnected) {
      await this.connection.stop();
      this.isConnected = false;
      console.log('Disconnected from ChatHub');
    }
  }

  get connected() {
    return this.isConnected;
  }
}

const chatHubService = new ChatHubService();
export default chatHubService;
