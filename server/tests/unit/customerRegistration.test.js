const authService = require('../../src/services/auth.service');
const { ValidationError } = require('../../src/utils/errors');

describe('Customer Registration & Password Login Unit Tests', () => {
  it('throws ValidationError if noble name is missing or too short', async () => {
    await expect(
      authService.customerRegister({
        name: 'A',
        email: 'patron@example.com',
        phone: '9876543210',
        password: 'securePassword123',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if email is invalid', async () => {
    await expect(
      authService.customerRegister({
        name: 'Maharani Gayatri',
        email: 'not-an-email',
        phone: '9876543210',
        password: 'securePassword123',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if phone is less than 10 digits', async () => {
    await expect(
      authService.customerRegister({
        name: 'Maharani Gayatri',
        email: 'gayatri@example.com',
        phone: '12345',
        password: 'securePassword123',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError if password is less than 6 characters', async () => {
    await expect(
      authService.customerRegister({
        name: 'Maharani Gayatri',
        email: 'gayatri@example.com',
        phone: '9876543210',
        password: '123',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError in guestPasswordLogin if identifier or password missing', async () => {
    await expect(authService.guestPasswordLogin('', 'password')).rejects.toThrow(ValidationError);
    await expect(authService.guestPasswordLogin('patron@example.com', '')).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError in guestPasswordLogin if phone number has less than 10 digits', async () => {
    await expect(authService.guestPasswordLogin('12345', 'password123')).rejects.toThrow(ValidationError);
  });
});
