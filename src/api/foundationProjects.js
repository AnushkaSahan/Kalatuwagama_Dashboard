import apiClient from "./apiClient";

export const getFoundationProjects = () =>
  apiClient.get("/api/foundation-projects");
export const getFoundationProject = (id) =>
  apiClient.get(`/api/foundation-projects/${id}`);
export const createFoundationProject = (data) =>
  apiClient.post("/api/foundation-projects", data);
export const updateFoundationProject = (id, data) =>
  apiClient.put(`/api/foundation-projects/${id}`, data);
export const deleteFoundationProject = (id) =>
  apiClient.delete(`/api/foundation-projects/${id}`);
