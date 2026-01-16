"use client";
import { useState } from 'react';
import { X, Camera, Edit2, Save } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState(user?.status || 'Available');

  if (!user) return null;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: name,
          email,
          bio,
          status,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local user data
        const formattedUser = {
          ...user,
          name: updatedUser.username || name,
          email: updatedUser.email || email,
          bio: updatedUser.bio || bio,
          status: status,
        };
        localStorage.setItem('user', JSON.stringify(formattedUser));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setBio(user.bio || '');
    setStatus(user.status || 'Available');
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
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
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
                />
              ) : (
                <p className="text-gray-400">{user.email}</p>
              )}
            </div>

            {/* Phone Number */}
            {user.phoneNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <p className="text-gray-400">{user.phoneNumber}</p>
              </div>
            )}

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

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-400">{user.bio || 'No bio yet.'}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
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
