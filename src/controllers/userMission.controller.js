import { StatusCodes } from "http-status-codes";
import { completeUserMission, createUserMission } from "../services/userMission.service.js";

export const handleCreateUserMission = async (req, res, next) => {
  try {
    // HACK : 임시로 userId를 1로 고정
    const userId = 1;
    const missionId = Number(req.params.missionId);

    const created = await createUserMission(userId, missionId);
    if (created === null) {
      return res.status(StatusCodes.CONFLICT).json({ status: "fail", message: "이미 해당 미션을 도전 중입니다." });
    }

    return res.status(StatusCodes.CREATED).json({ status: "success", data: { userMission: created } });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (req, res, next) => {
  try {
    const userMission = req.userMission;
    if (!userMission) {
      return res.status(StatusCodes.BAD_REQUEST).json({ status: "fail", message: "userMission not provided" });
    }

    // TODO : 사용자 검증 로직 추가
    const updated = await completeUserMission(userMission.id);
    if (!updated) {
      return res.status(StatusCodes.BAD_REQUEST).json({ status: "fail", message: "진행중인 미션을 찾을 수 없습니다." });
    }

    return res.status(StatusCodes.OK).json({ status: "success", data: { userMission: updated } });
  } catch (err) {
    next(err);
  }
};
