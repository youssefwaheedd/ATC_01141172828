import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const registerUser = async (email: string, password: string) => {
  await axios.post(
    `${API_BASE_URL}/auth/register`,
    {
      email,
      password,
    },

    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

export const loginUser = async (email: string, password: string) => {
  await axios.post(
    `${API_BASE_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
