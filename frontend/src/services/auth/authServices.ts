import axios from "axios";
import type { DecodedUser } from "@/constants/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface AuthResponse {
  token: string;
  message: string;
  user: DecodedUser;
}

export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `/auth/register`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `/auth/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
