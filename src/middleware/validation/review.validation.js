import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import CustomError from "../../errors/custom.error.js";

export const validateCreateReviewReq = [
  body("score")
    .exists()
    .matches(/^[1-5](\.[0-9])?$/)
    .withMessage("score은 1 이상 5 이하의 숫자(소수 1자리까지)여야 합니다.")
    .bail()
    .toFloat(),

  body("content")
    .optional()
    .isString()
    .bail()
    .trim()
    .notEmpty()
    .bail()
    .isLength({ max: 1000 })
    .withMessage("content는 최대 1000자의 문자열이어야 합니다."),
];

export const createReviewReqHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError({ name: "BAD_REQUEST", description: "유효성 검사 실패", data: errors.array() });
  }
  next();
};
