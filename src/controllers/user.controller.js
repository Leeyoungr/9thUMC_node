import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { listUserReviews } from "../services/review.service.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).success(user);
};

export const handleUserReviews = async (req, res, next) => {
  try {
    // HACK: 임시로 userId를 1로 고정
    const userId = 1;

    const reviews = await listUserReviews(userId);
    return res.status(StatusCodes.OK).json({ status: "success", data: { reviews } });
  } catch (err) {
    next(err);
  }
};
