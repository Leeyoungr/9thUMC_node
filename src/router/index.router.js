import { Router } from "express";
import userRouter from "./user.router.js";
import storeRouter from "./store.router.js";
import missionRouter from "./mission.router.js";

const router = Router();

router.use("/users", userRouter);
router.use("/stores", storeRouter);
router.use("/missions", missionRouter);

export default router;
