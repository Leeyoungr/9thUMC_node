import { Router } from "express";
import { handleListStoreMissions, handleListStoreReviews, handleStoreCreate } from "../controllers/store.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";

import { createStoreReqHandler, validateCreateStoreReq } from "../middleware/validation/store.validation.js";

import { handleCreateStoreReview } from "../controllers/review.controller.js";
import { ensureStoreExists } from "../middleware/store.middleware.js";
import { createReviewReqHandler, validateCreateReviewReq } from "../middleware/validation/review.validation.js";

const router = Router();

// POST /api/v1/stores/signup -> 매장 등록
router.post("/signup", validateCreateStoreReq, createStoreReqHandler, handleStoreCreate);

// POST /api/v1/stores/:storeId/reviews -> 매장 리뷰 생성
router.post(
  "/:storeId/reviews",
  isLogin,
  validateCreateReviewReq,
  ensureStoreExists,
  createReviewReqHandler,
  handleCreateStoreReview
);

// GET /api/v1/stores/:storeId/reviews -> 매장 리뷰 목록 조회
router.get("/:storeId/reviews", ensureStoreExists, handleListStoreReviews);
// GET /api/v1/stores/:storeId/missions -> 매장 미션 목록 조회
router.get("/:storeId/missions", ensureStoreExists, handleListStoreMissions);

export default router;
