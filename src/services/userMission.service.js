import {
  addUserMission,
  getUserMissionsByStatus,
  isUserMissionInProgress,
  updateUserMission,
} from "../repositories/userMission.repository.js";

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

export const listUserMissions = async ({ userId, status }) => {
  const missions = await getUserMissionsByStatus(userId, status);

  const formatted = missions.map((um) => {
    const m = um.mission || {};
    const formattedDeadLine = m.deadLine ? new Date(m.deadLine).toISOString().split("T")[0] : null;
    return {
      ...um,
      mission: {
        ...m,
        deadLine: formattedDeadLine,
      },
    };
  });

  return formatted;
};
