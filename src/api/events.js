import apiClient from "./apiClient";

export const getEvents = () => apiClient.get("/api/events");
export const getEvent = (id) => apiClient.get(`/api/events/${id}`);
export const createEvent = (data) => apiClient.post("/api/events", data);
export const updateEvent = (id, data) =>
  apiClient.put(`/api/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/api/events/${id}`);
