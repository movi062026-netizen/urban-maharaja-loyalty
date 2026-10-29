import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');
const SITE_NAME = 'Urban Maharaja';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Per-route document title, description, canonical and social tags.
 * Pass `noindex` for private/auth pages so they stay out of search results.
 */
export function useSeo({ title, description, image, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Pure Veg Fine Dining & Loyalty Rewards in Jagatpura, Jaipur`;
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = fullTitle;
    setCanonical(url);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (image) {
      const abs = image.startsWith('http') ? image : `${SITE_URL}${image}`;
      setMeta('property', 'og:image', abs);
      setMeta('name', 'twitter:image', abs);
    }
  }, [title, description, image, noindex, pathname]);
}

export default useSeo;
