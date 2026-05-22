import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      alert("Erreur réseau");
      return Promise.reject(error);
    }
    error = {
      message: error.response.data?.message,
      status: error.response?.status,
      code: error.response.data?.code,
      errors: error.response.data.errors,
    };
    return Promise.reject(error);
  },
);
