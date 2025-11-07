import { Router } from "express";

import { handleUserLogin } from "../controllers/auth.controller.js";
import { handleUserSignUp } from "../controllers/user.controller.js";
import {
  createLoginReqHandler,
  createUserReqHandler,
  validateUserLoginReq,
  validateUserSignUpReq,
} from "../middleware/validation/user.validation.js";

const router = Router();

// POST /api/v1/users/signup -> 사용자 회원가입
router.post("/signup", validateUserSignUpReq, createUserReqHandler, handleUserSignUp);

// POST /api/v1/users/login -> 로그인(비밀번호 검증)
router.post("/login", validateUserLoginReq, createLoginReqHandler, handleUserLogin);

export default router;
