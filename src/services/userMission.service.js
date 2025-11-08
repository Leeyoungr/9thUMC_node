import { addUserMission, isUserMissionInProgress, updateUserMission } from "../repositories/userMission.repository.js";

export const createUserMission = async (userId, missionId) => {
  const exists = await isUserMissionInProgress(userId, missionId);
  if (exists) return null;
  const created = await addUserMission(userId, missionId);
  return created;
};

export const completeUserMission = async (userMissionId) => {
  const updated = await updateUserMission(userMissionId);
  return updated;
};
