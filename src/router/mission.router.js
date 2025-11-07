import { Router } from "express";
import { handleCreateUserMission } from "../controllers/userMission.controller.js";
import {
  createUserMissionReqHandler,
  validateCreateUserMissionReq,
} from "../middleware/validation/mission.validation.js";

const router = Router();

// POST /api/v1/missions/:missionId -> 사용자 미션 생성
router.post("/:missionId", validateCreateUserMissionReq, createUserMissionReqHandler, handleCreateUserMission);

export default router;
