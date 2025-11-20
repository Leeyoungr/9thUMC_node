import { responseFromMissions } from "../dtos/mission.dto.js";
import { responseFromReviews, responseFromStore } from "../dtos/store.dto.js";
import { getMissionsByStoreId } from "../repositories/mission.repository.js";
import { addStore, getAllStoreReviews } from "../repositories/store.repository.js";

export const createStore = async (data) => {
  const createdStore = await addStore({
    name: data.name,
    regionId: data.regionId,
    address: data.address,
  });
  return responseFromStore(createdStore);
};

export const listStoreReviews = async (storeId, cursor = undefined) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listStoreMissions = async (storeId) => {
  const missions = await getMissionsByStoreId(storeId);
  return responseFromMissions(missions);
};
