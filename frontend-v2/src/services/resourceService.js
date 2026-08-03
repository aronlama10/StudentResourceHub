import { api } from "./api.js";

/**
 * Fetch all resources (optionally filtered by query parameters).
 * @param {Object} params - Query params e.g. { department, search, myUploads }
 * @returns {Promise<any>} List of resources
 */
export const getResources = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/resources${queryString ? `?${queryString}` : ""}`);
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
 * Create a new resource with a file upload.
 * @param {FormData} resourceFormData
 * @returns {Promise<any>} Created resource
 */
export const createResource = (resourceFormData) => {
  return api.postForm("/resources", resourceFormData);
};

/**
 * Update an existing resource.
 * @param {string} id
 * @param {FormData} resourceFormData
 * @returns {Promise<any>} Updated resource
 */
export const updateResource = (id, resourceFormData) => {
  return api.putForm(`/resources/${id}`, resourceFormData);
};

/**
 * Delete a resource.
 * @param {string} id
 * @returns {Promise<any>} Delete confirmation response
 */
export const deleteResource = (id) => {
  return api.delete(`/resources/${id}`);
};
