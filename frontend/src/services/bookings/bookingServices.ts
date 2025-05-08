import type { BookingPayload, BookingResponse } from "@/constants/interfaces";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const createBooking = async (
  payload: BookingPayload
): Promise<BookingResponse> => {
  try {
    const response = await axios.post<BookingResponse>(
      `${API_BASE_URL}/bookings`,
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to create booking"
      );
    }
    throw new Error("An unexpected error occurred while creating booking");
  }
};

export const fetchUserBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch bookings"
      );
    }
    throw new Error("An unexpected error occurred while fetching bookings");
  }
};

export const deleteUserBooking = async (eventID: number | string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${eventID}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to delete booking"
      );
    }
    throw new Error("An unexpected error occurred while deleting booking");
  }
};
