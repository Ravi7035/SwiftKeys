import express from "express";
import {signup,login,logout,checkauth,updateprofile} from "../Controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";  
const router = express.Router();
router.post("/signup", signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/check",protectRoute, checkauth);
router.put("/updateprofile",protectRoute,updateprofile);
export default router;
