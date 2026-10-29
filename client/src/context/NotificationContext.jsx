import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import api, { refreshAccessToken } from '../services/api/client';
import { registerServiceWorker, syncPushSubscription, enablePush, pushSupported } from '../services/push';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const NotificationContext = createContext(null);

const MAX_ITEMS = 30;
const SOUND_KEY = 'um_notif_sound';

// Event other components listen to so they can refetch their data live
export const REALTIME_EVENT = 'um:realtime';

const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Non-fatal
  }
};

/* ── Sound: short phone-style "ding-ding" via WebAudio (no asset needed) ──── */
let audioCtx = null;
const getAudioCtx = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  return audioCtx;
};

const playNotificationSound = () => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  // Two bell-like notes: a fundamental plus a soft overtone, fast attack, natural decay
  [[1318.5, 0], [1760, 0.13]].forEach(([freq, offset]) => {
    [[freq, 0.22], [freq * 2, 0.05]].forEach(([f, level]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const start = now + offset;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.6);
    });
  });
};

const vibrate = () => {
  try {
    navigator.vibrate?.([180, 80, 180]);
  } catch {
    // Not supported
  }
};

/* ── SSE over fetch so we can send the Authorization header ──────────────── */
const parseEvents = (buffer, onEvent) => {
  const blocks = buffer.split(/\r?\n\r?\n/);
  const rest = blocks.pop();
  for (const block of blocks) {
    let event = 'message';
    const data = [];
    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
    }
    if (data.length) {
      try {
        onEvent(event, JSON.parse(data.join('\n')));
      } catch {
        // Ignore malformed frame
      }
    }
  }
  return rest;
};

const currentPermission = () => (pushSupported() ? Notification.permission : 'unsupported');

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const userId = user?._id || user?.id;

  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => safeRead(SOUND_KEY, true));
  const [pushPermission, setPushPermission] = useState(currentPermission);

  // Keep latest values for the long-lived stream callback
  const prefsRef = useRef({ t, soundEnabled });
  prefsRef.current = { t, soundEnabled };

  useEffect(() => {
    safeWrite(SOUND_KEY, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Load stored notifications (including ones that arrived while offline)
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get('/notifications');
      setItems(res.data?.data?.notifications || []);
      setUnreadCount(res.data?.data?.unreadCount || 0);
    } catch {
      // Keep whatever is shown
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    loadHistory();
  }, [userId, loadHistory]);

  // Keep this device's push subscription linked to the current user + language
  useEffect(() => {
    if (userId && currentPermission() === 'granted') syncPushSubscription(lang);
  }, [userId, lang]);

  // Browsers block audio until the user interacts once — unlock on first tap
  useEffect(() => {
    const unlock = () => {
      const ctx = getAudioCtx();
      if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const localize = useCallback((n) => {
    const { t: tr } = prefsRef.current;
    const vars = { guestName: tr('notif.someone'), ...n.data };
    const titleKey = `notif.${n.type}.title`;
    const bodyKey = `notif.${n.type}.body`;
    return {
      title: tr(titleKey) !== titleKey ? tr(titleKey, vars) : n.title,
      body: tr(bodyKey) !== bodyKey ? tr(bodyKey, vars) : n.message,
    };
  }, []);

  const handleIncoming = useCallback((n) => {
    window.dispatchEvent(new CustomEvent(REALTIME_EVENT, { detail: n }));
    if (n.silent) return;

    setItems((prev) => [n, ...prev.filter((p) => p.id !== n.id)].slice(0, MAX_ITEMS));
    setUnreadCount((c) => c + 1);

    // A hidden tab with push enabled: the phone/desktop notification already rings
    const osHandles = document.hidden && currentPermission() === 'granted';
    if (osHandles) return;

    const { title, body } = localize(n);
    toast(`${title}\n${body}`, { icon: '🔔', duration: 6000 });
    if (prefsRef.current.soundEnabled) {
      playNotificationSound();
      vibrate();
    }
  }, [localize]);

  // Live stream lifecycle
  useEffect(() => {
    if (!userId) {
      setConnected(false);
      return undefined;
    }

    let cancelled = false;
    let controller = null;
    let retryTimer = null;
    let attempt = 0;
    let live = false;

    const scheduleReconnect = () => {
      if (cancelled) return;
      const delay = Math.min(30000, 2000 * 2 ** attempt);
      attempt += 1;
      retryTimer = setTimeout(connect, delay);
    };

    async function connect() {
      if (cancelled) return;
      controller = new AbortController();
      try {
        let token = localStorage.getItem('accessToken');
        let res = await fetch(`${API_URL}/notifications/stream`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: controller.signal,
          cache: 'no-store',
        });

        if (res.status === 401) {
          token = await refreshAccessToken();
          res = await fetch(`${API_URL}/notifications/stream`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
            signal: controller.signal,
            cache: 'no-store',
          });
        }

        if (!res.ok || !res.body) throw new Error(`Stream failed (${res.status})`);

        live = true;
        setConnected(true);
        attempt = 0;
        // Pick up anything that arrived while we were disconnected
        loadHistory();

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = parseEvents(buffer, (event, payload) => {
            if (event === 'notification') handleIncoming(payload);
          });
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
      live = false;
      setConnected(false);
      scheduleReconnect();
    }

    connect();

    // Reconnect promptly when a phone wakes the tab back up
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || cancelled) return;
      if (!live) {
        clearTimeout(retryTimer);
        attempt = 0;
        controller?.abort();
        connect();
      } else {
        loadHistory();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      controller?.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId, handleIncoming, loadHistory]);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    api.patch('/notifications/read-all').catch(() => {});
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const markRead = useCallback((id) => {
    const target = itemsRef.current.find((n) => n.id === id);
    if (!target || target.read) return;
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    api.patch(`/notifications/${id}/read`).catch(() => {});
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setUnreadCount(0);
    api.delete('/notifications').catch(() => {});
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    const result = await enablePush(lang);
    setPushPermission(currentPermission());
    if (result === 'granted') {
      toast.success(t('notif.pushEnabled'));
      playNotificationSound();
    } else if (result === 'denied') {
      toast.error(t('notif.pushDenied'));
    } else if (result === 'unavailable') {
      toast.error(t('notif.pushUnavailable'));
    }
    return result;
  }, [lang, t]);

  const value = useMemo(() => ({
    items,
    unreadCount,
    connected,
    soundEnabled,
    setSoundEnabled,
    pushPermission,
    markAllRead,
    markRead,
    clearAll,
    localize,
    requestBrowserPermission,
  }), [items, unreadCount, connected, soundEnabled, pushPermission, markAllRead, markRead, clearAll, localize, requestBrowserPermission]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

/**
 * Re-run `callback` whenever a realtime event of one of `types` arrives.
 */
export function useRealtimeRefresh(types, callback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  const key = types.join(',');

  useEffect(() => {
    const wanted = key.split(',');
    const handler = (e) => {
      if (wanted.includes(e.detail?.type)) cbRef.current(e.detail);
    };
    window.addEventListener(REALTIME_EVENT, handler);
    return () => window.removeEventListener(REALTIME_EVENT, handler);
  }, [key]);
}
