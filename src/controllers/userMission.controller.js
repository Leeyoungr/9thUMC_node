import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom.error.js";
import { completeUserMission, createUserMission, listUserMissions } from "../services/userMission.service.js";

export const handleCreateUserMission = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const missionId = Number(req.params.missionId);

    const created = await createUserMission(userId, missionId);
    if (created === null) {
      throw new CustomError({ name: "USER_MISSION_ALREADY_IN_PROGRESS" });
    }

    return res.status(StatusCodes.CREATED).success({ data: { userMission: created } });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (req, res, next) => {
  try {
    const userMission = req.userMission;
    if (!userMission) {
      throw new CustomError({ name: "BAD_REQUEST", description: "userMission not provided" });
    }
    const updated = await completeUserMission(userMission.id);

    return res.status(StatusCodes.OK).success({ data: { userMission: updated } });
  } catch (err) {
    next(err);
  }
};

export const handleUserMissions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const status = req.query.status;
    const missions = await listUserMissions({ userId, status });
    return res.status(StatusCodes.OK).success({ data: { missions } });
  } catch (err) {
    next(err);
  }
};
