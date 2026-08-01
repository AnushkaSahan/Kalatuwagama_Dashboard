import apiClient from "./apiClient";

export const getAnnouncements = () => apiClient.get("/api/announcements");
export const getAnnouncement = (id) =>
  apiClient.get(`/api/announcements/${id}`);
export const createAnnouncement = (data) =>
  apiClient.post("/api/announcements", data);
export const updateAnnouncement = (id, data) =>
  apiClient.put(`/api/announcements/${id}`, data);
export const deleteAnnouncement = (id) =>
  apiClient.delete(`/api/announcements/${id}`);
