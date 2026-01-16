"use client";
import { MessageCircle, Home, Settings, User } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, onOpenProfile }) {
  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleClick = (id) => {
    if (id === 'profile') {
      onOpenProfile();
    } else {
      onViewChange(id);
    }
  };

  return (
    <div className="w-20 bg-black border-r border-gray-800 flex flex-col items-center py-6 gap-4">
      {/* Logo */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-full">
          <MessageCircle className="w-6 h-6 text-gray-300" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`relative p-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {item.label}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full -ml-3"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
