import { Router } from "express";

import { handleStoreCreate } from "../controllers/store.controller.js";

import {
  createStoreReqHandler,
  validateCreateStoreReq,
} from "../middleware/validation/store.validation.js";

const router = Router();

router.post(
  "/signup",
  validateCreateStoreReq,
  createStoreReqHandler,
  handleStoreCreate
);

export default router;
