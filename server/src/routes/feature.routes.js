import express from "express";

import {
  createFeature,
  getFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
  voteFeature,
  unvoteFeature,
} from "../controllers/feature.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, getFeatures);

router.get("/:featureId", getFeatureById);

router.post("/", verifyJWT, createFeature);

router.patch("/:featureId", verifyJWT, updateFeature);

router.delete("/:featureId", verifyJWT, deleteFeature);

router.post("/:featureId/vote", verifyJWT, voteFeature);

router.delete("/:featureId/vote", verifyJWT, unvoteFeature);

export default router;
