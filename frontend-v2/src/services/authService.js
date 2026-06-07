import { api } from "./api.js";

/**
 * Register a new user.
 * @param {Object} userData
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>}
 */
export const signup = (userData) => {
  return api.post("/auth/signup", userData);
};

/**
 * Authenticate an existing user.
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<Object>}
 */
export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};
