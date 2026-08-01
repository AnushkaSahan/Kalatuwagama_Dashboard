import apiClient from "./apiClient";

export const getTeachers = () => apiClient.get("/api/teachers");
export const getTeacher = (id) => apiClient.get(`/api/teachers/${id}`);
export const createTeacher = (data) => apiClient.post("/api/teachers", data);
export const updateTeacher = (id, data) =>
  apiClient.put(`/api/teachers/${id}`, data);
export const deleteTeacher = (id) => apiClient.delete(`/api/teachers/${id}`);
