import type { AxiosError } from "axios";
import { api } from "./axios";

export const getCards = async () => {
  try {
    const response = await api.get("/cards", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response?.status,
    };
  }
};

export const getCard = async (id: number) => {
  try {
    const response = await api.get(`/cards/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response?.status,
    };
  }
};

export const postCard = async (recto: string, verso: string) => {
  try {
    const response = await api.post(
      `/cards`,
      { recto, verso },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    return response;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response?.status,
    };
  }
};

export const putCard = async (id: number, recto: string, verso: string) => {
  try {
    const response = await api.put(
      `/cards/${id}`,
      { recto, verso },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    return response;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response?.status,
    };
  }
};

export const deleteCard = async (id: number) => {
  try {
    const response = await api.delete(`/cards/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return response;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response?.status,
    };
  }
};
