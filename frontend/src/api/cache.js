export const setCache = (key, value, ttlMs = 15 * 60 * 1000) => {
  const payload = { value, expiresAt: Date.now() + ttlMs };
  localStorage.setItem(key, JSON.stringify(payload));
};

export const getCache = (key) => {
  try {
    const p = JSON.parse(localStorage.getItem(key));
    if (!p) return null;
    if (Date.now() > p.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return p.value;
  } catch {
    return null;
  }
};
