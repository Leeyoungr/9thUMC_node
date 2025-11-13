import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore, listStoreMissions, listStoreReviews } from "../services/store.service.js";
import CustomError from "../errors/custom.error.js";

export const handleStoreCreate = async (req, res, next) => {
  try {
    const store = await createStore(bodyToStore(req.body));
    return res.status(StatusCodes.CREATED).success({ data: { store } });
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

    res.status(StatusCodes.OK).success({ data: reviews });
  } catch (err) {
    next(err);
  }
};

export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = req.store.id;

    const missions = await listStoreMissions(storeId);
    res.status(StatusCodes.OK).success({ data: missions });
  } catch (err) {
    next(err);
  }
};
