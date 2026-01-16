"use client";
import { Bell, Lock, Globe, Moon, Volume2, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/chat/sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Lock,
          label: 'Privacy',
          description: 'Control who can see your information',
          action: 'chevron',
        },
        {
          icon: Shield,
          label: 'Security',
          description: 'Manage passwords and authentication',
          action: 'chevron',
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English (US)',
          action: 'chevron',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Get notified about messages and updates',
          action: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Volume2,
          label: 'Sound',
          description: 'Play sounds for messages',
          action: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Use dark theme',
          action: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          icon: Globe,
          label: 'Show Online Status',
          description: 'Let others see when you\'re active',
          action: 'toggle',
          value: onlineStatus,
          onChange: setOnlineStatus,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'Get help with Messenger',
          action: 'chevron',
        },
        {
          icon: Shield,
          label: 'Terms & Privacy',
          description: 'Review our policies',
          action: 'chevron',
        },
      ],
    },
  ];

  const handleViewChange = (view) => {
    switch(view) {
      case 'feed':
        router.push('/feed');
        break;
      case 'messages':
        router.push('/chat');
        break;
      case 'settings':
        // Already on settings page
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeView="settings"
        onViewChange={handleViewChange}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <div className="flex-1 bg-black overflow-y-auto">
      <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg">John Doe</h3>
              <p className="text-gray-400 text-sm">john.doe@example.com</p>
            </div>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-800">
                <h2 className="font-semibold text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIdx}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="bg-gray-800 p-2.5 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      {item.action === 'toggle' && (
                        <button
                          onClick={() => item.onChange(!item.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            item.value ? 'bg-gray-700' : 'bg-gray-800'
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></div>
                        </button>
                      )}
                      {item.action === 'chevron' && (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button className="w-full bg-red-900/30 border border-red-800/50 text-red-400 rounded-xl px-6 py-4 font-semibold hover:bg-red-900/50 transition-all flex items-center justify-center gap-3">
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>

        {/* App Version */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Messenger v1.0.0</p>
          <p className="mt-1">&copy; 2026 All rights reserved</p>
        </div>
      </div>
      </div>
    </div>
  );
}
