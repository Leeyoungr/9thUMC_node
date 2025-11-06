import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateCreateStoreReq = [
  body("name")
    .exists()
    .withMessage("name은 필수 입력값입니다.")
    .bail()
    .isString()
    .bail()
    .trim()
    .notEmpty()
    .withMessage("name은 공백일 수 없습니다.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("name은 1자 이상 255자 이하의 문자열이어야 합니다."),

  body("regionId")
    .exists()
    .withMessage("regionId는 필수 입력값입니다.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("regionId는 1 이상의 숫자여야 합니다."),

  body("address")
    .exists()
    .withMessage("address는 필수 입력값입니다.")
    .bail()
    .isString()
    .withMessage("address는 문자열이어야 합니다.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("address는 공백일 수 없습니다.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("address는 1자 이상 255자 이하의 문자열이어야 합니다."),
];

export const createStoreReqHandler = (req, res, next) => {
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
