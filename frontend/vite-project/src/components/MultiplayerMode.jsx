import { useEffect, useState, useRef } from "react";
import { Loader2, User, Users, Trophy, Clock } from "lucide-react";
import socket from "../socket.js";
import { useGameStore } from "../store/Gamestore.js";
import SentenceGenerator from "./SentenceGenerator.jsx";
import { useStatsStore } from "../store/Stats.store.js";

const MultiplayerMode = () => {
  const {
    setOpponentProgress,
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
    countdown,
    gameDuration,
    startgame,
    setCountDown,
    stopgame,
    Winner,
    setWinner,
    CorrectChars,
    TotalTypedChars
  } = useGameStore();
  const{updateStats}=useStatsStore();

  const [selectedMode, setSelectedMode] = useState("1v1");
  const [opponents, setOpponents] = useState({});
  
  // Refs to track what we last sent to the server
  const lastSentProgress = useRef(-1); 
  const lastSentWpm = useRef(-1);

  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  useEffect(() => {
    const handleWaiting = () => setGameState("waiting");
    const handleOnline = (data) => setOnlineUsers(data);
    
    const handleMatchFound = (data) => {
      // 1. Reset Game Data
      setCountDown(gameDuration);
      setGameData(data);
      setOpponents({});
      
      // 2. FORCE Reset WPM to 0 so we don't send old scores
      setLiveWPM(0); 

      // 3. Reset Refs so the new game starts clean
      lastSentProgress.current = -1;
      lastSentWpm.current = -1;

      startgame(); 
    };

    const handleOpponentProgress = (data) => {
      setOpponents((prev) => ({
        ...prev,
        [data.playerId]: {
          wpm: data.wpm || 0,
          progress: data.progress || 0
        }
      }));
    };

    const handleOpponentLeft = (data) => {
      setOpponents((prev) => {
        const newOpponents = { ...prev };
        delete newOpponents[data.playerId];
        return newOpponents;
      });
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
  }, [gameDuration]); 
  // Timer Logic
  useEffect(() => {
    let interval;
    if (GameState === "playing" && countdown > 0) {
      interval = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && GameState === "playing") {
      stopgame("time");
      setGameState("finished");
      
      let HighestWPM = LiveWPM;
      let WinningPlayer = "You";
      let isTie = false;

      Object.entries(opponents).forEach(([id, data], index) => {
        if (data.wpm > HighestWPM) {
          HighestWPM = data.wpm;
          WinningPlayer = `Player ${index + 1}`;
          isTie = false;
        } else if (data.wpm === HighestWPM && HighestWPM === LiveWPM) {
          // It's a tie
          WinningPlayer = 'tied';
          isTie = true;
        }
      });

      console.log("Game result - Your WPM:", LiveWPM, "Highest opponent WPM:", HighestWPM, "Winner:", WinningPlayer, "Is Tie:", isTie);
      setWinner(WinningPlayer);

      // Calculate accuracy for stats update
      const accuracy = TotalTypedChars > 0 ? (CorrectChars / TotalTypedChars) * 100 : 0;

      console.log("Updating multiplayer stats:", {
        Wpm: Math.round(LiveWPM),
        Accuracy: Math.round(accuracy * 10) / 10,
        type: "multiplayer",
        Winner: WinningPlayer
      });

      updateStats({
        Wpm: Math.round(LiveWPM),
        Accuracy: Math.round(accuracy * 10) / 10,
        type: "multiplayer",
        Winner: WinningPlayer
      })
    }
    return () => clearInterval(interval);
  }, [GameState, countdown, setCountDown, stopgame, opponents, LiveWPM]);


  useEffect(() => {
    if (GameState !== "playing" || !text) return;

    const percent = Math.floor((typedChars.length / text.length) * 100);
    const currentWPM = LiveWPM || 0;
    const hasProgressChanged = percent !== lastSentProgress.current;
    const hasWpmChanged = Math.abs(currentWPM - lastSentWpm.current) > 2;

    if (hasProgressChanged || hasWpmChanged) {
        socket.emit("type_progress", { 
          roomId, 
          progress: percent, 
          wpm: currentWPM
        });
        
        lastSentProgress.current = percent;
        lastSentWpm.current = currentWPM;
    }

  }, [typedChars, GameState, roomId, text, LiveWPM]);

  const handleFindMatch = () => {
    socket.emit("find_match", { mode: selectedMode });
    setGameState("searching");
  };

  const cancelMatch = () => {
    socket.emit("cancel_match");
    setGameState("Idle");
  };

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
      {GameState === "Idle" && (
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl text-center mb-3">Multiplayer</h1>
          <p className="text-center text-gray-500 mb-8">
            Select a mode and start racing
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <ModeCard mode="1v1" label="1 vs 1" icon={User} />
            <ModeCard mode="1v2" label="1 vs 2" icon={Users} />
            <ModeCard mode="1v3" label="1 vs 3" icon={Users} />
          </div>

          <button
            onClick={handleFindMatch}
            className="w-full py-4 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-colors"
          >
            Find Match
          </button>

          <div className="mt-6 text-center text-gray-500">
            Online: <span className="text-green-500">●</span> {OnlineUsers} Players
          </div>
        </div>
      )}  

      {(GameState === "searching" || GameState === "waiting") && (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-400" />
          <h2 className="text-xl">Searching for opponent...</h2>
          <button
            onClick={cancelMatch}
            className="border border-gray-700 px-6 py-2 rounded-full text-gray-400 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {GameState === "playing" && (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          
          <div className="w-full flex items-end justify-between px-4 pb-4 border-b border-gray-800 relative">
            
            <div className="flex-1 text-left">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                YOU
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-yellow-400 font-mono">
                  {LiveWPM}
                </span>
                <span className="text-sm font-bold text-yellow-600">WPM</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end pb-2 px-8">
               <div className="flex items-center gap-2 text-gray-400 mb-1">
                 <Clock className="w-4 h-4" />
               </div>
               <span className={`text-4xl font-mono font-bold ${countdown < 10 ? "text-red-500" : "text-white"}`}>
                 {countdown}
               </span>
            </div>

            <div className="flex-1 text-right flex flex-col items-end gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                OPPONENTS
              </span>
              
              {Object.keys(opponents).length === 0 && (
                <span className="text-gray-600 text-sm italic">Waiting for input...</span>
              )}

              {Object.entries(opponents).map(([id, data], index) => (
                <div key={id} className="flex items-baseline gap-2 flex-row-reverse">
                  <span className="text-4xl font-black text-yellow-400 font-mono">
                    {data.wpm}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    P{index + 1}
                  </span>
                </div>
              ))}
            </div>

          </div>

          <SentenceGenerator />
        </div>
      )}
 
      {/* --- GAME OVER MODAL --- */}
      {GameState === "finished" && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-gray-800 p-10 rounded-2xl text-center max-w-lg w-full shadow-2xl relative overflow-hidden">
            
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[100px] -z-10 ${
              Winner === "You" ? "bg-yellow-500/20" : "bg-red-500/20"
            }`}></div>

            <h2 className="text-4xl font-black italic tracking-tighter mb-2 text-white">
              TIME'S UP!
            </h2>
            
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-8">
              The race has ended
            </p>

            <div className="py-8 border-y border-gray-800 mb-8">
              <span className="text-xs text-gray-500 uppercase tracking-widest">WINNER</span>
              <div className={`text-7xl font-black mt-2 font-mono drop-shadow-lg ${
                Winner === "You" ? "text-yellow-400" : "text-white"
              }`}>
                {Winner === "You" ? "YOU" : Winner}
              </div>
              {Winner !== "You" && (
                <p className="text-gray-500 text-sm mt-2">Better luck next time</p>
              )}
            </div>

            <button 
              onClick={() => {
                  setGameState("Idle");
                  setWinner(null);
                  setOpponents({});
                  setLiveWPM(0); // Reset local WPM on exit too
              }}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all uppercase tracking-wider transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Return to Lobby
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerMode;