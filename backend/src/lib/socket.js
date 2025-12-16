import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let onlineUsers = 0;
let waitingPlayer = null;

const GAME_TEXT =
  "the golden sun dipped below the horizon painting the sky in shades of pink and orange";

io.on("connection", (socket) => {
  onlineUsers++;
  io.emit("No of players", { TotalNumberOnline: onlineUsers });

  socket.on("find_match", () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) return;

    if (waitingPlayer) {
      const roomId = `room-${waitingPlayer.id}-${socket.id}`;
      socket.join(roomId);
      waitingPlayer.join(roomId);

      io.to(roomId).emit("match_found", {
        roomId,
        text: GAME_TEXT,
      });

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit("waiting_for_opponent");
    }
  });

  socket.on("cancel_match", () => {
    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
    }
  });

  socket.on("type_progress", ({ roomId, progress }) => {
    socket.to(roomId).emit("opponent_progress", { progress });
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("No of players", { TotalNumberOnline: onlineUsers });

    if (waitingPlayer?.id === socket.id) {
      waitingPlayer = null;
    }

    socket.rooms.forEach((room) => {
      socket.to(room).emit("opponent_left");
    });
  });
});

export { server,app,io };
