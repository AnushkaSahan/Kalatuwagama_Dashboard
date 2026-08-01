import apiClient from "./apiClient";

export const register = (userData) =>
  apiClient.post("/api/auth/register", userData);
export const login = (credentials) =>
  apiClient.post("/api/auth/login", credentials);
export const forgotPassword = (email) =>
  apiClient.post("/api/auth/forgot-password", { email });
