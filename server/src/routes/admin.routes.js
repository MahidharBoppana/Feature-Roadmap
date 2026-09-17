import express from "express";
import { updateFeatureStatus } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.patch(
  "/features/:featureId/status",
  verifyJWT,
  requireRole("admin"),
  updateFeatureStatus,
);

export default router;
