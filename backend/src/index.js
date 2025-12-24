import {app,server} from  "./lib/socket.js";
import 'dotenv/config';
import connectdb from "./lib/db.js"; 
import mongoose from "mongoose";
import express from "express";
const Port=process.env.PORT;
import authroutes from "./Routes/authentication.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend URL
  credentials: true,               // Allows cookies/headers to pass
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authroutes);

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