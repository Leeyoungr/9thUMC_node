import { StatusCodes } from "http-status-codes";
import { createUserMission } from "../services/userMission.service.js";

export const handleCreateUserMission = async (req, res, next) => {
  try {
    // HACK : 임시로 userId를 1로 고정
    const userId = 1;
    const missionId = Number(req.params.missionId);

    if (!Number.isInteger(missionId) || missionId < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: "유효한 missionId가 필요합니다.",
      });
    }

    const created = await createUserMission(userId, missionId);
    if (created === null) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "fail",
        message: "이미 해당 미션을 도전 중입니다.",
      });
    }

    return res.status(StatusCodes.CREATED).json({
      status: "success",
      data: { userMission: created },
    });
  } catch (err) {
    next(err);
  }
};
