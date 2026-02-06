import { useEffect } from "react";
import { useGameStore } from "../store/Gamestore";

const ScrollDigit = ({ digit, animate }) => {
  return (
    <div className="h-[1.5em] w-[0.9em] overflow-hidden relative">
      <div
        className={`flex flex-col ${
          animate ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="h-[1.5em] flex items-center justify-center font-bold text-yellow-500 tabular-nums leading-none"
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

const Timer = ({ totalSeconds }) => {
  const { countdown, isRunning, setCountDown } = useGameStore();

  useEffect(() => {
    // Sync the local countdown with the selected totalSeconds when not running
    if (!isRunning) {
      setCountDown(totalSeconds);
    }
  }, [totalSeconds, isRunning, setCountDown]);

  useEffect(() => {
    if (!isRunning || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, setCountDown, countdown]);

 
  const hundreds = Math.floor(countdown / 100);
  const tens = Math.floor((countdown % 100) / 10);
  const units = countdown % 10;

  return (
    <div className="relative inline-block">
      <div className="flex items-center justify-center gap-1 bg-neutral-800 text-yellow-500 text-4xl rounded-xl px-6 py-3 shadow-lg">
     
        {hundreds > 0 && <ScrollDigit digit={hundreds} animate={isRunning} />}
        <ScrollDigit digit={tens} animate={isRunning} />
        <ScrollDigit digit={units} animate={isRunning} />
      </div>
    </div>
  );
};

export default Timer;