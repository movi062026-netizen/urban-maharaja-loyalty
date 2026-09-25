/**
 * Urban Maharaja - General Helper Functions
 */

export function getRoleBadge(role) {
  switch (role) {
    case 'ADMIN':
      return {
        label: 'Super Admin',
        bg: 'bg-primary-container/30',
        text: 'text-primary',
        border: 'border-primary/40',
      };
    case 'STAFF':
      return {
        label: 'Floor Concierge',
        bg: 'bg-secondary/20',
        text: 'text-secondary',
        border: 'border-secondary/40',
      };
    default:
      return {
        label: 'Patron',
        bg: 'bg-surface-container-high',
        text: 'text-on-surface',
        border: 'border-outline-variant/30',
      };
  }
}

export function getTierInfo(totalApprovedStamps = 0) {
  if (totalApprovedStamps >= 12) {
    return {
      name: 'Kohinoor',
      badge: 'Supreme Noble',
      bgClass: 'from-primary-container/40 via-surface-container to-secondary/30',
      textClass: 'text-primary',
      borderClass: 'border-primary/50',
      nextTier: null,
      needed: 0,
    };
  }
  if (totalApprovedStamps >= 7) {
    return {
      name: 'Ruby',
      badge: 'Imperial Patron',
      bgClass: 'from-secondary/30 via-surface-container to-surface-container-high',
      textClass: 'text-secondary',
      borderClass: 'border-secondary/50',
      nextTier: 'Kohinoor',
      needed: 12 - totalApprovedStamps,
    };
  }
  return {
    name: 'Emerald',
    badge: 'Honored Guest',
    bgClass: 'from-surface-container via-surface-container-high to-surface-container-lowest',
    textClass: 'text-on-surface',
    borderClass: 'border-outline-variant/40',
    nextTier: 'Ruby',
    needed: 7 - totalApprovedStamps,
  };
}

export async function copyToClipboard(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
