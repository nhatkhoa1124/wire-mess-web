"use client";
import { MessageCircle, Users, Shield, Zap, Globe, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="h-full w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-y-auto">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-2 rounded-full">
                <MessageCircle className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-xl font-bold text-white">Messenger</span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300">Welcome, {user?.name || 'User'}</span>
                  <button
                    onClick={() => router.push('/chat')}
                    className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all"
                  >
                    Go to Chat
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => router.push('/auth/register')}
                    className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-6 rounded-full">
              <MessageCircle className="w-20 h-20 text-gray-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect with Everyone
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Simple, reliable messaging for staying in touch with friends and family. 
            Chat, share, and connect instantly from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <button
                onClick={() => router.push('/chat')}
                className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg"
              >
                Go to Chat
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all border border-gray-700"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Messenger?</h2>
          <p className="text-gray-400 text-lg">Everything you need to stay connected</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <Zap className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Instant Messaging</h3>
            <p className="text-gray-400">
              Send messages instantly to anyone, anywhere. Real-time delivery ensures your messages arrive in seconds.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Group Chats</h3>
            <p className="text-gray-400">
              Create groups with friends, family, or colleagues. Share moments and stay connected with everyone.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <Shield className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
            <p className="text-gray-400">
              Your conversations are protected with end-to-end encryption. Your privacy is our priority.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <Globe className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Cross-Platform</h3>
            <p className="text-gray-400">
              Access your messages from any device. Seamlessly sync across web, mobile, and desktop.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <MessageCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Rich Media</h3>
            <p className="text-gray-400">
              Share photos, videos, documents, and more. Express yourself with emojis and reactions.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full w-fit mb-4">
              <Lock className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Always Available</h3>
            <p className="text-gray-400">
              99.9% uptime guarantee. Your messages are always accessible when you need them.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join millions of people who use Messenger to stay connected with the people that matter most.
          </p>
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/chat')}
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg"
            >
              Go to Your Messages
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth/register')}
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg"
            >
              Create Free Account
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2026 Messenger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
