import { Router } from "express";

import { handleStoreCreate } from "../controllers/store.controller.js";

import {
  createStoreReqHandler,
  validateCreateStoreReq,
} from "../middleware/validation/store.validation.js";

import { handleCreateStoreReview } from "../controllers/review.controller.js";
import { ensureStoreExists } from "../middleware/store.middleware.js";
import {
  createReviewReqHandler,
  validateCreateReviewReq,
} from "../middleware/validation/review.validation.js";

const router = Router();

router.post(
  "/signup",
  validateCreateStoreReq,
  createStoreReqHandler,
  handleStoreCreate
);

router.post(
  "/:storeId/reviews",
  validateCreateReviewReq,
  ensureStoreExists,
  createReviewReqHandler,
  handleCreateStoreReview
);

export default router;
