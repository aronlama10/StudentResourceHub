import { api } from "./api";

export const createReport = async (resourceId, reportData) => {
  return await api.post(`/reports/${resourceId}`, reportData);
};

export const getReports = async (status = "pending") => {
  return await api.get(`/reports?status=${encodeURIComponent(status)}`);
};

export const reviewReport = async (reportId, status, resolutionNote = "") => {
  return await api.patch(`/reports/${reportId}/review`, {
    status,
    resolutionNote,
  });
};
