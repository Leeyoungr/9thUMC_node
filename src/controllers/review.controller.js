import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import CustomError from "../errors/custom.error.js";
import { createStoreReview } from "../services/review.service.js";

export const handleCreateStoreReview = async (req, res, next) => {
  try {
    const store = req.store;
    if (!store || !store.id) {
      throw new CustomError({ name: "BAD_REQUEST", description: "유효한 매장이 필요합니다." });
    }

    const data = bodyToReview(req.body);
    const created = await createStoreReview(store.id, data);

    return res.status(StatusCodes.CREATED).success({ data: { review: created } });
  } catch (err) {
    next(err);
  }
};
