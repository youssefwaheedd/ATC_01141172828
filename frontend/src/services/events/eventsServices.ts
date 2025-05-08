/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiEvent, EventCardProps } from "@/constants/interfaces";
import axios, { type AxiosResponse } from "axios";

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

export const getEvents = async (): Promise<EventCardProps[]> => {
  try {
    const response = await apiClient.get<EventCardProps[]>(`/events`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch events");
    }
    throw new Error("Failed to fetch events.");
  }
};

export const createEvent = async (
  payload: any
): Promise<AxiosResponse<ApiEvent>> => {
  try {
    const response = await apiClient.post<ApiEvent>(`/events`, payload);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to create event");
    }
    throw new Error("Failed to create event.");
  }
};

export const editEvent = async (
  payload: any,
  id: string
): Promise<AxiosResponse<ApiEvent>> => {
  try {
    const response = await apiClient.put<ApiEvent>(`/events/${id}`, payload);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to update event");
    }
    throw new Error("Failed to update event.");
  }
};

export const getEventById = async (
  id: string
): Promise<AxiosResponse<ApiEvent>> => {
  try {
    const response = await apiClient.get<ApiEvent>(`/events/${id}`);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch event");
    }
    throw new Error("Failed to fetch event.");
  }
};

export const deleteEvent = async (
  id: string
): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/events/${id}`
    );
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to delete event");
    }
    throw new Error("Failed to delete event.");
  }
};
