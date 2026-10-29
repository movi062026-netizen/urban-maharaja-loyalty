import api from './api/client';

/**
 * Web Push helpers: registers the service worker and keeps this device's
 * push subscription linked to the signed-in user.
 */
export const pushSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

let registrationPromise = null;
export const registerServiceWorker = () => {
  if (!pushSupported()) return Promise.resolve(null);
  if (!registrationPromise) {
    registrationPromise = navigator.serviceWorker.register('/sw.js').catch(() => null);
  }
  return registrationPromise;
};

const urlBase64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

let publicKeyPromise = null;
const getPublicKey = () => {
  if (!publicKeyPromise) {
    publicKeyPromise = api.get('/notifications/push/config')
      .then((res) => (res.data?.data?.enabled ? res.data.data.publicKey : null))
      .catch(() => null);
  }
  return publicKeyPromise;
};

/**
 * Ask permission (must run from a click) and subscribe this device.
 * Returns 'granted' | 'denied' | 'default' | 'unsupported' | 'unavailable'.
 */
export const enablePush = async (lang = 'en') => {
  if (!pushSupported()) return 'unsupported';
  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;
  if (permission !== 'granted') return permission;
  const ok = await syncPushSubscription(lang);
  return ok ? 'granted' : 'unavailable';
};

/**
 * Re-link an already-granted device to the current user / language.
 * Safe to call on every login; does nothing without permission.
 */
export const syncPushSubscription = async (lang = 'en') => {
  if (!pushSupported() || Notification.permission !== 'granted') return false;
  const [registration, publicKey] = await Promise.all([registerServiceWorker(), getPublicKey()]);
  if (!registration || !publicKey) return false;
  try {
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }
    await api.post('/notifications/push/subscribe', { subscription: subscription.toJSON(), lang });
    return true;
  } catch {
    return false;
  }
};

/** Unlink this device before the session ends (called from logout). */
export const unsubscribePushForLogout = async () => {
  if (!pushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) {
      await api.post('/notifications/push/unsubscribe', { endpoint: subscription.endpoint });
    }
  } catch {
    // Best effort
  }
};
