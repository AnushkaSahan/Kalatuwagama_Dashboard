import apiClient from "./apiClient";

export const getDonationInfos = () => apiClient.get("/api/donation-info");
export const getDonationInfo = (id) =>
  apiClient.get(`/api/donation-info/${id}`);
export const createDonationInfo = (data) =>
  apiClient.post("/api/donation-info", data);
export const updateDonationInfo = (id, data) =>
  apiClient.put(`/api/donation-info/${id}`, data);
export const deleteDonationInfo = (id) =>
  apiClient.delete(`/api/donation-info/${id}`);
