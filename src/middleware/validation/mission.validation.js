import { param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import CustomError from "../../errors/custom.error.js";

export const validateCreateUserMissionReq = [
  param("missionId").exists().toInt().isInt({ min: 1 }).withMessage("missionId는 1 이상의 정수여야 합니다."),
];

export const userMissionReqHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError({ name: "BAD_REQUEST", description: "유효성 검사 실패", data: errors.array() });
  }
  next();
};
