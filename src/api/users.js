import apiClient from "./apiClient";

export const getUsers = () => apiClient.get("/api/users");
export const getUser = (id) => apiClient.get(`/api/users/${id}`);
export const getUserByEmail = (email) =>
  apiClient.get(`/api/users/email/${email}`);
export const createUser = (data) => apiClient.post("/api/users", data);
export const updateUser = (id, data) => apiClient.put(`/api/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/api/users/${id}`);
