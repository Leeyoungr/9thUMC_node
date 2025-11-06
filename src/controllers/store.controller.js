import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";

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
