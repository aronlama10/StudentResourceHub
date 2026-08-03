import { api } from "./api.js";

/**
 * Fetch the current logged in user's profile details.
 * @returns {Promise<any>} User profile object
 */
export const getProfile = () => {
  return api.get("/users/profile");
};

/**
 * Update the user's basic profile details.
 * @param {Object} profileData - { name, department, year, notificationsEnabled, profilePrivacy }
 * @returns {Promise<any>} Updated user object
 */
export const updateProfile = (profileData) => {
  return api.put("/users/profile", profileData);
};

/**
 * Update the user's email address.
 * @param {string} email
 * @returns {Promise<any>}
 */
export const updateEmail = (email) => {
  return api.put("/users/profile/email", { email });
};

/**
 * Update the user's password.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<any>}
 */
export const updatePassword = (currentPassword, newPassword) => {
  return api.put("/users/profile/password", { currentPassword, newPassword });
};

/**
 * Record a daily study activity and return the latest streak value.
 * @returns {Promise<any>} Updated streak information
 */
export const trackStudyStreak = () => {
  return api.post("/users/streak", {});
};
