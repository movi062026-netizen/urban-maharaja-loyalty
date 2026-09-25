/**
 * Validation rules for Reward Creation and Editing
 */

export function validateRewardForm({ title, requiredStamps, description }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Reward title is required';
  } else if (title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  const stampsNum = parseInt(requiredStamps, 10);
  if (isNaN(stampsNum) || stampsNum < 1 || stampsNum > 20) {
    errors.requiredStamps = 'Required stamps must be between 1 and 20';
  }

  if (description && description.trim().length > 300) {
    errors.description = 'Description cannot exceed 300 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
