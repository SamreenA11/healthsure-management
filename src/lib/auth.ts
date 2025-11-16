import { apiClient } from "../config/api";

export const registerUser = async (data: any) => {
  return apiClient.post("/auth/register", data);
};

export const loginUser = async (data: any) => {
  return apiClient.post("/auth/login", data);
};
