const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '/api/v1');
export const API_URL = rawApiUrl.replace(/\/+$/, '');
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Urban Maharaja';

// Public digital-menu site. Must be the menu project's PRODUCTION domain (or a custom domain):
// per-deployment *.vercel.app URLs sit behind Vercel Deployment Protection and ask
// visitors (e.g. on mobile, where nobody is logged into Vercel) to sign in.
export const MENU_URL =
  import.meta.env.VITE_MENU_URL || 'https://urban-maharaja-premium-restaurant-menu-website-hbi32srb0.vercel.app/';
