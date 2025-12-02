import { Router } from "express";
import passport from "passport";
import { handleRefreshToken } from "../controllers/oauth.controller.js";

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
  (req, res) => {
    const tokens = req.user;

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "Google 로그인 성공!",
        tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      },
    });
  }
);

// POST /oauth2/refresh -> 토큰 재발급
router.post("/refresh", handleRefreshToken);

export default router;
