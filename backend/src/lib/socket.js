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

// Track player completions per room (module-level so all connections share it)
const roomCompletions = {};
const REQUIRED_PLAYERS = {
  "1v1": 2,
  "1v2": 3,
  "1v3": 4,
  "1v4": 5
};

// Text generation logic - same as frontend sentence generator
const wordsArray = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "cat", "sat", "mat",
  "run", "jump", "play", "sing", "dance", "swim", "fly", "walk", "talk", "sleep",
  "eat", "drink", "read", "write", "draw", "paint", "build", "create", "learn",
  "teach", "help", "care", "love", "hate", "like", "want", "need", "give", "take",
  "sun", "moon", "star", "sky", "sea", "land", "tree", "flower", "bird", "fish",
  "car", "bus", "train", "plane", "ship", "house", "school", "work", "game", "fun",
  "day", "night", "morning", "evening", "time", "year", "week", "month", "hour",
  "red", "blue", "green", "yellow", "black", "white", "big", "small", "fast", "slow",
  "hot", "cold", "wet", "dry", "new", "old", "good", "bad", "happy", "sad", "angry"
];

function randomWord() {
  return wordsArray[Math.floor(Math.random() * wordsArray.length)];
}

function generateLine() {
  const targetLength = 43;
  let line = "";

  while (line.length < targetLength) {
    const word = randomWord();
    if (line.length === 0) {
      line = word;
    } else {
      const newLine = line + " " + word;
      if (newLine.length <= targetLength) {
        line = newLine;
      } else {
        break;
      }
    }
  }

  while (line.length < targetLength - 5) {
    const word = randomWord();
    const newLine = line + " " + word;
    if (newLine.length <= targetLength) {
      line = newLine;
    } else {
      break;
    }
  }

  return line;
}

function generateGameText() {
  const lines = [];
  for (let i = 0; i < 3; i++) {
    lines.push(generateLine());
  }
  return lines.join(" ");
}

function generateAdditionalText() {
  const lines = [];
  for (let i = 0; i < 2; i++) { // Generate 2 additional lines
    lines.push(generateLine());
  }
  return lines.join(" ");
}

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

      // Generate one text for all players in this match
      const gameText = generateGameText();

      players.forEach((player) => {
        player.join(roomId);
        player.emit("match_found", {
          roomId,
          mode: selectedMode,
          timer: 30,  // Always 30 seconds for multiplayer
          text: gameText  // Same text for all players
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

  socket.on("request_more_text", ({ roomId }) => {
    // Generate additional text for all players in the room
    const additionalText = generateAdditionalText();

    // Send the additional text to all players in the room
    io.to(roomId).emit("additional_text", {
      text: additionalText
    });
  });

  socket.on("player_completed", ({ roomId, wpm }) => {
    console.log(`🏁 Player ${socket.id} completed with WPM: ${wpm} in room: ${roomId}`);

    // Initialize room completions if not exists (shared across connections)
    if (!roomCompletions[roomId]) {
      roomCompletions[roomId] = {};
    }

    // Store player's completion data
    roomCompletions[roomId][socket.id] = {
      wpm: wpm,
      completedAt: Date.now()
    };

    // Get all players in the room
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size === 2) {
      // Check if both players have completed
      const playerIds = Array.from(room);
      const bothCompleted = playerIds.every(playerId => roomCompletions[roomId][playerId] !== undefined);

      if (bothCompleted) {
        console.log('🎯 Both players completed! Determining winner...');

        const player1 = playerIds[0];
        const player2 = playerIds[1];
        const completion1 = roomCompletions[roomId][player1];
        const completion2 = roomCompletions[roomId][player2];

        let winner, loser, winnerWPM, loserWPM;

        // First completed wins, or higher WPM if completed at same time
        if (completion1.completedAt < completion2.completedAt) {
          winner = player1;
          loser = player2;
          winnerWPM = completion1.wpm;
          loserWPM = completion2.wpm;
        } else if (completion2.completedAt < completion1.completedAt) {
          winner = player2;
          loser = player1;
          winnerWPM = completion2.wpm;
          loserWPM = completion1.wpm;
        } else {
          // Same completion time - higher WPM wins
          if (completion1.wpm > completion2.wpm) {
            winner = player1;
            loser = player2;
            winnerWPM = completion1.wpm;
            loserWPM = completion2.wpm;
          } else {
            winner = player2;
            loser = player1;
            winnerWPM = completion2.wpm;
            loserWPM = completion1.wpm;
          }
        }

        console.log(`🏆 Winner: ${winner} (${winnerWPM} WPM) vs Loser: ${loser} (${loserWPM} WPM)`);

        // Emit winner result to both players
        io.to(roomId).emit("game_result", {
          winner: winner,
          loser: loser,
          winnerWPM: winnerWPM,
          loserWPM: loserWPM
        });

        // Clean up room completions
        delete roomCompletions[roomId];
      } else {
        // One player completed, other still typing - notify the completed player to wait
        console.log(`⏳ Player ${socket.id} completed, waiting for opponent`);
        socket.emit("waiting_for_opponent_completion");
      }
    }
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