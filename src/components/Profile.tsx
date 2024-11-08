import React, { useState } from 'react';
import { Wallet, LogOut, Palette, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ProfileSidebar } from './profile/ProfileSidebar';
import { DesignGrid } from './profile/DesignGrid';
import { OrderList } from './profile/OrderList';
import { Footer } from './profile/Footer';
import { SavedDesign } from '../types/design';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase';

export function Profile() {
  const [activeTab, setActiveTab] = useState<'designs' | 'orders'>('designs');
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  React.useEffect(() => {
    const designs = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    setSavedDesigns(designs);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto flex-1 w-full">
        <div className="grid grid-cols-[300px,1fr] gap-8">
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            user={user}
          />

          {/* Main Content */}
          <div>
            {activeTab === 'designs' ? (
              <DesignGrid
                designs={savedDesigns}
                onDesignsChange={setSavedDesigns}
              />
            ) : (
              <OrderList />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}