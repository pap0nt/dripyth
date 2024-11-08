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
  
  console.log('Starting Discord auth flow');
  console.log('Redirect URI:', redirectUri);
  
  // Store the current URL to redirect back after auth
  sessionStorage.setItem('authRedirect', window.location.pathname);
  
  // Redirect to Discord OAuth with additional scope
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email%20guilds.members.read`;
  
  window.location.href = discordAuthUrl;
};

// Function to handle Discord callback
export const handleDiscordCallback = async (code: string): Promise<void> => {
  try {
    console.log('Processing Discord callback');
    
    // Get base URL from environment
    const baseUrl = import.meta.env.URL || window.location.origin;
    console.log('Using base URL:', baseUrl);
    
    // Exchange code for user info using the environment URL
    const response = await fetch(`${baseUrl}/.netlify/functions/discord-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    console.log('Discord auth response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord auth response error:', errorText);
      throw new Error('Failed to authenticate with Discord');
    }

    const discordUser = await response.json();
    
    console.log('Discord user data received:', { 
      id: discordUser.id,
      username: discordUser.username,
      roles: discordUser.roles?.length || 0
    });
    
    try {
      // Try to sign in first
      console.log('Attempting to sign in existing user');
      await signInWithEmailAndPassword(auth, discordUser.email, discordUser.id);
      console.log('Existing user signed in');
    } catch (error) {
      // If user doesn't exist, create a new account
      console.log('Creating new user account');
      await createUserWithEmailAndPassword(auth, discordUser.email, discordUser.id);
      
      // Update the user profile with Discord info
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: discordUser.username,
          photoURL: discordUser.avatar,
        });
        console.log('User profile updated with Discord info');
      }
    }

    // Store Discord roles and ID in localStorage
    if (discordUser.id && discordUser.roles) {
      console.log('Storing Discord roles for ID:', discordUser.id);
      localStorage.setItem(`discord_roles_${discordUser.id}`, JSON.stringify(discordUser.roles));
      localStorage.setItem('current_discord_id', discordUser.id);
      
      // Store the mapping between Firebase UID and Discord ID
      if (auth.currentUser) {
        localStorage.setItem(`firebase_discord_map_${auth.currentUser.uid}`, discordUser.id);
      }
    }
    
    // Redirect back to the original page
    const redirect = sessionStorage.getItem('authRedirect') || '/';
    console.log('Redirecting to:', redirect);
    window.location.href = redirect;
  } catch (error) {
    console.error('Discord auth error:', error);
    throw error;
  }
};