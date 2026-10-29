/* Urban Maharaja service worker — shows push notifications like a native app. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Urban Maharaja', body: event.data ? event.data.text() : '' };
  }

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const focused = windows.find((w) => w.focused && w.visibilityState === 'visible');

    // The open, focused tab already shows its own toast + sound — don't double up
    if (focused) {
      focused.postMessage({ kind: 'push-received', id: data.id });
      return;
    }

    await self.registration.showNotification(data.title || 'Urban Maharaja', {
      body: data.body || '',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: data.id || undefined,
      renotify: true,
      vibrate: [180, 80, 180],
      data: { url: data.url || '/' },
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find((w) => w.url.startsWith(self.location.origin));
    if (existing) {
      await existing.focus();
      return existing.navigate(url).catch(() => existing.postMessage({ kind: 'navigate', url }));
    }
    return self.clients.openWindow(url);
  })());
});
