import {app,server} from  "./lib/socket.js";
import 'dotenv/config';
import connectdb from "./lib/db.js"; 
import mongoose from "mongoose";
import express from "express";
const Port=process.env.PORT;
import authroutes from "./Routes/authentication.routes.js";
import statsroutes from "./Routes/stats.routes.js";
import leaderboardRoutes from "./Routes/leaderboard.routes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middlewares/auth.middleware.js";

app.use(cors({
  origin: "http://localhost:5173",//Vite frontend URL
  credentials: true,               // Allows cookies/headers to pass
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/Stats",statsroutes);
app.use("/api/leaderboard", leaderboardRoutes);

connectdb()
  .then(() => {
    console.log("MongoDB connected ");
    server.listen(Port, () => {
      console.log(`Server running on port ${Port}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected ");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });  