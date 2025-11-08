import { Router } from "express";
import { handleCompleteUserMission, handleCreateUserMission } from "../controllers/userMission.controller.js";
import { ensureUserMissionExists } from "../middleware/mission.middleware.js";
import { userMissionReqHandler, validateCreateUserMissionReq } from "../middleware/validation/mission.validation.js";

const router = Router();

// POST /api/v1/missions/:missionId -> 사용자 미션 생성
router.post("/:missionId", validateCreateUserMissionReq, userMissionReqHandler, handleCreateUserMission);

// PATCH /api/v1/missions/:userMissionId -> 사용자 미션 상태 완료 처리
router.patch("/:userMissionId", ensureUserMissionExists, userMissionReqHandler, handleCompleteUserMission);

export default router;
