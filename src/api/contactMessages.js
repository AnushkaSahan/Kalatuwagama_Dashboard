import apiClient from "./apiClient";

export const getContactMessages = () => apiClient.get("/api/contact-messages");
export const getContactMessage = (id) =>
  apiClient.get(`/api/contact-messages/${id}`);
export const createContactMessage = (data) =>
  apiClient.post("/api/contact-messages", data);
export const updateContactMessage = (id, data) =>
  apiClient.put(`/api/contact-messages/${id}`, data);
export const deleteContactMessage = (id) =>
  apiClient.delete(`/api/contact-messages/${id}`);
