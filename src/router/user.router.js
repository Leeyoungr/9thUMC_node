import { Router } from "express";

import { handleUserLogin } from "../controllers/auth.controller.js";
import { handleUserReviews, handleUserSignUp } from "../controllers/user.controller.js";
import { handleUserMissions } from "../controllers/userMission.controller.js";
import {
  userReqHandler,
  validateUserLoginReq,
  validateUserMissionsReq,
  validateUserSignUpReq,
} from "../middleware/validation/user.validation.js";

const router = Router();

// POST /api/v1/users/signup -> 사용자 회원가입
router.post("/signup", validateUserSignUpReq, userReqHandler, handleUserSignUp);

// POST /api/v1/users/login -> 로그인(비밀번호 검증)
router.post("/login", validateUserLoginReq, userReqHandler, handleUserLogin);

// GET /api/v1/users/reviews -> 사용자 작성 리뷰 목록 조회
router.get("/reviews", handleUserReviews);

// GET /api/v1/users/missions -> 사용자 미션 목록 조회 (진행중/완료)
router.get("/missions", validateUserMissionsReq, userReqHandler, handleUserMissions);
export default router;
