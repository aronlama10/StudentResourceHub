import { api } from "./api.js";

/**
 * Toggle save/unsave a resource for the current user.
 * @param {string} resourceId - The resource ID to toggle
 * @returns {Promise<any>} { success, saved, message, savedResources }
 */
export const toggleSaveResource = (resourceId) => {
  return api.post(`/users/saved/${resourceId}`);
};

/**
 * Fetch all saved resources for the current user (fully populated).
 * @returns {Promise<any>} { success, resources }
 */
export const getSavedResources = () => {
  return api.get("/users/saved");
};

/**
 * Get the list of saved resource IDs for the current user.
 * @returns {Promise<any>} { success, savedResourceIds }
 */
export const getSavedStatus = () => {
  return api.get("/users/saved/status");
};
