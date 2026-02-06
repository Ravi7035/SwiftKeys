import { useEffect, useState, useRef } from "react";
import { User, Users, Trophy, ChevronRight } from "lucide-react";
import socket from "../socket.js";
import { useGameStore } from "../store/Gamestore.js";
import SentenceGenerator from "./SentenceGenerator.jsx";
import { Spinner } from "./ui/spinner.jsx";

const MultiplayerMode = () => {
  const {
    setGameData,
    GameState,
    setGameState,
    roomId,
    typedChars,
    text,
    setOnlineUsers,
    OnlineUsers,
    LiveWPM,
    setLiveWPM,
    startgame,
    stopgame,
    Winner,
    setWinner,
  } = useGameStore();

  const [selectedMode, setSelectedMode] = useState("1v1");
  const [opponents, setOpponents] = useState({});
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  const lastSentProgress = useRef(-1); 
  const lastSentWpm = useRef(-1);

  const myProgress = text ? Math.floor((typedChars.length / text.length) * 100) : 0;

  useEffect(() => {
    if (!socket.connected) socket.connect();
    
    const handleWaiting = () => setGameState("waiting");
    const handleOnline = (data) => setOnlineUsers(data);
    const handleMatchFound = (data) => {
      setGameData(data);
      setOpponents({});
      setWaitingForOpponent(false);
      setGameResult(null);
      setLiveWPM(0);
      lastSentProgress.current = -1;
      lastSentWpm.current = -1;
      startgame();
    };

    const handleOpponentProgress = (data) => {
      setOpponents((prev) => ({
        ...prev,
        [data.playerId]: { wpm: data.wpm || 0, progress: data.progress || 0 }
      }));
    };

    const handleGameResult = (result) => {
      setGameResult(result);
      setWaitingForOpponent(false);
      setGameState("finished");
      stopgame();
      setWinner(result.winner === socket.id ? "You" : "Opponent");
    };

    socket.on("waiting_for_opponent", handleWaiting);
    socket.on("No of players", handleOnline);
    socket.on("match_found", handleMatchFound);
    socket.on("opponent_progress", handleOpponentProgress);
    socket.on("game_result", handleGameResult);

    return () => {
      socket.off("waiting_for_opponent");
      socket.off("No of players");
      socket.off("match_found");
      socket.off("opponent_progress");
      socket.off("game_result");
    };
  }, []);

  useEffect(() => {
    if (GameState !== "playing" || !text) return;
    const currentWPM = LiveWPM || 0;
    if (myProgress !== lastSentProgress.current || Math.abs(currentWPM - lastSentWpm.current) > 2) {
        socket.emit("type_progress", { roomId, progress: myProgress, wpm: currentWPM });
        lastSentProgress.current = myProgress;
        lastSentWpm.current = currentWPM;
    }
  }, [typedChars, GameState, roomId, text, LiveWPM, myProgress]);

  const ModeCard = ({ mode, label, icon: Icon }) => (
    <button
      onClick={() => setSelectedMode(mode)}
      className={`flex flex-col items-center cursor-pointer justify-center py-5 md:py-7 rounded-xl border-2 transition-all duration-200 ${
        selectedMode === mode
          ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-sm"
          : "border-white/5 bg-[#0e0e0e] text-gray-500 hover:border-white/10"
      }`}
    >
      <Icon className="w-5 h-5 md:w-7 md:h-7 mb-2" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md md:max-w-xl mx-auto">
        
        {/* --- LOBBY --- */}
        {GameState === "Idle" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-center text-gray-100">
              Multiplayer
            </h1>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <ModeCard mode="1v1" label="1v1" icon={User} />
              <ModeCard mode="1v2" label="1v2" icon={Users} />
              <ModeCard mode="1v3" label="1v3" icon={Users} />
            </div>

            <button
              onClick={() => socket.emit("find_match", { mode: selectedMode })}
              className="w-full py-4 md:py-5 bg-yellow-400 text-black rounded-xl font-bold uppercase flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all active:scale-[0.98] text-sm md:text-lg shadow-lg"
            >
              Find Match <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {OnlineUsers} Online
            </div>
          </div>
        )}

        {/* --- QUEUE --- */}
        {(GameState === "searching" || GameState === "waiting") && (
          <div className="flex flex-col items-center py-12 space-y-6">
            <Spinner className="w-12 h-12 text-yellow-400" />
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Searching for match...</h2>
            <button
              onClick={() => { socket.emit("cancel_match"); setGameState("Idle"); }}
              className="text-[15px] font-bold text-white-600 uppercase border-b border-gray-800 hover:text-red-500 cursor-pointer   pb-1"
            >
              Cancel Match
            </button>
          </div>
        )}

        {/* --- GAMEPLAY --- */}
        {GameState === "playing" && (
  <div className="animate-in fade-in duration-500 space-y-4 sm:space-y-6">
  {/* Race Track Container */}
  <div className="bg-[#0e0e0e] p-4 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl border border-white/5 space-y-4 sm:space-y-6">
    
    {/* User Progress - Elevated Visuals */}
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[10px] sm:text-xs font-bold uppercase tracking-wider">
        <span className="text-yellow-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          You
        </span>
        <span className="text-gray-200 tabular-nums">{LiveWPM} <span className="text-[8px] opacity-60">WPM</span></span>
      </div>
      <div className="h-2 sm:h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
        <div 
          className="h-full bg-yellow-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(250,204,21,0.4)]" 
          style={{ width: `${myProgress}%` }} 
        />
      </div>
    </div>

    {/* Separator for clarity on mobile */}
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

    {/* Opponents Grid */}
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      {Object.entries(opponents).map(([id, data], idx) => (
        <div key={id} className="space-y-1.5">
          <div className="flex justify-between text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-wide">
            <span className="truncate max-w-[120px]">Opponent {idx + 1}</span>
            <span className="tabular-nums">{data.wpm} WPM</span>
          </div>
          <div className="h-1 sm:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600/80 transition-all duration-700 ease-out" 
              style={{ width: `${data.progress}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Input Area */}
  <SentenceGenerator />
</div>
        )}

        {/* --- RESULTS --- */}
        {GameState === "finished" && (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
            <Trophy className={`w-12 h-12 md:w-16 md:h-16 mx-auto ${Winner === "You" ? "text-yellow-400" : "text-gray-700"}`} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                {Winner === "You" ? "Victory" : "Race Complete"}
              </h2>
              <div className="flex justify-center gap-10 md:gap-16 mt-6">
                <div>
                  <div className="text-xl md:text-3xl font-black">{gameResult?.winnerWPM || 0}</div>
                  <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase">Winner</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-black text-gray-400">{gameResult?.loserWPM || 0}</div>
                  <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase">Your WPM</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setGameState("Idle"); setWinner(null); setOpponents({}); }}
              className="w-full py-4 md:py-5 bg-white text-black font-bold rounded-xl md:rounded-2xl uppercase text-xs md:text-sm transition-transform active:scale-95 shadow-lg"
            >
              Back to Lobby
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MultiplayerMode;