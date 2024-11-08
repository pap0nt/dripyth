import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { code } = JSON.parse(event.body || '{}');
    const GUILD_ID = '799799120478863440';

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Authorization code is required' }),
      };
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID!,
        client_secret: process.env.VITE_DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.URL}/auth/discord/callback`,
        scope: 'identify email guilds.members.read',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const discordUser = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Discord user info');
    }

    // Get user's roles in the specific server
    const memberResponse = await fetch(`https://discord.com/api/v10/users/@me/guilds/${GUILD_ID}/member`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    let roles = [];
    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
      roles = memberData.roles || [];
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.URL,
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
        roles,
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