import apiClient from "./apiClient";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post("/api/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
