import express from "express";
import { getLeaderboard } from "../Controllers/leaderboard.controller.js";

const router = express.Router();

// Public route - anyone can view leaderboard
router.get("/", getLeaderboard);

export default router;
