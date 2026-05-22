import { api } from "./axios";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });

  if (response.data.token) {
    const token = response.data.token.token;
    localStorage.setItem("access_token", token);
    return true;
  }

  return false;
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/register", { email, password });

  if (response.status === 201) {
    return true;
  }
  return false;
};

export const logout = async () => {
  const response = await api.post("/logout", {});
  if (response.status === 200) {
    localStorage.removeItem("access_token");
    return true;
  }
  return false;
};
