import { api } from "./api.js";

export const getResources = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/resources${queryString ? `?${queryString}` : ""}`);
};

export const getResourceById = (id) => {
  return api.get(`/resources/${id}`);
};

export const createResource = (resourceFormData) => {
  return api.postForm("/resources", resourceFormData);
};

export const updateResource = (id, resourceFormData) => {
  return api.putForm(`/resources/${id}`, resourceFormData);
};

export const deleteResource = (id) => {
  return api.delete(`/resources/${id}`);
};
