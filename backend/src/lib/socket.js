import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


const server = createServer(app);



const io = new Server(server, {
  cors:{
    origin:"http://localhost:5173",
    credentials: true
  }
});

let onlineUsers = 0;

const queues = {
  "1v1": [],
  "1v2": [],
  "1v3": [],
  "1v4": []
};

const REQUIRED_PLAYERS = {
  "1v1": 2,
  "1v2": 3,
  "1v3": 4,
  "1v4": 5
};

const GAME_TEXT =
  "the golden sun dipped below the horizon painting the sky in shades of pink and orange the golden sun dipped below the horizon painting the sky in shades of pink and orange";

io.on("connection", (socket) => {

  console.log("socket connected",socket.id);
  onlineUsers++;
  io.emit("No of players", { TotalNumberOnline: onlineUsers });

  socket.on("find_match", ({ mode }) => {
    const selectedMode = mode || "1v1";

    const alreadyInQueue = queues[selectedMode].find(p => p.id === socket.id);
    if (alreadyInQueue) return;

    queues[selectedMode].push(socket);

    if (queues[selectedMode].length >= REQUIRED_PLAYERS[selectedMode]) {
      const players = queues[selectedMode].splice(0, REQUIRED_PLAYERS[selectedMode]);
      const roomId = `room-${players[0].id}-${Date.now()}`;

      players.forEach((player) => {
        player.join(roomId);
        player.emit("match_found", {
          roomId,
          text: GAME_TEXT,
          mode: selectedMode
        });
      });
    } else {
      socket.emit("waiting_for_opponent");
    }
  });

  socket.on("cancel_match", () => {
    for (const mode in queues) {
      queues[mode] = queues[mode].filter((s) => s.id !== socket.id);
    }
  });

  socket.on("type_progress", ({ roomId, progress, wpm }) => {
    socket.to(roomId).emit("opponent_progress", { 
      playerId: socket.id, 
      progress, 
      wpm 
    });
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("No of players", { TotalNumberOnline: onlineUsers });

    for (const mode in queues) {
      queues[mode] = queues[mode].filter((s) => s.id !== socket.id);
    }

    socket.rooms.forEach((room) => {
      socket.to(room).emit("opponent_left", { playerId: socket.id });
    });
  });
});

export { server, app, io };