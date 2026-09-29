const { OAuth2Client } = require('google-auth-library');
const env = require('../../config/env');
const logger = require('../../config/logger');
const { AuthenticationError } = require('../../utils/errors');

let oauth2Client = null;

const getOAuthClient = () => {
  if (!oauth2Client) {
    oauth2Client = new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  }
  return oauth2Client;
};

/**
 * Checks whether Google OAuth is configured via environment variables
 */
const isGoogleAuthConfigured = () => {
  return Boolean(env.GOOGLE_CLIENT_ID);
};

/**
 * Verify Google ID Token received from frontend Google Identity Services SDK
 * 
 * @param {string} idToken - The Google JWT credential from google.accounts.id
 * @returns {Promise<{googleId: string, email: string, name: string, picture: string, emailVerified: boolean}>}
 */
const verifyGoogleIdToken = async (idToken) => {
  if (!idToken) {
    throw new AuthenticationError('Google credential token is required');
  }

  // Allow simulated dev/test token for local and automated testing
  if ((env.isDevelopment || env.isTest) && idToken.startsWith('mock_google_token_')) {
    const email = idToken.replace('mock_google_token_', '') || 'guest.patron@gmail.com';
    return {
      googleId: 'mock_gid_' + Buffer.from(email).toString('hex').slice(0, 16),
      email: email.toLowerCase(),
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      emailVerified: true,
    };
  }

  const client = getOAuthClient();

  try {
    const audience = env.GOOGLE_CLIENT_ID ? env.GOOGLE_CLIENT_ID : undefined;
    const ticket = await client.verifyIdToken({
      idToken,
      audience,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthenticationError('Invalid Google token payload');
    }

    if (!payload.email) {
      throw new AuthenticationError('Google account does not have an email address associated');
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      picture: payload.picture || '',
      emailVerified: Boolean(payload.email_verified),
    };
  } catch (error) {
    // If verifyIdToken failed, try verifying as a Google OAuth2 access token
    try {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        if (userInfo.email) {
          return {
            googleId: userInfo.sub,
            email: userInfo.email.toLowerCase(),
            name: userInfo.name || userInfo.given_name || userInfo.email.split('@')[0],
            picture: userInfo.picture || '',
            emailVerified: Boolean(userInfo.email_verified),
          };
        }
      }
    } catch (accessErr) {
      // Fall through to error
    }

    logger.error('Google token verification failed', { error: error.message });
    throw new AuthenticationError('Google verification failed: ' + (error.message || 'Invalid token'));
  }
};



module.exports = {
  getOAuthClient,
  isGoogleAuthConfigured,
  verifyGoogleIdToken,
};
