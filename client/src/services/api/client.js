import axios from 'axios';
import { API_URL } from '../../config';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const loginPathForCurrentPortal = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return '/admin/login';
  if (path.startsWith('/staff')) return '/staff/login';
  return '/login';
};

// Single in-flight refresh shared by every caller. Refresh tokens rotate on use,
// so parallel 401s must not each fire their own refresh (the 2nd would fail and log out).
let refreshPromise = null;

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.reject(new Error('No refresh token'));

    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        const { accessToken, refreshToken: newRefresh } = data.data.tokens;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never refresh on credential endpoints — a 401 there means wrong credentials
    const url = originalRequest?.url || '';
    const isAuthEndpoint =
      /\/auth\/(admin|staff|guest)\/|\/auth\/(google|refresh|forgot-password|reset-password)/.test(url);

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (localStorage.getItem('refreshToken')) {
        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearSession();
          window.location.href = loginPathForCurrentPortal();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
