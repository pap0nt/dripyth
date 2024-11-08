import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleDiscordCallback } from '../config/firebase';

export function DiscordCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code provided');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        await handleDiscordCallback(code);
      } catch (error) {
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="text-white mb-4">Completing authentication...</div>
            <div className="w-8 h-8 border-4 border-t-primary border-r-primary/30 border-b-primary/30 border-l-primary/30 rounded-full animate-spin mx-auto" />
          </>
        )}
      </div>
    </div>
  );
}