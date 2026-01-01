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
    gameDuration
  } = useGameStore();

  useEffect(() => {
    if (countdown === 0) {
      stopgame();
    }
  }, [countdown, stopgame]);

  return (
    <div className="relative h-screen bg-black text-white flex flex-col pt-16 ">
      {countdown > 0 ? (
        <>
          <div className="flex justify-center pt-8 sm:pt-12 pb-6 z-10 min-h-[100px]">
            {isTyping && isRunning ? (
              <Timer totalSeconds={gameDuration} />
            ) : (
              <ConfigBar />
            )}
          </div>

          <div className="w-full flex-1 flex items-center pb-32">
            <SentenceGenerator key={refreshKey} />
          </div>

          <div ></div>
        </>
      ) : (
        <Gameover />
      )}
    </div>
  );
};

export default HomePage;