const authService = require('../../src/services/auth.service');
const { ValidationError } = require('../../src/utils/errors');

describe('Password Reset & Forgot Password Unit Tests', () => {
  it('throws ValidationError if email is missing or empty in forgotPassword', async () => {
    await expect(authService.forgotPassword('')).rejects.toThrow(ValidationError);
    await expect(authService.forgotPassword(null)).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if email format is invalid in forgotPassword', async () => {
    await expect(authService.forgotPassword('not-an-email')).rejects.toThrow(ValidationError);
    await expect(authService.forgotPassword('patron@')).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if parameters are missing in resetPassword', async () => {
    await expect(
      authService.resetPassword({ email: '', otp: '123456', newPassword: 'newPassword123' })
    ).rejects.toThrow(ValidationError);

    await expect(
      authService.resetPassword({ email: 'patron@example.com', otp: '', newPassword: 'newPassword123' })
    ).rejects.toThrow(ValidationError);

    await expect(
      authService.resetPassword({ email: 'patron@example.com', otp: '123456', newPassword: '' })
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if new password is too short in resetPassword', async () => {
    await expect(
      authService.resetPassword({
        email: 'patron@example.com',
        otp: '123456',
        newPassword: '123',
      })
    ).rejects.toThrow(ValidationError);
  });
});
