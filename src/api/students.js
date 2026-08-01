import apiClient from "./apiClient";

export const getStudents = () => apiClient.get("/api/students");
export const getStudent = (id) => apiClient.get(`/api/students/${id}`);
export const createStudent = (data) => apiClient.post("/api/students", data);
export const updateStudent = (id, data) =>
  apiClient.put(`/api/students/${id}`, data);
export const deleteStudent = (id) => apiClient.delete(`/api/students/${id}`);
