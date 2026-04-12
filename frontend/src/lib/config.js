const getNormalizedBaseUrl = (value, fallback) => {
  const raw = (value || '').trim();
  const chosen = raw || fallback;
  return chosen.replace(/\/$/, '');
};

export const API_URL = getNormalizedBaseUrl(import.meta.env.VITE_API_URL, 'http://localhost:3000');
export const WS_URL = getNormalizedBaseUrl(
  import.meta.env.VITE_WS_URL,
  API_URL.replace(/^http/, 'ws')
);
