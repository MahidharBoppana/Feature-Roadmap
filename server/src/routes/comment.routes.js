import express from "express";

import {
  createComment,
  getFeatureComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/features/:featureId/comments", getFeatureComments);

router.post("/features/:featureId/comments", verifyJWT, createComment);

router.patch("/comments/:commentId", verifyJWT, updateComment);

router.delete("/comments/:commentId", verifyJWT, deleteComment);

export default router;
