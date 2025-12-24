import { useEffect, useState, useRef } from "react";
import { useGameStore } from "../store/Gamestore";

const SentenceGenerator = () => {
  const {
    // --- EXISTING IMPORTS ---
    isTyping,
    isGameover,
    setCorrectChars,
    setTotalTypedChars,
      CorrectChars,
      countdown,
      gameDuration,
      addWPMEntry,
      isRunning,
      startgame,
      stopgame,
      setCountDown,
      difficulty,
      deathWPM,
      ghostIndex,
      setGhostIndex,
      setLiveWPM ,
      LiveWPM,
      
      // --- MULTIPLAYER IMPORTS ---
      typedChars,       
      setTypedChars,    
      GameState,        
      text,             
    } = useGameStore();

  const [isFocused, setIsFocused] = useState(true);
  const [randomSentence, setRandomSentence] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const correctCharsRef = useRef(CorrectChars);
  const typedCharsRef = useRef(typedChars);

  useEffect(() => {
    correctCharsRef.current = CorrectChars;
  }, [CorrectChars]);

  useEffect(() => {
    typedCharsRef.current = typedChars;
  }, [typedChars]);

  const wordsArray = "the golden sun dipped below the horizon painting the sky in shades of pink and orange".split(" ");

  function randomWord() {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }

  function generateSentence() {
    const totalWords = 40; 
    const words = Array.from({ length: totalWords }, () => randomWord()).join(" ");
    setRandomSentence(words);
    setTypedChars([]);
  }

  // --- FIXED LOGIC: Strict Separation of Modes ---
  useEffect(() => {
    // MODE 1: Multiplayer
    if (GameState === 'playing') {
        // Only set text if it actually exists. 
        // If text is null (waiting for server), do NOTHING. Don't generate random text.
        if (text) {
            setRandomSentence(text);
            setTypedChars([]);
        }
    } 
    // MODE 2: Single Player / Practice
    else {
        // Only generate random text if we are NOT in a multiplayer game
        generateSentence();
    }
  }, [GameState, text]); 

  // --- REMOVED THE CONFLICTING USEEFFECT HERE ---

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = () => setIsFocused(true);
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const handleTyping = (e) => {
      if (!randomSentence || isGameover) return;

      const idx = typedChars.length;
      const expectedChar = randomSentence[idx];

      if (!isTyping && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        startgame();
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (typedChars.length === 0) return;
        
        let wordStart = idx;
        while (wordStart > 0 && randomSentence[wordStart - 1] !== " ") wordStart--;
        if (idx <= wordStart) return;
        setTypedChars((prev) => prev.slice(0, prev.length - 1));
        return;
      }

      if (e.code === "Space") {
        e.preventDefault(); 

        // Check if Space is the correct character
        const isCorrect = expectedChar === " ";

        // Death Mode Check
        if (!isCorrect && difficulty === 'death') {
          stopgame('death_fail');
          return;
        }

        // Allow space even if incorrect (Fixes the stuck bug)
        setTypedChars((prev) => [...prev, { correct: isCorrect, expected: expectedChar }]);
        setTotalTypedChars((prev) => prev + 1);
        
        return;
      }

      if (expectedChar === " ") return;

      if (e.key.length === 1) {
        const isCorrect = e.key === expectedChar;

        if (!isCorrect && difficulty === 'death') {
            stopgame('death_fail');
            return;
        }

        setTypedChars((prev) => [...prev, { correct: isCorrect, expected: expectedChar }]);
        setTotalTypedChars((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleTyping);
    return () => window.removeEventListener("keydown", handleTyping);
  }, [typedChars, randomSentence, isTyping, isGameover, startgame, difficulty, stopgame, setTypedChars, setTotalTypedChars]);

  useEffect(() => {
    if (!isRunning) return;

    let localElapsed = 0;

    const interval = setInterval(() => {
      localElapsed++;
      setCountDown((prev) => {
        const timeLeft = prev - 1;
        if (timeLeft <= 0 && difficulty !== 'ghost') {
          stopgame('time');
          return 0;
        }
        return timeLeft;
      });

      const currentCorrect = correctCharsRef.current;
      if (localElapsed > 0) {
        const wpm = (currentCorrect / 5) / (localElapsed / 60);
        const roundedWPM = Math.max(0, Math.round(wpm));

        addWPMEntry(roundedWPM);
        setLiveWPM(roundedWPM);
        console.log(roundedWPM);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, difficulty, setCountDown, addWPMEntry, stopgame]);

  useEffect(() => {
    if (isRunning && typedChars.length === randomSentence.length && randomSentence.length > 0) {
      stopgame('completed');
    }
  }, [typedChars, randomSentence, isRunning, stopgame]);

  useEffect(() => {
    if (!isRunning || difficulty !== 'ghost') return;

    const cpm = deathWPM * 5; 
    const intervalMs = 60000 / cpm;

    const ghostInterval = setInterval(() => {
        setGhostIndex((prev) => {
            const nextIndex = prev + 1;
            const userIndex = typedCharsRef.current.length;

            if (nextIndex > userIndex) {
                stopgame('ghost_death'); 
                return prev;
            }
            return nextIndex;
        });
    }, intervalMs);

    return () => clearInterval(ghostInterval);
  }, [isRunning, difficulty, deathWPM, setGhostIndex, stopgame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const correct = typedChars.filter((c) => c.correct).length;
    setCorrectChars(correct);
  }, [typedChars, setCorrectChars]);

  const cursorStyle = {
    width: "2px",
    height: "1.2em",
    background: cursorVisible ? "#e2b714" : "transparent",
  };

  const ghostCursorStyle = {
    width: "2px",
    height: "1.2em",
    background: "#ca4754", 
    boxShadow: "0 0 8px #ca4754",
    zIndex: 10,
    transition: "all 0.1s linear"
  };

  const getFogClass = (index, cursorIndex) => {
    if (difficulty !== 'fog') return "opacity-100 blur-0 transition-all duration-200";
    const distance = index - cursorIndex;
    if (distance <= 0) return "opacity-100 blur-0";
    if (distance <= 3) return "opacity-100 blur-0 transition-all duration-150 ease-out";
    if (distance <= 6) return "opacity-60 blur-[1px] text-gray-400 transition-all duration-300 ease-out";
    return "opacity-30 blur-[2px] text-transparent transition-all duration-500 ease-out";
  };

  return (
    <div className="flex flex-col justify-center w-full text-white select-none mt-12 mb-20 h-full">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-8">
        <p
          className={`text-2xl sm:text-3xl leading-relaxed tracking-wide transition-all duration-500 ${
            isFocused ? "opacity-100 blur-0" : "opacity-50 blur-sm"
          }`}
          style={{
            textAlign: "left",
            wordBreak: "keep-all",
            whiteSpace: "normal",
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineHeight: "1.6"
          }}
        >
          {randomSentence.split("").map((char, index) => {
            const typed = typedChars[index];
            const cursorIndex = typedChars.length;
            const fogClass = getFogClass(index, cursorIndex);
            
            const isGhostHere = difficulty === 'ghost' && index === ghostIndex;

            if (char === " ") {
              return (
                <span key={index} className={`relative inline align-baseline ${fogClass}`}>
                  {index === typedChars.length && <span className="absolute left-0 top-0" style={cursorStyle} />}
                  {isGhostHere && <span className="absolute left-0 top-0" style={ghostCursorStyle} />}
                  {" "}
                </span>
              );
            }

            return (
              <span key={index} className="relative align-baseline">
                {index === typedChars.length && <span className="absolute left-0 top-0" style={cursorStyle} />}
                {isGhostHere && <span className="absolute left-0 top-0" style={ghostCursorStyle} />}
                
                {typed ? (
                  typed.correct ? (
                    <span className="text-[#e2b714]">{char}</span>
                  ) : (
                    <span className="text-[#ca4754] border-b-2 border-[#ca4754]">{typed.expected}</span>
                  )
                ) : (
                  <span className="text-[#646669]">{char}</span>
                )}
              </span>
            );
          })}
        </p>
      </div>
      {!isFocused && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-gray-300 px-4">
            <p className="text-xl sm:text-2xl font-semibold mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              Click here or press any key
            </p>
            <p className="text-base sm:text-lg text-gray-400">to refocus</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentenceGenerator;