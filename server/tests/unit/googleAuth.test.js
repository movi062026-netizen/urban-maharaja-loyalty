const { verifyGoogleIdToken, isGoogleAuthConfigured } = require('../../src/integrations/google');

describe('Google Auth Integration', () => {
  it('detects if Google Auth is configured', () => {
    const configured = isGoogleAuthConfigured();
    expect(typeof configured).toBe('boolean');
  });

  it('verifies simulated/dev Google tokens in development mode', async () => {
    const profile = await verifyGoogleIdToken('mock_google_token_royal.guest@gmail.com');
    expect(profile).toHaveProperty('email', 'royal.guest@gmail.com');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('googleId');
    expect(profile).toHaveProperty('emailVerified', true);
  });

  it('rejects empty or missing token with AuthenticationError', async () => {
    await expect(verifyGoogleIdToken(null)).rejects.toThrow('Google credential token is required');
  });
});
