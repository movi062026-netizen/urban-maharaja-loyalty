/**
 * Validation helpers for Staff credential creation by Super Admin
 */

export function validateStaffCreation({ name, email, password }) {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Staff name must be at least 2 characters';
  }

  if (!email || !email.includes('@')) {
    errors.email = 'Valid official staff email is required';
  }

  if (!password || password.length < 6) {
    errors.password = 'Terminal access key must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
