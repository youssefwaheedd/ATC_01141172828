/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiEvent } from "@/constants/sidebar-items";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const createEvent = async (payload: any, token: string) => {
  const respone = await axios.post(`${API_BASE_URL}/events`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return respone;
};

export const editEvents = async (payload: any, token: string, id: string) => {
  const response = await axios.put(`${API_BASE_URL}/events/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getEventbyId = async (id: string, token: string) => {
  const response = await axios.get<ApiEvent>(`${API_BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteEvent = async (id: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
