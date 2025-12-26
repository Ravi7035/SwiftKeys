import { useGameStore } from "../store/Gamestore.js";
import LineGraph from "./LineGraph.jsx";
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
    difficulty
  } = useGameStore();

 
  if (!isGameover) return null;
  
  const elapsedSeconds = gameDuration - (countdown > 0 ? countdown : 0);
  const timeInMinutes = elapsedSeconds / 60;
  
  const netWpm = elapsedSeconds > 0 ? (CorrectChars / 5) / timeInMinutes : 0;
  const rawWpm = elapsedSeconds > 0 ? (TotalTypedChars / 5) / timeInMinutes : 0;
  const accuracy = TotalTypedChars > 0 ? (CorrectChars / TotalTypedChars) * 100 : 0;
  const incorrect = TotalTypedChars - CorrectChars;

  useEffect(()=>
    {
      if(isGameover && (gameOverReason!=="death_fail" || gameOverReason!="ghost_death" && elapsedSeconds > 0))
      {
        
  
      }
      
    },[isGameover,gameOverReason])
    

  if (gameOverReason === 'death_fail' && elapsedSeconds==0) {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 py-10 px-8">
            <div className="flex flex-col items-center gap-8 bg-[#2c2e31]/30 p-12 rounded-2xl border border-[#ca4754]/20 shadow-2xl backdrop-blur-sm">
                <Ban size={100} className="text-[#ca4754] animate-pulse drop-shadow-[0_0_15px_rgba(202,71,84,0.5)]" />
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-mono font-bold text-[#ca4754] tracking-widest uppercase mb-2">Failed</h1>
                    <p className="text-[#646669] font-mono text-xl tracking-wide">Better luck next Time</p>
                </div>
                <button onClick={resetGame} className="mt-4 bg-[#ca4754] text-white px-8 py-3 rounded-lg font-bold">Try Again</button>
            </div>
        </div>
    );
  }

  if (gameOverReason === 'ghost_death' && elapsedSeconds==0) {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 py-10 px-8">
            <div className="flex flex-col items-center gap-8 bg-[#2c2e31]/30 p-12 rounded-2xl border border-[#ca4754]/20 shadow-2xl backdrop-blur-sm">
                <Skull size={100} className="text-[#ca4754] animate-pulse" />
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-mono font-bold text-[#ca4754] tracking-widest uppercase mb-2">Defeated</h1>
                    <p className="text-[#646669] font-mono text-xl tracking-wide">You were caught by the ghost</p>
                </div>
                <div className="flex gap-12 mt-4 text-[#646669] font-mono text-2xl bg-[#1d1f23] px-8 py-4 rounded-xl border border-[#2c2e31]">
                    <div className="flex flex-col items-center"><span className="text-sm">Speed</span><span className="text-[#e2b714] font-bold">{netWpm.toFixed(0)}</span></div>
                    <div className="w-px bg-[#2c2e31]"></div>
                    <div className="flex flex-col items-center"><span className="text-sm">Accuracy</span><span className="text-[#e2b714] font-bold">{accuracy.toFixed(0)}%</span></div>
                </div>
                <button onClick={resetGame} className="mt-4 bg-[#ca4754] text-white px-8 py-3 rounded-lg font-bold">Try Again</button>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start animate-in fade-in slide-in-from-bottom-2 duration-500 pt-16 px-6">
      <div className="w-full max-w-[1000px]">
        <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-8 mb-8">
          <div className="flex flex-col justify-center gap-6">
            <div><p className="text-[#646669] text-xl font-bold">wpm</p><p className="text-[#e2b714] text-[4rem] font-bold">{netWpm.toFixed(0)}</p></div>
            <div><p className="text-[#646669] text-xl font-bold">acc</p><p className="text-[#e2b714] text-[4rem] font-bold">{accuracy.toFixed(0)}%</p></div>
          </div>    
          <div className="w-full h-[220px] bg-[#2c2e31]/20 rounded-lg border border-[#2c2e31] p-3 relative">
             <div className="w-full h-full"><LineGraph /></div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full px-2 border-t border-[#2c2e31] pt-6">
            <div className="flex gap-12">
                <div className="flex flex-col gap-0.5"><p className="text-[#646669] text-xs">test type</p><p className="text-[#e2b714] text-base">{difficulty !== 'none' ? difficulty : 'normal'} {gameDuration}s</p></div>
                <div className="flex flex-col gap-0.5"><p className="text-[#646669] text-xs">raw</p><p className="text-[#e2b714] text-2xl font-bold">{rawWpm.toFixed(0)}</p></div>
                <div className="flex flex-col gap-0.5"><p className="text-[#646669] text-xs">characters</p><p className="text-2xl font-bold"><span className="text-[#e2b714]">{CorrectChars}</span><span className="text-[#646669] mx-1">/</span><span className="text-[#ca4754]">{incorrect}</span></p></div>
                <div className="flex flex-col gap-0.5"><p className="text-[#646669] text-xs">time</p><p className="text-[#e2b714] text-2xl font-bold">{elapsedSeconds}s</p></div>
            </div>
            <div className="flex gap-3">
                <button onClick={resetGame} className="bg-[#2c2e31] hover:bg-[#e2b714] hover:text-[#1d1f23] text-[#646669] p-3 rounded-lg"><RefreshCcw size={20} /></button>
            </div>
        </div>
      </div>
    </div>
  );
};
  
export default Gameover;