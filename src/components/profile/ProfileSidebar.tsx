import React, { useEffect, useState } from 'react';
import { Wallet, LogOut, Palette, Package } from 'lucide-react';
import { User } from 'firebase/auth';

interface ProfileSidebarProps {
  activeTab: 'designs' | 'orders';
  setActiveTab: (tab: 'designs' | 'orders') => void;
  onLogout: () => void;
  user: User | null;
}

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

const ROLE_COLORS: { [key: string]: string } = {
  'High Priest': 'bg-purple-500',
  'Priest': 'bg-blue-500',
  'Low Priest': 'bg-green-500',
  'Chiron': 'bg-yellow-500',
  'default': 'bg-gray-500'
};

export function ProfileSidebar({ activeTab, setActiveTab, onLogout, user }: ProfileSidebarProps) {
  const [discordRoles, setDiscordRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const storedRoles = localStorage.getItem(`discord_roles_${user.uid}`);
      if (storedRoles) {
        setDiscordRoles(JSON.parse(storedRoles));
      }
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-[#0ff4c6] rounded-full p-1">
          <div className="w-full h-full bg-black rounded-full overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-white bg-primary/20">
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <h2 className="mt-4 text-xl font-michroma">
          {user?.displayName || user?.email?.split('@')[0] || 'Anonymous User'}
        </h2>
        {user?.email && (
          <p className="mt-1 text-sm text-gray-400">{user.email}</p>
        )}
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Wallet className="w-4 h-4" />
          <span>0x1234...5678</span>
        </div>

        {/* Discord Roles */}
        {discordRoles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {discordRoles.map((roleId, index) => (
              <span
                key={roleId}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  index === 0 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}
              >
                {roleId}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => setActiveTab('designs')}
          className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 ${
            activeTab === 'designs' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Palette className="w-5 h-5" />
          Designs
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 ${
            activeTab === 'orders' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Package className="w-5 h-5" />
          Orders
        </button>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 text-red-500 hover:bg-white/5"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}