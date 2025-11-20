import { responseFromReview, responseFromUserReviews } from "../dtos/review.dto.js";
import { addReview, getReviewsByUserId } from "../repositories/review.repository.js";

export const createStoreReview = async (storeId, data) => {
  const createdReview = await addReview({ storeId, score: data.score, content: data.content });
  return responseFromReview(createdReview);
};

export const listUserReviews = async (userId) => {
  const reviews = await getReviewsByUserId(userId);
  return responseFromUserReviews(reviews);
};
