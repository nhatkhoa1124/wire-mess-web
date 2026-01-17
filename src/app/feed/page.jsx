"use client";
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/contexts/auth-context';
import Sidebar from '../../components/chat/sidebar';
import UserProfileModal from '../../components/user/user-profile-modal';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      timestamp: '2 hours ago',
    },
    content: 'Just finished an amazing project! So excited to share it with everyone. 🎉',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    likes: 42,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      timestamp: '5 hours ago',
    },
    content: 'Beautiful sunset today! Nature never fails to amaze me. 🌅',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    likes: 156,
    comments: 23,
    shares: 12,
  },
  {
    id: 3,
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      timestamp: '1 day ago',
    },
    content: 'Coffee and code - the perfect combination for a productive morning! ☕💻',
    likes: 89,
    comments: 15,
    shares: 5,
  },
];

export default function MainFeed() {
  const { isAuthenticated, loading: authLoading, setUser, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch current user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated) return;
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

        if (!response.ok) throw new Error('Failed to fetch user information');

        const userData = await response.json();
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

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: {
          name: user?.name || 'User',
          avatar: user?.avatar || '/default-avatar.svg',
          timestamp: 'Just now',
        },
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleViewChange = (view) => {
    switch(view) {
      case 'feed':
        // Already on feed page
        break;
      case 'messages':
        router.push('/chat');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-full flex bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeView="feed"
        onViewChange={handleViewChange}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <div className="flex-1 bg-black overflow-y-auto">
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Feed</h1>
          <p className="text-gray-400">See what your friends are up to</p>
        </div>

        {/* Create Post */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <form onSubmit={handleCreatePost}>
            <div className="flex gap-3">
              <img
                src={user?.avatar || '/default-avatar.svg'}
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{post.author.name}</h3>
                    <p className="text-xs text-gray-400">{post.author.timestamp}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-white">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full object-cover max-h-96"
                />
              )}

              {/* Post Stats */}
              <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-400 border-t border-gray-800">
                <span>{post.likes} likes</span>
                <div className="flex gap-4">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-800">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
