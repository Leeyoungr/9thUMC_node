import { Router } from "express";

import { handleUserSignUp } from "../controllers/user.controller.js";

const router = Router();

// POST /api/v1/users/signup -> 사용자 회원가입
router.post("/signup", handleUserSignUp);

export default router;
