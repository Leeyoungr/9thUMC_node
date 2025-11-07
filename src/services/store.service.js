import { responseFromStore } from "../dtos/store.dto.js";
import { addStore, getStore } from "../repositories/store.repository.js";

export const createStore = async (data) => {
  const createdStore = await addStore({
    name: data.name,
    regionId: data.regionId,
    address: data.address,
  });

  if (!createdStore || !createdStore.id) {
    throw new Error("가게 생성 중 오류 발생");
  }

  const storeFromDb = await getStore(createdStore.id);
  if (!storeFromDb) {
    throw new Error("생성한 가게를 조회하지 못했습니다.");
  }

  return responseFromStore(storeFromDb);
};

export const listStoreReviews = async (storeId) => {
  const reviews = await getAllStoreReviews(storeId);
  return responseFromReviews(reviews);
};
