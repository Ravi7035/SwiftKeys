import { useGameStore } from "../store/Gamestore.js";
import LineGraph from "./Linegraph.jsx";
import { useEffect } from "react";
import { useStatsStore } from "../store/Stats.store.js";
import { RefreshCcw, AlertTriangle, Ghost, Skull, Ban } from "lucide-react";

const Gameover = () => {
  const {
    CorrectChars,
    gameDuration,
    TotalTypedChars,
    isGameover,
    countdown,
    gameOverReason,
    resetGame,
    difficulty,
    text
  } = useGameStore();
   const {updateStats} =useStatsStore();

  const actuallyCompleted=CorrectChars.length===text.length

  //Update Stats for casual mode
  useEffect(()=>
    {
      if (isGameover &&  gameOverReason === "time" && difficulty==="none" )
      {
        updateStats(
          {
            Wpm:Math.round(netWpm),
            Accuracy:Math.round(accuracy *10)/10,
            type:"singlemode"
          }
        )
      }
    },[isGameover,difficulty,gameOverReason]);

    //update Stats for death mode
    useEffect(()=>
      {
        if (isGameover &&  actuallyCompleted && gameOverReason==="time" && difficulty==="death" )
        {
          updateStats(
            {
              Wpm:Math.round(netWpm),
              Accuracy:Math.round(accuracy *10)/10,
              type:"singlemode"
            }
          )
        }
      },[isGameover,difficulty,gameOverReason]);

      //update the stats for the fog mode
      useEffect(()=>
        {
          if (isGameover && gameOverReason==="time" && difficulty==="fog" )
          {
            updateStats(
              {
                Wpm:Math.round(netWpm),
                Accuracy:Math.round(accuracy *10)/10,
                type:"singlemode"
              }
            )
          }
        },[isGameover,difficulty,gameOverReason]);

      //update Stats for ghost mode

      useEffect(()=>
        {
          if (isGameover && gameOverReason==="time" && difficulty==="ghost" )
          {
            updateStats(
              {
                Wpm:Math.round(netWpm),
                Accuracy:Math.round(accuracy *10)/10,
                type:"singlemode",
              }
            )
          }
        },[isGameover,difficulty,gameOverReason]);

        useEffect(()=>
        {
          if(isGameover && gameOverReason==="time" && difficulty==="death")

            {
              updateStats(
                {
                  Wpm:Math.round(netWpm),
                  Accuracy:Math.round(accuracy *10)/10,
                  type:"singlemode",
                }
              )
            }
            
        },[isGameover,difficulty,gameOverReason]
      )

  if (!isGameover) return null;

  const elapsedSeconds = gameDuration - (countdown > 0 ? countdown : 0);
  const timeInMinutes = elapsedSeconds / 60;
  
  const netWpm = elapsedSeconds > 0 ? (CorrectChars / 5) / timeInMinutes : 0;
  const rawWpm = elapsedSeconds > 0 ? (TotalTypedChars / 5) / timeInMinutes : 0;
  const accuracy = TotalTypedChars > 0 ? (CorrectChars / TotalTypedChars) * 100 : 0;
  const incorrect = TotalTypedChars - CorrectChars;

  if (gameOverReason === 'death_fail' && !actuallyCompleted ) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-black via-red-950/30 to-black backdrop-blur-lg animate-in fade-in duration-1000">

        {/* Animated Background Particles - More intense for death mode */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-600/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
          {/* Extra sharp red particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`sharp-${i}`}
              className="absolute w-3 h-px bg-red-500/40 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>

        {/* Main Death Container - More menacing */}
        <div className="relative flex flex-col items-center gap-8 bg-gradient-to-b from-red-950/95 to-black/95 p-12 rounded-3xl border border-red-600/50 shadow-[0_0_120px_rgba(220,38,38,0.3)] backdrop-blur-xl max-w-md w-full mx-4">

          {/* Intense Red Aura */}
          <div className="absolute inset-0 rounded-3xl bg-red-600/10 animate-pulse"></div>
          <div className="absolute inset-0 rounded-3xl bg-red-500/5 animate-ping animation-delay-500"></div>

          {/* Ban Icon with Intense Effects */}
          <div className="relative mb-2">
            {/* Multiple glowing rings */}
            <div className="absolute inset-0 scale-150 bg-red-600/15 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute inset-0 scale-125 bg-red-500/25 blur-2xl rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute inset-0 scale-110 bg-red-400/35 blur-xl rounded-full animate-pulse animation-delay-700"></div>

            {/* Main icon with aggressive animation */}
            <div className="relative animate-bounce" style={{animationDuration: '2s'}}>
              <Ban
                size={110}
                className="text-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.9)] filter brightness-110 animate-pulse"
              />

              {/* Cross lines glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-1 bg-red-400/60 rounded-full blur-sm animate-pulse animation-delay-200"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-16 bg-red-400/60 rounded-full blur-sm animate-pulse animation-delay-400"></div>
              </div>
            </div>
          </div>

          {/* Harsh Title */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent tracking-wider animate-pulse uppercase">
              ELIMINATED
            </h1>

            {/* Punishing subtitle */}
            <div className="flex items-center justify-center gap-3 text-red-300/90 font-semibold text-lg">
              <div className="w-8 h-px bg-red-500/60"></div>
              <span className="animate-fade-in animation-delay-300">One Mistake Too Many</span>
              <div className="w-8 h-px bg-red-500/60"></div>
            </div>
          </div>

          {/* Enhanced Button - More aggressive */}
          <button
            onClick={resetGame}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.5)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.7)]"
          >
            {/* Button danger effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Aggressive shine animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-red-300/30 to-transparent transition-transform duration-700"></div>

            <span className="relative z-10 flex items-center justify-center gap-2">
              <RefreshCcw size={20} className="animate-spin group-hover:animate-none transition-all duration-300" />
              Try Again
            </span>
          </button>

          {/* Warning message */}
          <p className="text-red-400/70 text-sm text-center italic font-medium">
            "Death mode shows no mercy..."
          </p>
        </div>

        {/* More intense screen vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle_at_center,transparent_20%,rgba(220,38,38,0.08)_100%)"></div>
      </div>
    );
  }

  if (gameOverReason === 'ghost_death') {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-black via-red-950/20 to-black backdrop-blur-lg animate-in fade-in duration-1000">

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Main Defeat Container */}
        <div className="relative flex flex-col items-center gap-10 bg-gradient-to-b from-gray-900/95 to-black/95 p-12 rounded-3xl border border-red-900/40 shadow-[0_0_100px_rgba(220,38,38,0.2)] backdrop-blur-xl max-w-md w-full mx-4">

          {/* Pulsing Red Aura */}
          <div className="absolute inset-0 rounded-3xl bg-red-600/5 animate-pulse"></div>

          {/* Skull with Dramatic Effects */}
          <div className="relative mb-4">
            {/* Outer glowing rings */}
            <div className="absolute inset-0 scale-150 bg-red-600/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="absolute inset-0 scale-125 bg-red-500/30 blur-xl rounded-full animate-ping animation-delay-1000"></div>

            {/* Main skull with floating animation */}
            <div className="relative animate-bounce" style={{animationDuration: '3s'}}>
              <Skull
                size={100}
                className="text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] filter brightness-110"
              />

              {/* Eyes glow effect */}
              <div className="absolute top-3 left-4 w-3 h-3 bg-red-400/80 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute top-3 right-4 w-3 h-3 bg-red-400/80 rounded-full blur-sm animate-pulse animation-delay-500"></div>
            </div>
          </div>

          {/* Dramatic Title */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent tracking-wider animate-pulse">
              DEFEATED
            </h1>

            {/* Subtitle with typing effect */}
            <div className="flex items-center justify-center gap-3 text-red-300/80 font-medium text-lg">
              <div className="w-6 h-px bg-red-500/50"></div>
              <span className="animate-fade-in animation-delay-500">The Ghost Has Won</span>
              <div className="w-6 h-px bg-red-500/50"></div>
            </div>
          </div>


          {/* Enhanced Button */}
          <button
            onClick={resetGame}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_35px_rgba(220,38,38,0.6)]"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Shine animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>

            <span className="relative z-10 flex items-center justify-center gap-2">
              <RefreshCcw size={20} className="animate-spin group-hover:animate-none transition-all duration-300" />
              Try Again
            </span>
          </button>

          {/* Motivational text */}
          <p className="text-red-400/60 text-sm text-center italic">
            "The ghost grows stronger with each defeat..."
          </p>
        </div>

        {/* Screen vignette effect */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle_at_center,transparent_30%,black_100%)"></div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start animate-in fade-in slide-in-from-bottom-2 duration-500 pt-10 sm:pt-16 px-4 sm:px-6">
  <div className="w-full max-w-[1000px]">
    
    {/* Main Stats and Graph Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-6 sm:gap-8 mb-8">
      
      {/* Big Stats (WPM / ACC) */}
      {/* flex-row on mobile, flex-col on desktop */}
      <div className="flex flex-row lg:flex-col justify-around lg:justify-center gap-4 sm:gap-6 text-center lg:text-left">
        <div>
          <p className="text-[#646669] text-lg sm:text-xl font-bold uppercase">wpm</p>
          <p className="text-[#e2b714] text-5xl sm:text-[4rem] font-bold leading-none tabular-nums">
            {netWpm.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-[#646669] text-lg sm:text-xl font-bold uppercase">acc</p>
          <p className="text-[#e2b714] text-5xl sm:text-[4rem] font-bold leading-none tabular-nums">
            {accuracy.toFixed(0)}%
          </p>
        </div>
      </div>    

      {/* Graph Container */}
      <div className="w-full h-[180px] sm:h-[220px] bg-[#2c2e31]/10 rounded-xl border border-[#2c2e31]/50 p-2 sm:p-3 relative">
        <div className="w-full h-full">
          <LineGraph />
        </div>
      </div>
    </div>

    {/* Secondary Stats Footer */}
    <div className="flex flex-col sm:flex-row justify-between items-center w-full px-2 border-t border-[#2c2e31] pt-6 gap-6">
      
      {/* Stats Grid: 2 columns on tiny phones, 4 on larger screens */}
      <div className="grid grid-cols-2 md:flex md:gap-12 gap-y-6 gap-x-8 w-full sm:w-auto">
        
        <div className="flex flex-col gap-0.5">
          <p className="text-[#646669] text-xs uppercase font-bold">test type</p>
          <p className="text-[#e2b714] text-sm sm:text-base">
            {difficulty !== 'none' ? difficulty : 'normal'} {gameDuration}s
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[#646669] text-xs uppercase font-bold">raw</p>
          <p className="text-[#e2b714] text-xl sm:text-2xl font-bold tabular-nums">
            {rawWpm.toFixed(0)}
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[#646669] text-xs uppercase font-bold">characters</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tighter">
            <span className="text-[#e2b714]">{CorrectChars}</span>
            <span className="text-[#646669] mx-1">/</span>
            <span className="text-[#ca4754]">{incorrect}</span>
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[#646669] text-xs uppercase font-bold">time</p>
          <p className="text-[#e2b714] text-xl sm:text-2xl font-bold tabular-nums">
            {elapsedSeconds}s
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center justify-center w-full sm:w-auto pt-4 sm:pt-0">
        <button 
          onClick={resetGame} 
          className="bg-[#2c2e31] hover:bg-[#e2b714] hover:text-[#1d1f23] text-[#646669] p-4 sm:p-3 rounded-xl transition-all active:scale-95 group"
          title="Restart Test"
        >
          <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
};
  
export default Gameover;