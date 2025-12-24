import express from "express";
import {signup,login,logout,checkauth} from "../Controllers/auth.controller.js"
import { protectroute } from "../middlewares/auth.middleware.js";  
const router = express.Router();
router.post("/signup", signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/check",protectroute, checkauth);
export default router;
