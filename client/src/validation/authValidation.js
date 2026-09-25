/**
 * Client-side validation helpers for customer and staff authentication
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email address is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid royal email address';
  return null;
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return 'Mobile number is required';
  const clean = phone.trim().replace(/\D/g, '');
  if (clean.length < 10 || clean.length > 15) return 'Mobile number must be 10-15 digits';
  return null;
}

export function validateOtp(otp) {
  if (!otp) return 'Verification seal code is required';
  const clean = String(otp).trim().replace(/\D/g, '');
  if (clean.length !== 6) return 'Verification seal must be exactly 6 digits';
  return null;
}

export function validateNobleName(name) {
  if (!name || typeof name !== 'string') return 'Full noble name is required';
  if (name.trim().length < 2) return 'Noble name must be at least 2 characters';
  if (name.trim().length > 100) return 'Noble name cannot exceed 100 characters';
  return null;
}
