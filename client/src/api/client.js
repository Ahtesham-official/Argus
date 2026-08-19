/**
 * Shared API client for the Argus frontend.
 * All pages import from here — single place to configure base URL,
 * default headers, and error handling.
 *
 * Uses native fetch (no extra dependencies).
 * In dev the Vite proxy routes /api → http://localhost:2001.
 */

const BASE_URL = '/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `API Error ${res.status}`;
    try {
      const err = await res.json();
      message = err?.error?.message || err?.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: (path, body, options) =>
    request(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  patch: (path, body, options) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),

  // Multipart / file uploads (no Content-Type override — browser sets it)
  upload: (path, formData, options) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
      ...options,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Upload failed (${res.status})`);
      }
      return res.json();
    }),
};

export default api;
