import { useEffect } from "react";
import SentenceGenerator from "../components/SentenceGenerator.jsx";
import Timer from "../components/Timer.jsx";
import { useGameStore } from "../store/Gamestore.js";
import Gameover from "../components/Gameover.jsx";
import ConfigBar from "../components/Configbar.jsx";

const HomePage = ({ refreshKey }) => {

  const {
    isTyping,
    isRunning,
    countdown,
    stopgame,
    gameDuration,
    gameMode,
    isGameover
  } = useGameStore();

  useEffect(() => {
    if (countdown === 0 && isRunning && gameMode === "time") {
      stopgame('time');
    }
  }, [countdown, stopgame, isRunning, gameMode]);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col pt-16 ">
      {isGameover ? (
        <Gameover />
      ) : (
        <>
          <div className="flex justify-center pt-8 sm:pt-12 pb-6 z-10 min-h-[100px]">
            {isTyping ? (
              gameMode === "time" && isRunning ? (
                <Timer totalSeconds={gameDuration} />
              ) : null
            ) : (
              <ConfigBar />
            )}
          </div>

          <div className="w-full flex-1 flex items-center justify-center">
            <SentenceGenerator key={refreshKey} />
          </div>

          <div ></div>
        </>
      )}
    </div>
  );
};

export default HomePage;