import { api } from "./axios";

export const getCards = async () => {
  const response = await api.get("/cards");
  return response.data;
};

export const getCard = async (id: number) => {
  const response = await api.get(`/cards/${id}`, {});
  return response.data;
};

export const postCard = async (recto: string, verso: string) => {
  const response = await api.post(`/cards`, { recto, verso });
  return response;
};

export const putCard = async (id: number, recto: string, verso: string) => {
  const response = await api.put(`/cards/${id}`, { recto, verso });
  return response;
};

export const deleteCard = async (id: number) => {
  const response = await api.delete(`/cards/${id}`, {});
  return response;
};
