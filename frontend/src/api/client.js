// Centralized API client
// Wraps fetch with:
//  - base URL injection
//  - JSON headers
//  - automatic Authorization header from stored userInfo
//  - 401 handling (clear session + redirect)


const getToken = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo).token : null;
  } catch {
    return null;
  }
};

export const setUserInfo = (info) => {
  localStorage.setItem('userInfo', JSON.stringify(info));
};

export const getUserInfo = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
};

const handleUnauthorized = () => {
  clearUserInfo();
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
};

/**
 * Perform an API request.
 * @param {string} path - API path, e.g. '/api/ebooks'
 * @param {object} [options]
 * @param {string} [options.method] - HTTP method (default GET)
 * @param {object} [options.body] - JSON body
 * @param {boolean} [options.auth] - whether to attach Bearer token (default true)
 * @returns {Promise<object>} parsed JSON response
 * @throws {Error} with `.message` from server or generic
 */
export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${__API_BASE_URL__}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      handleUnauthorized();
    }
    throw new ApiError(response.status, data?.message || 'Something went wrong. Please try again.', data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

// Convenience wrappers
export const get = (path, opts = {}) => apiRequest(path, { method: 'GET', ...opts });
export const post = (path, body, opts = {}) => apiRequest(path, { method: 'POST', body, ...opts });
export const put = (path, body, opts = {}) => apiRequest(path, { method: 'PUT', body, ...opts });
export const del = (path, opts = {}) => apiRequest(path, { method: 'DELETE', ...opts });