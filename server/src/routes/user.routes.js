import { Router } from "express";
import { getMyFeatures } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me/features", verifyJWT, getMyFeatures);

export default router;
