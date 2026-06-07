const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Base request handler that automatically appends the auth token and handles response JSON.
 * @param {string} path - The relative endpoint path (e.g., '/auth/login')
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response JSON data
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Automatically attach token if it exists in localStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
