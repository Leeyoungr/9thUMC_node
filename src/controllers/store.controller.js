import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore, listStoreReviews } from "../services/store.service.js";

export const handleStoreCreate = async (req, res, next) => {
  try {
    const store = await createStore(bodyToStore(req.body));
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: { store },
    });
  } catch (err) {
    next(err);
  }
};

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const reviews = await listStoreReviews(
      parseInt(req.params.storeId),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : undefined
    );

    res.status(StatusCodes.OK).json({ status: "success", data: reviews });
  } catch (err) {
    next(err);
  }
};
