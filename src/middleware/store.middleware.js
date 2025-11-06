import { StatusCodes } from "http-status-codes";
import { getStore } from "../repositories/store.repository.js";

export const ensureStoreExists = async (req, res, next) => {
  const storeId = Number(req.params.storeId);
  if (!Number.isInteger(storeId) || storeId < 1) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message: "유효한 storeId가 필요합니다.",
    });
  }

  try {
    const store = await getStore(storeId);
    if (!store) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        message: "요청하신 매장을 찾을 수 없습니다.",
      });
    }
    req.store = store;
    next();
  } catch (err) {
    next(err);
  }
};
