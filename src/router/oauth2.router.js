import { Router } from "express";
import passport from "passport";
import { handleRefreshToken, handleGoogleCallback } from "../controllers/oauth.controller.js";

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

// POST /oauth2/refresh -> 토큰 재발급
router.post("/refresh", handleRefreshToken);

export default router;
