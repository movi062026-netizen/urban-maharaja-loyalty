const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '/api/v1');
export const API_URL = rawApiUrl.replace(/\/+$/, '');
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Urban Maharaja';
