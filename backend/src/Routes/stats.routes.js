import express from "express";
import { UpdateStats, RetrieveStats } from "../Controllers/stats.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/", protectRoute, UpdateStats);
router.get("/", protectRoute, RetrieveStats);
export default router;