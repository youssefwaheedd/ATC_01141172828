/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiEvent, EventCardProps } from "@/constants/interfaces";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getEvents = async () => {
  try {
    const response = await axios.get<EventCardProps[]>(
      `${API_BASE_URL}/events`
    );
    return response.data;
  } catch {
    throw new Error("Failed to fetch events.");
  }
};
export const createEvent = async (payload: any) => {
  try {
    const respone = await axios.post(`${API_BASE_URL}/events`, payload, {
      withCredentials: true,
    });

    return respone;
  } catch {
    throw new Error("Failed to create event.");
  }
};

export const editEvents = async (payload: any, id: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, payload, {
      withCredentials: true,
    });
    return response;
  } catch {
    throw new Error("Failed to update event.");
  }
};

export const getEventbyId = async (id: string) => {
  try {
    const response = await axios.get<ApiEvent>(`${API_BASE_URL}/events/${id}`, {
      withCredentials: true,
    });
    return response;
  } catch {
    throw new Error("Failed to fetch event.");
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/events/${id}`, {
      withCredentials: true,
    });
    return response;
  } catch {
    throw new Error("Failed to delete event.");
  }
};
