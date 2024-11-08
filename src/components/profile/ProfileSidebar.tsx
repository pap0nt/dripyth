import React, { useEffect, useState } from 'react';
import { Wallet, LogOut, Palette, Package } from 'lucide-react';
import { User } from 'firebase/auth';

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

function getColorFromDiscordColor(color: number): string {
  if (color === 0) return 'bg-gray-800 text-gray-300 border-gray-700';
  
  // Convert Discord color (decimal) to hex
  const hex = color.toString(16).padStart(6, '0');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness to determine text color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? 'text-black' : 'text-white';
  
  return `bg-[#${hex}] ${textColor} border-[#${hex}]`;
}

interface ProfileSidebarProps {
  activeTab: 'designs' | 'orders';
  setActiveTab: (tab: 'designs' | 'orders') => void;
  onLogout: () => void;
  user: User | null;
}

export function ProfileSidebar({ activeTab, setActiveTab, onLogout, user }: ProfileSidebarProps) {
  const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>([]);

  useEffect(() => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    console.log('Checking roles for Firebase UID:', user.uid);
    
    // Get Discord ID from Firebase UID mapping
    const discordId = localStorage.getItem(`firebase_discord_map_${user.uid}`);
    console.log('Found Discord ID from Firebase mapping:', discordId);
    
    if (discordId) {
      console.log('Checking for Discord roles for Discord ID:', discordId);
      const storedRoles = localStorage.getItem(`discord_roles_${discordId}`);
      if (storedRoles) {
        try {
          const roles = JSON.parse(storedRoles);
          console.log('Found stored Discord roles:', roles);
          setDiscordRoles(roles);
        } catch (error) {
          console.error('Error parsing stored roles:', error);
        }
      } else {
        console.log('No Discord roles found in localStorage');
      }
    } else {
      console.log('No Discord ID mapping found for Firebase UID');
    }
  }, [user]); // Re-run when user changes

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

        {discordRoles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {discordRoles.map((role) => {
              console.log('Rendering role:', role);
              return (
                <span
                  key={role.id}
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getColorFromDiscordColor(role.color)}`}
                >
                  {role.name}
                </span>
              );
            })}
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