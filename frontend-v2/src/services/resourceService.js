import { api } from "./api.js";

/**
 * Fetch all resources.
 * @returns {Promise<any>} List of resources
 */
export const getResources = () => {
  return api.get("/resources");
};

/**
 * Fetch a single resource by ID.
 * @param {string} id
 * @returns {Promise<any>}
 */
export const getResourceById = (id) => {
  return api.get(`/resources/${id}`);
};

/**
 * Create a new resource.
 * @param {Object} resourceData
 * @returns {Promise<any>} Created resource
 */
export const createResource = (resourceData) => {
  return api.post("/resources", resourceData);
};

/**
 * Update an existing resource.
 * @param {string} id
 * @param {Object} resourceData
 * @returns {Promise<any>} Updated resource
 */
export const updateResource = (id, resourceData) => {
  return api.put(`/resources/${id}`, resourceData);
};

/**
 * Delete a resource.
 * @param {string} id
 * @returns {Promise<any>} Delete confirmation response
 */
export const deleteResource = (id) => {
  return api.delete(`/resources/${id}`);
};
