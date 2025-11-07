import { Router } from "express";

import { handleStoreCreate } from "../controllers/store.controller.js";

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
  validateCreateReviewReq,
  ensureStoreExists,
  createReviewReqHandler,
  handleCreateStoreReview
);

export default router;
