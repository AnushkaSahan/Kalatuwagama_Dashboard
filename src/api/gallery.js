import apiClient from "./apiClient";

export const getGalleryItems = () => apiClient.get("/api/gallery");
export const getGalleryItem = (id) => apiClient.get(`/api/gallery/${id}`);
export const createGalleryItem = (data) => apiClient.post("/api/gallery", data);
export const updateGalleryItem = (id, data) =>
  apiClient.put(`/api/gallery/${id}`, data);
export const deleteGalleryItem = (id) => apiClient.delete(`/api/gallery/${id}`);
