import { Router } from "express";
import passport from "passport";
import { handleRefreshToken, handleGoogleCallback, handleLogout } from "../controllers/auth.controller.js";

const router = Router();

router.get(
  "/login/google",
  passport.authenticate("google", {
    session: false,
  })
);

router.get(
  "/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  handleGoogleCallback
);

// POST /auth/refresh -> 토큰 재발급
router.post("/refresh", handleRefreshToken);

// POST /auth/logout -> 로그아웃: 서버 측 리프레시 토큰 무효화(Nullify) 및 쿠키 삭제
router.post("/logout", handleLogout);

export default router;
