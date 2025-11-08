import { StatusCodes } from "http-status-codes";
import { getUserMissionById } from "../repositories/userMission.repository.js";

export const ensureUserMissionExists = async (req, res, next) => {
  const userMissionId = Number(req.params.userMissionId);
  if (!Number.isInteger(userMissionId) || userMissionId < 1) {
    return res.status(StatusCodes.BAD_REQUEST).json({ status: "fail", message: "유효한 userMissionId가 필요합니다." });
  }

  try {
    const userMission = await getUserMissionById(userMissionId);
    if (!userMission) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", message: "요청하신 사용자 미션을 찾을 수 없습니다." });
    }

    req.userMission = userMission;
    next();
  } catch (err) {
    next(err);
  }
};
