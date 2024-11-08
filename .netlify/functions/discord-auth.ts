import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  console.log('Discord auth function called with method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const GUILD_ID = '799799120478863440';
    const { code } = JSON.parse(event.body || '{}');

    console.log('Processing auth code for Discord');

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Authorization code is required' }),
      };
    }

    console.log('Exchanging code for access token...');
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.VITE_DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.VITE_DISCORD_REDIRECT_URI,
        scope: 'identify email guilds.members.read',
      }),
    });

    console.log('Token response status:', tokenResponse.status);
    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Failed to get tokens:', tokens);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to exchange code for tokens' }),
      };
    }

    console.log('Successfully obtained access token');

    // Get user's roles in the specific server
    console.log('Fetching user guild member data...');
    const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/@me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    console.log('Member response status:', memberResponse.status);
    let roles = [];
    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
      console.log('Member roles fetched:', memberData.roles?.length || 0, 'roles found');
      roles = memberData.roles;
    } else {
      console.error('Failed to fetch member roles:', await memberResponse.text());
    }

    // Get Discord user info
    console.log('Fetching Discord user info...');
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    console.log('User info fetched:', userResponse.status);
    const discordUser = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Failed to fetch Discord user info:', discordUser);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to fetch Discord user info' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        id: discordUser.id,
        username: discordUser.username,
        email: discordUser.email,
        avatar: discordUser.avatar ? 
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : 
          null,
        roles: roles,
      }),
    };
  } catch (error) {
    console.error('Discord auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
