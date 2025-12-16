import { useEffect, useState, useRef } from "react";
import { Loader2, User, Users, Trophy } from "lucide-react";
import socket from "../socket.js";
import { useGameStore } from "../store/Gamestore.js";
import SentenceGenerator from "./SentenceGenerator.jsx";

const MultiplayerMode = () => {
  const {
    setOpponentProgress,
    OpponentProgress,
    setGameData,
    GameState,
    setGameState,
    roomId,
    typedChars,
    text,
    setOnlineUsers,
    OnlineUsers,
  } = useGameStore();

  const [selectedMode, setSelectedMode] = useState("1v1");
  const lastSentProgress = useRef(0);

  // Connect socket once
  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  // Socket listeners
  useEffect(() => {
    const handleWaiting = () => setGameState("waiting");
    const handleOnline = (data) => setOnlineUsers(data);
    const handleMatchFound = (data) => setGameData(data);
    const handleOpponentProgress = (data) =>
      setOpponentProgress(data.progress);
    const handleOpponentLeft = () => {
      alert("Opponent left the match");
      setGameState("Idle");
    };

    socket.on("waiting_for_opponent", handleWaiting);
    socket.on("No of players", handleOnline);
    socket.on("match_found", handleMatchFound);
    socket.on("opponent_progress", handleOpponentProgress);
    socket.on("opponent_left", handleOpponentLeft);

    return () => {
      socket.off("waiting_for_opponent", handleWaiting);
      socket.off("No of players", handleOnline);
      socket.off("match_found", handleMatchFound);
      socket.off("opponent_progress", handleOpponentProgress);
      socket.off("opponent_left", handleOpponentLeft);
    };
  }, []);

  // Emit typing progress (throttled)
  useEffect(() => {
    if (GameState !== "playing" || !text) return;

    const percent = Math.floor((typedChars.length / text.length) * 100);

    if (percent !== lastSentProgress.current) {
      socket.emit("type_progress", { roomId, progress: percent });
      lastSentProgress.current = percent;
    }
  }, [typedChars, GameState, roomId, text]);

  const handleFindMatch = () => {
    socket.emit("find_match");
    setGameState("searching");
  };

  const cancelMatch = () => {
    socket.emit("cancel_match");
    setGameState("Idle");
  };

  const myProgress = text
    ? Math.floor((typedChars.length / text.length) * 100)
    : 0;

  const ModeCard = ({ mode, label, icon: Icon }) => (
    <button
      onClick={() => setSelectedMode(mode)}
      className={`p-6 rounded-xl border cursor-pointer transition-all ${
        selectedMode === mode
          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
          : "border-gray-700 text-gray-400 hover:border-gray-500"
      }`}
    >
      <Icon className="w-6 h-6 mb-2 mx-auto" />
      <span className="text-xs uppercase">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {(GameState === "Idle") && (
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl text-center mb-3">Multiplayer</h1>
          <p className="text-center text-gray-500 mb-8">
            Select a mode and start racing
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ModeCard mode="1v1" label="1 vs 1" icon={User} />
            <ModeCard mode="1v2" label="1 vs 2" icon={Users} />
            <ModeCard mode="1v3" label="1 vs 3" icon={Users} />
            <ModeCard mode="1v4" label="1 vs 4" icon={Trophy} />
          </div>

          <button
            onClick={handleFindMatch}
            className="w-full py-4 bg-yellow-400 text-black rounded-xl font-bold"
          >
            Find Match
          </button>

          <div className="mt-6 text-center text-gray-500">
            Online: <span className="text-green-500">●</span> {OnlineUsers}
          </div>
        </div>
      )}

      {(GameState === "searching" || GameState === "waiting") && (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-400" />
          <h2 className="text-xl">Searching for opponent...</h2>
          <button
            onClick={cancelMatch}
            className="border px-6 py-2 rounded-full text-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {GameState === "playing" && (
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>You</span>
              <span>{myProgress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${myProgress}%` }}
              />
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between mb-2 text-gray-400">
              <span>Opponent</span>
              <span>{OpponentProgress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
              <div
                className="h-full bg-gray-500"
                style={{ width: `${OpponentProgress}%` }}
              />
            </div>
          </div>

          <SentenceGenerator />
        </div>
      )}
    </div>
  );
};

export default MultiplayerMode;
