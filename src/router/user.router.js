import { Router } from "express";

import { handleUserSignUp } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", handleUserSignUp);

export default router;
