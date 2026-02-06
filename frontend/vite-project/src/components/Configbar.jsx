import {
  Clock, Target, CloudFog, Skull, Ghost, 
  Ban, BookOpen, ChevronLeft, ChevronRight
} from "lucide-react";
import { useGameStore } from "../store/Gamestore";

const ConfigBar = () => {
  const {
    gameMode, setGameMode, gameDuration, setGameDuration,
    difficulty, setDifficulty, savedDifficulty, setSavedDifficulty,
    deathWPM, setDeathWPM, resetGame
  } = useGameStore();

  const difficultyOptions = [
    { id: "none", label: "None", icon: Ban, desc: "Standard typing" },
    { id: "fog", label: "Fog", icon: CloudFog, desc: "Blurry text" },
    { id: "ghost", label: "Ghost", icon: Ghost, desc: "Race the ghost" },
    { id: "death", label: "Death", icon: Skull, desc: "Instant fail" },
  ];

  // RESPONSIVE CLASS: Large on desktop, slim on mobile
  const btnClass = (isActive) => `
    flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 rounded-lg select-none
    gap-0.5 md:gap-1.5 
    py-1.5 md:py-3 px-1 md:px-4 
    text-[10px] md:text-[14px] font-black uppercase tracking-wider
    ${isActive 
      ? "bg-yellow-500 text-black shadow-lg scale-[1.02]" 
      : "bg-neutral-800/90 text-white hover:bg-neutral-700"}
  `;

  const handleDifficultyChange = (id) => {
    setDifficulty(id);
    setSavedDifficulty(id);
    id === 'ghost' ? setGameMode('death') : setGameMode('challenge');
    resetGame();
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 md:gap-3 mb-6">
      
      {/* --- MAIN MODES: Responsive Max-Width --- */}
      <div className="w-full max-w-[280px] md:max-w-lg grid grid-cols-3 gap-1 md:gap-2 bg-neutral-900 p-1 md:p-1.5 rounded-xl border border-neutral-800">
        <button onClick={() => { setGameMode("casual"); setDifficulty("none"); resetGame(); }} className={btnClass(gameMode === "casual")}>
          <BookOpen className="w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={3} /> <span>Casual</span>
        </button>
        <button onClick={() => { setGameMode("time"); setDifficulty("none"); resetGame(); }} className={btnClass(gameMode === "time")}>
          <Clock className="w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={3} /> <span>Time</span>
        </button>
        <button onClick={() => { setDifficulty(savedDifficulty); setGameMode(savedDifficulty === 'ghost' ? 'death' : 'challenge'); resetGame(); }} 
          className={btnClass(gameMode === "challenge" || gameMode === "death")}>
          <Target className="w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={3} /> <span>Challenge</span>
        </button>
      </div>

      {/* --- SUB-CONFIG: High Contrast & Compact --- */}
      {gameMode !== "casual" && (
        <div className="w-full max-w-[280px] md:max-w-lg bg-neutral-900/95 p-2 md:p-4 rounded-xl border border-neutral-800 shadow-xl">
          
          {gameMode === "time" ? (
            <div className="flex items-center justify-between px-1 md:px-2">
              <span className="text-[9px] md:text-xs font-black text-neutral-400 uppercase tracking-widest">Time</span>
              <div className="flex gap-1 md:gap-2">
                {[15, 30, 60].map((val) => (
                  <button key={val} onClick={() => { setGameDuration(val); resetGame(); }}
                    className={`px-3 md:px-5 py-1 md:py-2 cursor-pointer rounded-md font-black text-[11px] md:text-sm transition-all border-2 ${gameDuration === val ? "bg-white border-white text-black" : "border-neutral-800 text-white hover:border-neutral-600"}`}>
                    {val}s
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 md:gap-2">
              {difficultyOptions.map((opt) => (
                <div key={opt.id} className="relative group">
                  {/* --- TOOLTIP: Visible on Hover --- */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-yellow-500 text-black text-[8px] md:text-[10px] font-black uppercase px-2 py-1 rounded shadow-xl whitespace-nowrap border border-black italic">
                      {opt.desc}
                    </div>
                  </div>

                  <button onClick={() => handleDifficultyChange(opt.id)}
                    className={`w-full flex flex-col items-center cursor-pointer justify-center gap-1 md:gap-1.5 py-1.5 md:py-2.5 rounded-lg transition-all border-2 ${difficulty === opt.id ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" : "border-transparent text-white hover:bg-neutral-800"}`}>
                    <opt.icon className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                    <span className="text-[8px] md:text-[11px] font-black uppercase">{opt.label}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* --- GHOST SPEED: Responsive Sizing --- */}
          {difficulty === "ghost" && (
            <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-neutral-800 flex items-center justify-between px-1 md:px-2">
              <span className="text-[9px] md:text-xs font-black text-neutral-400 uppercase tracking-widest">Ghost Speed</span>
              <div className="flex items-center gap-1 md:gap-2 bg-black rounded-lg px-2 py-1">
                <button onClick={() => { setDeathWPM(Math.max(50, deathWPM - 10)); resetGame(); }} className="text-white"><ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} /></button>
                <span className="text-xs md:text-base font-black text-yellow-500 italic tabular-nums w-8 md:w-12 text-center">{deathWPM}</span>
                <button onClick={() => { setDeathWPM(Math.min(120, deathWPM + 10)); resetGame(); }} className="text-white"><ChevronRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigBar;