import apiClient from "./apiClient";

export const getMonks = () => apiClient.get("/api/monks");
export const getMonk = (id) => apiClient.get(`/api/monks/${id}`);
export const createMonk = (data) => apiClient.post("/api/monks", data);
export const updateMonk = (id, data) => apiClient.put(`/api/monks/${id}`, data);
export const deleteMonk = (id) => apiClient.delete(`/api/monks/${id}`);
