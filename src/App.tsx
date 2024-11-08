import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Designer } from './pages/Designer';
import { Profile } from './components/Profile';
import { Chart } from './pages/Chart';
import { Checkout } from './pages/Checkout';
import { DiscordCallback } from './pages/DiscordCallback';
import { AuthGuard } from './components/auth/AuthGuard';
import { auth } from './config/firebase';
import { useAuthStore } from './store/authStore';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Designer />} />
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
        <Route path="/chart" element={<Chart />} />
        <Route path="/checkout" element={
          <AuthGuard>
            <Checkout />
          </AuthGuard>
        } />
        <Route path="/auth/discord/callback" element={<DiscordCallback />} />
      </Routes>
    </Router>
  );
}