import { body, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateUserSignUpReq = [
  body("email").exists().isEmail().withMessage("유효한 이메일이 필요합니다.").bail().normalizeEmail(),
  body("password")
    .exists()
    .isString()
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("비밀번호는 영문자와 숫자를 모두 포함해야 합니다."),
  body("name").optional().isString().trim().isLength({ min: 1 }).withMessage("이름은 문자열이어야 합니다."),
];

export const validateUserLoginReq = [
  body("email").exists().isEmail().withMessage("유효한 이메일이 필요합니다.").bail().normalizeEmail(),
  body("password").exists().isString().withMessage("비밀번호가 필요합니다."),
];

export const validateUserMissionsReq = [
  query("status")
    .optional()
    .customSanitizer((value) => {
      if (typeof value !== "string") return value;
      const raw = value.trim().toLowerCase();
      if (
        raw === "progress" ||
        raw === "inprogress" ||
        raw === "in-progress" ||
        raw === "in_progress" ||
        raw === "in progress"
      ) {
        return "IN_PROGRESS";
      }
      if (raw === "completed") return "COMPLETED";
      return raw.toUpperCase();
    })
    .isIn(["IN_PROGRESS", "COMPLETED"])
    .withMessage("status는 IN_PROGRESS 또는 COMPLETED 중 하나여야 합니다."),
];

export const userReqHandler = (req, res, next) => {
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
