import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createStoreReview } from "../services/review.service.js";

export const handleCreateStoreReview = async (req, res, next) => {
  try {
    const store = req.store;
    if (!store || !store.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: "유효한 매장이 필요합니다.",
      });
    }

    const data = bodyToReview(req.body);
    const created = await createStoreReview(store.id, data);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: { review: created },
    });
  } catch (err) {
    next(err);
  }
};
