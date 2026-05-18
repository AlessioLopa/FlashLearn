import type { AxiosError } from "axios";
import { api } from "./axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });

    if (response.data.token) {
      const token = response.data.token.token;
      localStorage.setItem("access_token", token);
      return true;
    }

    return false;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response?.data.errors[0].message,
      status: error.response?.status,
    };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await api.post("/register", { email, password });

    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response?.data.errors[0].message,
      status: error.response?.status,
    };
  }
};
