import type {
  BookingPayload,
  BookingResponse,
  UserBooking,
} from "@/constants/interfaces";
import axios from "axios";

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

export const createBooking = async (
  payload: BookingPayload
): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post<BookingResponse>(
      `/bookings`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to create booking"
      );
    }
    throw new Error("An unexpected error occurred while creating booking");
  }
};

export const fetchUserBookings = async (): Promise<UserBooking[]> => {
  try {
    const response = await apiClient.get<UserBooking[]>(`/bookings`);
    return response.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch bookings"
      );
    }
    throw new Error("An unexpected error occurred while fetching bookings");
  }
};

export const deleteUserBooking = async (
  eventId: number | string
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/bookings/${eventId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to delete booking"
      );
    }
    throw new Error("An unexpected error occurred while deleting booking");
  }
};
