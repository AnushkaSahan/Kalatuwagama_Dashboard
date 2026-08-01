import apiClient from "./apiClient";

export const getTempleHistories = () => apiClient.get("/api/temple-history");
export const getTempleHistory = (id) =>
  apiClient.get(`/api/temple-history/${id}`);
export const createTempleHistory = (data) =>
  apiClient.post("/api/temple-history", data);
export const updateTempleHistory = (id, data) =>
  apiClient.put(`/api/temple-history/${id}`, data);
export const deleteTempleHistory = (id) =>
  apiClient.delete(`/api/temple-history/${id}`);
