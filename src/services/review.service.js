import { responseFromReview } from "../dtos/review.dto.js";
import { addReview } from "../repositories/review.repository.js";

export const createStoreReview = async (storeId, data) => {
  const createdReview = await addReview({
    storeId,
    score: data.score,
    content: data.content,
  });

  if (!createdReview || !createdReview.id) {
    throw new Error("리뷰 생성 중 오류 발생");
  }

  return responseFromReview(createdReview);
};
