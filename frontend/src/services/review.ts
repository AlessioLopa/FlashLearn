import { Message } from "primevue";
import { api } from "./axios";
import type { AxiosError } from "axios";

export const getCardsForReview = async () => {
  try {
    const response = await api.get("/cards/reviews", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};

export const answerReview = async (id: number, success: boolean) => {
  try {
    const response = await api.post(
      `/cards/${id}/reviews/answer`,
      { success },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );
    return response.data;
  } catch (error: AxiosError | any) {
    throw {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};
