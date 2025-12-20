import CustomError from "../errors/custom.error.js";
import { getUserMissionById } from "../repositories/userMission.repository.js";

export const ensureUserMissionExists = async (req, res, next) => {
  const userMissionId = Number(req.params.userMissionId);
  if (!Number.isInteger(userMissionId) || userMissionId < 1) {
    throw new CustomError({ name: "BAD_REQUEST", description: "유효한 userMissionId가 필요합니다." });
  }

  try {
    const userMission = await getUserMissionById(userMissionId);
    if (!userMission) {
      throw new CustomError({ name: "MISSION_NOT_FOUND" });
    }

    req.userMission = userMission;
    next();
  } catch (err) {
    next(err);
  }
};
