import { param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateCreateUserMissionReq = [
  param("missionId").exists().toInt().isInt({ min: 1 }).withMessage("missionId는 1 이상의 정수여야 합니다."),
];

export const userMissionReqHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message: "유효성 검사 실패",
      errors: errors.array(),
    });
  }
  next();
};
