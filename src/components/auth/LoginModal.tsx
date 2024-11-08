import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, signInWithDiscord } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Request permission to show popups
      const result = await signInWithPopup(auth, googleProvider).catch((error) => {
        if (error.code === 'auth/popup-blocked') {
          throw new Error('Please allow popups for this site to sign in with Google.');
        }
        throw error;
      });
      
      console.log('Google auth successful:', result.user);
      onClose();
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithDiscord();
    } catch (error: any) {
      console.error('Discord auth error:', error);
      setError(error.message || 'Failed to sign in with Discord. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#1a1a24] rounded-2xl w-full max-w-md p-6 shadow-[0_0_30px_rgba(109,40,217,0.3)] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-michroma text-white mb-6">Welcome Back</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-white text-black font-michroma tracking-wide flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-[#5865F2] text-white font-michroma tracking-wide flex items-center justify-center gap-3 hover:bg-[#4752C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://discord.com/assets/favicon.ico" alt="Discord" className="w-5 h-5" />
            {isLoading ? 'Connecting...' : 'Continue with Discord'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400 font-michroma">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}