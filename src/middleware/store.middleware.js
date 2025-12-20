import CustomError from "../errors/custom.error.js";
import { getStore } from "../repositories/store.repository.js";

export const ensureStoreExists = async (req, res, next) => {
  const storeId = Number(req.params.storeId);
  if (!Number.isInteger(storeId) || storeId < 1) {
    throw new CustomError({ name: "BAD_REQUEST", description: "유효한 storeId가 필요합니다." });
  }

  try {
    const store = await getStore(storeId);
    if (!store) {
      throw new CustomError({ name: "STORE_NOT_FOUND" });
    }
    req.store = store;
    next();
  } catch (err) {
    next(err);
  }
};
