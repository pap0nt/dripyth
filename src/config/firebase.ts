import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
auth.useDeviceLanguage();

// Initialize Google provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with all necessary scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Discord auth helper
export const signInWithDiscord = async () => {
  const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI;
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  
  // Store the current URL to redirect back after auth
  sessionStorage.setItem('authRedirect', window.location.pathname);
  
  // Redirect to Discord OAuth with additional scope
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email%20guilds.members.read`;
  
  window.location.href = discordAuthUrl;
};

// Function to handle Discord callback
export const handleDiscordCallback = async (code: string): Promise<void> => {
  try {
    // Exchange code for user info using the environment URL
    const response = await fetch(`${import.meta.env.URL}/.netlify/functions/discord-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Discord');
    }

    const discordUser = await response.json();
    
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, discordUser.email, discordUser.id);
    } catch (error) {
      // If user doesn't exist, create a new account
      await createUserWithEmailAndPassword(auth, discordUser.email, discordUser.id);
      
      // Update the user profile with Discord info
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: discordUser.username,
          photoURL: discordUser.avatar,
        });

        // Store Discord roles in localStorage
        localStorage.setItem(`discord_roles_${auth.currentUser.uid}`, JSON.stringify(discordUser.roles));
      }
    }
    
    // Redirect back to the original page
    const redirect = sessionStorage.getItem('authRedirect') || '/';
    window.location.href = redirect;
  } catch (error) {
    console.error('Discord auth error:', error);
    throw error;
  }
};