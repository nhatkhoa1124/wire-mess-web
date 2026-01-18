import api from '../api';

const API_BASE = '/api/conversations';

/**
 * Conversation Service - REST API client for conversation CRUD operations
 * Backend: WireMess ConversationController
 */

/**
 * Create a new conversation
 * @param {Object} conversationData - Conversation data
 * @param {string} [conversationData.name] - Conversation name (optional for direct messages)
 * @param {boolean} [conversationData.isGroup] - Whether it's a group conversation
 * @param {Array<number>} conversationData.memberIds - Array of user IDs to add
 * @returns {Promise<Object>} Created ConversationDto
 */
export const createConversation = async (conversationData) => {
  const response = await api.post(API_BASE, conversationData);
  return response.data;
};

/**
 * Get all conversations (admin)
 * @returns {Promise<Array>} Array of ConversationDto objects
 */
export const getAllConversations = async () => {
  const response = await api.get(API_BASE);
  return response.data;
};

/**
 * Get current user's conversations
 * @returns {Promise<Array>} Array of ConversationDto objects for the current user
 */
export const getMyConversations = async () => {
  const response = await api.get(`${API_BASE}/me`);
  return response.data;
};

/**
 * Get a conversation by ID
 * @param {number} conversationId - Conversation ID
 * @returns {Promise<Object>} ConversationDto object
 */
export const getConversationById = async (conversationId) => {
  const response = await api.get(`${API_BASE}/${conversationId}`);
  return response.data;
};

/**
 * Update a conversation by ID (group profile)
 * @param {number} conversationId - Conversation ID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.name] - New conversation name
 * @returns {Promise<Object>} Updated ConversationDto object
 */
export const updateConversation = async (conversationId, updateData) => {
  const response = await api.put(`${API_BASE}/${conversationId}`, updateData);
  return response.data;
};

/**
 * Delete a conversation by ID
 * @param {number} conversationId - Conversation ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`${API_BASE}/${conversationId}`);
  return response.status === 204;
};

/**
 * Add a member to a conversation
 * @param {number} conversationId - Conversation ID
 * @param {number} userId - User ID to add
 * @returns {Promise<boolean>} Success status
 */
export const addMemberToConversation = async (conversationId, userId) => {
  const response = await api.post(`${API_BASE}/${conversationId}/members/${userId}`);
  return response.status === 200;
};

/**
 * Remove a member from a conversation
 * @param {number} conversationId - Conversation ID
 * @param {number} userId - User ID to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeMemberFromConversation = async (conversationId, userId) => {
  const response = await api.delete(`${API_BASE}/${conversationId}/members/${userId}`);
  return response.status === 204;
};

const conversationService = {
  createConversation,
  getAllConversations,
  getMyConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
  addMemberToConversation,
  removeMemberFromConversation,
};

export default conversationService;
