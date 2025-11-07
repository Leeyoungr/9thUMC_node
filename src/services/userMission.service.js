import { addUserMission, isUserMissionInProgress } from "../repositories/userMission.repository.js";

export const createUserMission = async (userId, missionId) => {
  const exists = await isUserMissionInProgress(userId, missionId);
  if (exists) {
    return null;
  }

  const created = await addUserMission(userId, missionId);
  return created;
};
