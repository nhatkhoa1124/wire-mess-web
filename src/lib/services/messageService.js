import api from '../api';

const API_BASE = '/api/messages';

/**
 * Message Service - REST API client for message CRUD operations
 * Backend: WireMess MessageController
 */

/**
 * Create a new message (supports text and/or attachment)
 * @param {Object} messageData - Message data
 * @param {number} messageData.conversationId - Conversation ID
 * @param {string} [messageData.content] - Message text content (optional if attachment provided)
 * @param {File} [messageData.attachment] - File attachment (optional if content provided)
 * @returns {Promise<Array>} Created messages (can be multiple if attachment creates separate message)
 */
export const createMessage = async (messageData) => {
  const formData = new FormData();
  formData.append('conversationId', messageData.conversationId);
  
  if (messageData.content) {
    formData.append('content', messageData.content);
  }
  
  if (messageData.attachment) {
    formData.append('attachment', messageData.attachment);
  }
  
  const response = await api.post(API_BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Get messages by conversation ID with pagination
 * @param {number} conversationId - Conversation ID
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [pageSize=50] - Number of messages per page
 * @returns {Promise<Array>} Array of MessageDto objects
 */
export const getMessagesByConversationId = async (conversationId, page = 1, pageSize = 50) => {
  const response = await api.get(`${API_BASE}/conversation/${conversationId}`, {
    params: { page, pageSize },
  });
  
  return response.data;
};

/**
 * Get a single message by ID
 * @param {number} messageId - Message ID
 * @returns {Promise<Object>} MessageDto object
 */
export const getMessageById = async (messageId) => {
  const response = await api.get(`${API_BASE}/${messageId}`);
  return response.data;
};

/**
 * Update a message by ID
 * @param {number} messageId - Message ID
 * @param {Object} updateData - Update data
 * @param {string} updateData.content - New message content
 * @returns {Promise<Object>} Updated MessageDto object
 */
export const updateMessage = async (messageId, updateData) => {
  const response = await api.patch(`${API_BASE}/${messageId}`, updateData);
  return response.data;
};

/**
 * Delete a message by ID
 * @param {number} messageId - Message ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`${API_BASE}/${messageId}`);
  return response.status === 200;
};

const messageService = {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
  updateMessage,
  deleteMessage,
};

export default messageService;
