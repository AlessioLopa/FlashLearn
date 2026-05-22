import { api } from "./axios";

export const getCardsForReview = async () => {
  const response = await api.get("/cards/reviews", {});
  return response.data;
};

export const answerReview = async (id: number, success: boolean) => {
  const response = await api.post(
    `/cards/${id}/reviews/answer`,
    { success },
    {},
  );
  return response.data;
};
