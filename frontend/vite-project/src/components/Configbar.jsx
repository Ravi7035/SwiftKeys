import { 
  Clock, Layers, Timer, Target, 
  CloudFog,Skull, Ghost, Ban, ChevronDown, Code, Zap
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../store/Gamestore";

const ConfigBar = () => {
  const { 
    gameMode, setGameMode, 
    gameDuration, setGameDuration,
    difficulty, setDifficulty,
    savedDifficulty, setSavedDifficulty,
    deathWPM, setDeathWPM, 
    resetGame
  } = useGameStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const difficultyOptions = [
    { id: "none", label: "None", icon: Ban, desc: "Standard mode. No visual distractions." },
    { id: "fog", label: "Fog", icon: CloudFog, desc: "A blurry fog covers the upcoming text." },
    { id: "ghost", label: "Ghost", icon: Ghost, desc: "A cursor moves with custom WPM. If it overtakes you, you lose." },
    { id: "death", label: "Death", icon: Skull, desc: "You will lose if you typed one mistake"},
    { id: "code", label: "Code", icon: Code, desc: "Raw code format with bracket/syntax obstacles."},
  ];

  const currentMod = difficultyOptions.find(opt => opt.id === difficulty) || difficultyOptions[0];
  const isModActive = difficulty !== "normal" && difficulty !== "none";
  
  const showSpeedSlider = difficulty === "ghost";

  const btnClass = (isActive) => `
    px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer
    ${isActive 
      ? "text-yellow-500 bg-neutral-900 shadow-sm" 
      : "text-neutral-300 hover:text-white hover:bg-white/10"
    }
  `;

  const labelClass = "flex items-center gap-2 px-3 border-r border-neutral-700/50 mr-1 text-neutral-500 select-none h-full";

  const handleDifficultyChange = (id) => {
    setDifficulty(id);
    setSavedDifficulty(id);
    setIsDropdownOpen(false);
    
    if (id === 'ghost') setGameMode('death'); 
    else setGameMode('challenge'); 
    
    resetGame();
  };

  const handleChallengeClick = () => {
    setDifficulty(savedDifficulty);
    
    if (savedDifficulty === 'ghost') setGameMode('death');
    else setGameMode('challenge');

    resetGame();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full select-none z-50 transition-all duration-500">
      
      <div className="flex items-center bg-neutral-800 p-1.5 rounded-xl shadow-lg transition-transform duration-500">
        <div className={labelClass}>
          <Layers size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Options
          </span>
        </div>

        <div className="flex items-center gap-1 pl-1">
          <button 
            onClick={() => { setGameMode("time"); setDifficulty("none"); }} 
            className={btnClass(gameMode === "time")}
          >
            <Clock size={14} />
            <span>Time</span>
          </button>
          
          <button 
            onClick={handleChallengeClick} 
            className={btnClass(gameMode === "challenge" || gameMode === "death")}
          >
            <Target size={14} />
            <span>Challenge</span>
          </button>
        </div>
      </div>

      <div className="flex items-center bg-neutral-800 p-1.5 rounded-xl shadow-lg relative transition-transform duration-500">
        
        {gameMode === "time" ? (
          <>
            <div className={labelClass}>
              <Timer size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Time
              </span>
            </div>
            <div className="flex items-center gap-1 pl-1">
              {[15, 30, 60, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setGameDuration(val)}
                  className={btnClass(gameDuration === val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={labelClass}>
              <Target size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Mode
              </span>
            </div>
            
            <div className="relative pl-1" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between gap-3 px-3 py-1.5 cursor-pointer rounded-md text-sm font-bold min-w-[130px] transition-colors
                  ${isDropdownOpen || isModActive
                    ? "text-yellow-500 bg-neutral-900 shadow-sm"
                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <currentMod.icon size={14} />
                  <span>{currentMod.label}</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5">
                  {difficultyOptions.map((opt) => (
                    <div key={opt.id} className="relative group">
                        
                        <button
                          onClick={() => handleDifficultyChange(opt.id)}
                          onMouseEnter={() => setHoveredOption(opt.id)}
                          onMouseLeave={() => setHoveredOption(null)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg w-full text-left transition-colors cursor-pointer 
                            ${difficulty === opt.id 
                              ? "text-yellow-500 bg-neutral-900" 
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                            }
                          `}
                        >
                          <opt.icon size={14} />
                          <span>{opt.label}</span>
                        </button>

                        {hoveredOption === opt.id && (
                            <div className="absolute left-full top-0 ml-3 w-48 p-3 bg-neutral-900 border border-neutral-700/80 rounded-lg shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-[60]">
                                <div className="flex items-center gap-2 mb-1 text-yellow-500">
                                    <opt.icon size={12} />
                                    <span className="text-xs font-bold uppercase">{opt.label}</span>
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    {opt.desc}
                                </p>
                                <div className="absolute top-3 -left-1 w-2 h-2 bg-neutral-900 border-l border-b border-neutral-700/80 transform rotate-45"></div>
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div 
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          showSpeedSlider 
            ? "max-w-[400px] opacity-100 translate-x-0" 
            : "max-w-0 opacity-0 -translate-x-10"
        }`}
      >
        <div className="flex items-center bg-neutral-800 p-1.5 rounded-xl shadow-lg w-max h-full">
          <div className={labelClass}>
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Speed
            </span>
          </div>
          
          <div className="flex items-center gap-4 px-3">
            <span className="text-[10px] font-mono text-neutral-500 w-4 text-right">50</span>
            
            <input
              type="range"
              min="50"
              max="120"
              step="5"
              value={deathWPM}
              onChange={(e) => {
                setDeathWPM(Number(e.target.value));
                resetGame();
              }}
              className="w-32 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all active:scale-105"
            />
            
            <span className="text-[10px] font-mono text-neutral-500 w-4">120</span>
            
            <div className="flex items-center justify-center bg-neutral-900 rounded px-2 py-1 min-w-[50px] shadow-sm">
                <span className="text-sm font-bold text-yellow-500 font-mono">
                {deathWPM}
                </span>
                <span className="text-[10px] text-neutral-500 ml-1 mt-0.5">wpm</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ConfigBar;