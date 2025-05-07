// src/services/bookings/bookingService.ts
import type {
  BookingPayload,
  BookingResponse,
} from "@/constants/sidebar-items";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Create a new booking
export const createBooking = async (
  payload: BookingPayload,
  token: string
): Promise<BookingResponse> => {
  try {
    const response = await axios.post<BookingResponse>(
      `${API_BASE_URL}/bookings`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Axios nests the response data under 'data'
  } catch (error: unknown) {
    // Enhance error handling to throw a more informative error
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to create booking"
      );
    }
    throw new Error("An unexpected error occurred while creating booking");
  }
};

export const fetchUserBookings = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      // Assuming this is your endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const deleteUserBooking = async (
  bookingId: number | string,
  token: string
) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
