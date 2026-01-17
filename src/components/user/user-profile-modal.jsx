"use client";
import { useState } from 'react';
import { X, Camera, Edit2, Save } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/default-avatar.svg');
  const [status, setStatus] = useState(user?.status || 'Available');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    // Validate email format if changed
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Invalid email format');
        setLoading(false);
        return;
      }
    }

    // Validate username if changed
    if (name && name.trim() !== '' && name.trim().length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Build FormData for multipart/form-data request
      const formData = new FormData();
      
      if (name && name.trim() !== user.name) {
        formData.append('username', name.trim());
      }
      if (email && email.trim() !== user.email) {
        formData.append('email', email.trim());
      }
      if (phoneNumber && phoneNumber.trim() !== (user.phoneNumber || '')) {
        formData.append('phoneNumber', phoneNumber.trim());
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch('/api/users/me/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in auth context with API response
      const updatedUser = {
        ...user,
        name: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatar: data.avatarUrl || '/default-avatar.svg',
        status: status,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update local state
      setName(data.username);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber || '');
      setAvatarPreview(data.avatarUrl || '/default-avatar.svg');
      setAvatarFile(null);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber || '');
    setAvatarFile(null);
    setAvatarPreview(user.avatar || '/default-avatar.svg');
    setStatus(user.status || 'Available');
    setError('');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Profile Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900">
          <h2 className="text-xl font-bold text-white">Your Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={avatarPreview || '/default-avatar.svg'}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
              />
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {isEditing && avatarFile && (
              <p className="mt-2 text-sm text-gray-400">Selected: {avatarFile.name}</p>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-white text-lg">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-gray-400">{user.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-400">{user.phoneNumber || 'Not set'}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              {isEditing ? (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Away">Away</option>
                  <option value="Do not disturb">Do not disturb</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'Available' ? 'bg-green-500' :
                    status === 'Busy' ? 'bg-yellow-500' :
                    status === 'Away' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}></div>
                  <p className="text-gray-400">{user.status || 'Available'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-800">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Active</span>
                <span className="text-white">
                  {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID</span>
                <span className="text-white">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg font-semibold hover:bg-red-900/50 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
