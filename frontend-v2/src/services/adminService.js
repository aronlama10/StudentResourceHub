import { api } from "./api.js";

/**
 * Fetch all resources with "pending" status.
 * Requires moderator or admin role.
 * @returns {Promise<any>} { success, resources }
 */
export const getPendingResources = () => {
  return api.get("/resources/pending");
};

export const getApprovedResources = async () => {
  try {
    const response = await api.get("/resources/admin/approved");
    return response;
  } catch (error) {
    console.error("GET APPROVED RESOURCES ERROR:", error);
    throw error;
  }
};

/**
 * Approve a pending resource.
 * @param {string} id - Resource ID
 * @returns {Promise<any>} { success, message, resource }
 */
export const approveResource = (id) => {
  return api.patch(`/resources/${id}/approve`);
};

/**
 * Reject a pending resource with a reason.
 * @param {string} id - Resource ID
 * @param {string} rejectionReason - Reason for rejection
 * @returns {Promise<any>} { success, message, resource }
 */
export const rejectResource = (id, rejectionReason) => {
  return api.patch(`/resources/${id}/reject`, { rejectionReason });
};

export const getRejectedResources = async () => {
  return await api.get("/resources/admin/rejected");
};

export const archiveResource = async (id) => {
  return await api.patch(`/resources/${id}/archive`);
};

export const getArchivedResources = async () => {
  return await api.get("/resources/admin/archived");
};

export const restoreResource = async (id) => {
  return await api.patch(`/resources/${id}/restore`);
};


/**
 * Admin user management.
 * These endpoints must be protected by requireRole("admin").
 */

export const getAdminUsers = () => {
  return api.get("/users/admin");
};

export const updateAdminUserRole = (id, role) => {
  return api.patch(`/users/admin/${id}/role`, { role });
};

export const deleteAdminUser = (id) => {
  return api.delete(`/users/admin/${id}`);
};