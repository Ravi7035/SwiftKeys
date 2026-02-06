import { useEffect, useState, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { useGameStore } from "../store/Gamestore";

const SentenceGenerator = () => {
  // Helper function to generate lines from text
  const generateLinesFromText = (fullText) => {
    const lines = [];
    let currentLine = '';
    const words = fullText.split(' ');

    for (const word of words) {
        if ((currentLine + ' ' + word).length <= 45) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    while (lines.length < 3) {
        lines.push('');
    }

    return lines;
  };

  const {
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
        resetGame,
        gameMode,
        setIsTyping,
        stopgame,
        setCountDown,
        difficulty,
        deathWPM,
        ghostIndex,
        setGhostIndex,
        setLiveWPM ,
        LiveWPM,
        typedChars,       
        setTypedChars,    
        GameState,         
        text,
        roomId,           
    } = useGameStore();

  const [isFocused, setIsFocused] = useState(true);
  const [randomSentence, setRandomSentence] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [textLines, setTextLines] = useState([]);
  const [textBlocks, setTextBlocks] = useState([]); 
  const [textUpdateCount, setTextUpdateCount] = useState(0); 
  const [waitingForMoreText, setWaitingForMoreText] = useState(false); 
  const correctCharsRef = useRef(CorrectChars);
  const typedCharsRef = useRef(typedChars);

  useEffect(() => {
    correctCharsRef.current = CorrectChars;
  }, [CorrectChars]);

  useEffect(() => {
    typedCharsRef.current = typedChars;
  }, [typedChars]);

  const userIndexRef = useRef(0);
  useEffect(() => {
    userIndexRef.current = typedChars.length;
  }, [typedChars.length]);

  const wordsArray = 
  [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
    "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him",
    "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only",
    "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want",
    "because", "any", "these", "give", "day", "most", "us", "is", "are", "was", "were", "been", "has", "had", "will", "would", "shall", "should",
    "may", "might", "must", "can", "could", "did", "does", "doing", "done", "eat", "ate", "eaten", "drink", "drank", "drunk", "sleep", "slept",
    "run", "ran", "swim", "swam", "write", "wrote", "written", "read", "reading", "speak", "spoke", "spoken", "break", "broke", "broken", "build",
    "built", "buy", "bought", "catch", "caught", "choose", "chose", "chosen", "come", "came", "cost", "cut", "do", "did", "done", "draw", "drew",
    "drawn", "dream", "dreamt", "drive", "drove", "driven", "eat", "ate", "eaten", "fall", "fell", "fallen", "feel", "felt", "fight", "fought",
    "find", "found", "fly", "flew", "flown", "forget", "forgot", "forgotten", "forgive", "forgave", "forgiven", "freeze", "froze", "frozen",
    "get", "got", "gotten", "give", "gave", "given", "go", "went", "gone", "grow", "grew", "grown", "hang", "hung", "have", "had", "hear",
    "heard", "hide", "hid", "hidden", "hit", "hold", "held", "hurt", "keep", "kept", "know", "knew", "known", "lay", "laid", "lead", "led",
    "learn", "learnt", "learned", "leave", "left", "lend", "lent", "let", "lie", "lay", "lain", "light", "lit", "lose", "lost", "make", "made",
    "mean", "meant", "meet", "met", "pay", "paid", "put", "read", "read", "ride", "rode", "ridden", "ring", "rang", "rung", "rise", "rose",
    "risen", "run", "ran", "say", "said", "see", "saw", "seen", "sell", "sold", "send", "sent", "set", "shake", "shook", "shaken", "shine",
    "shone", "shoot", "shot", "show", "showed", "shown", "shut", "sing", "sang", "sung", "sink", "sank", "sunk", "sit", "sat", "sleep",
    "slept", "slide", "slid", "speak", "spoke", "spoken", "speed", "sped", "spend", "spent", "spin", "spun", "spread", "stand", "stood",
    "steal", "stole", "stolen", "stick", "stuck", "strike", "struck", "struck", "swear", "swore", "sworn", "sweep", "swept", "swim",
    "swam", "swum", "swing", "swung", "take", "took", "taken", "teach", "taught", "tear", "tore", "torn", "tell", "told", "think", "thought",
    "throw", "threw", "thrown", "understand", "understood", "wake", "woke", "woken", "wear", "wore", "worn", "win", "won", "write", "wrote",
    "written", "beautiful", "happy", "sad", "angry", "excited", "tired", "hungry", "thirsty", "cold", "hot", "big", "small", "fast", "slow",
    "easy", "hard", "quick", "smart", "dumb", "rich", "poor", "young", "old", "new", "clean", "dirty", "wet", "dry", "full", "empty", "open",
    "closed", "light", "dark", "loud", "quiet", "high", "low", "long", "short", "wide", "narrow", "thick", "thin", "strong", "weak", "soft",
    "hard", "smooth", "rough", "sweet", "sour", "bitter", "salty", "spicy", "hot", "cold", "red", "blue", "green", "yellow", "orange", "purple",
    "pink", "brown", "black", "white", "gray", "computer", "keyboard", "mouse", "screen", "phone", "tablet", "laptop", "desktop", "internet",
    "website", "email", "message", "chat", "video", "music", "game", "book", "movie", "song", "picture", "photo", "camera", "light", "sound",
    "water", "fire", "earth", "air", "sun", "moon", "star", "sky", "cloud", "rain", "snow", "wind", "tree", "flower", "grass", "mountain",
    "river", "lake", "ocean", "beach", "forest", "desert", "city", "town", "house", "car", "bus", "train", "plane", "ship", "road", "street",
    "school", "work", "home", "friend", "family", "love", "hate", "peace", "war", "money", "food", "drink", "sleep", "dream", "hope", "fear",
    "joy", "pain", "life", "death", "time", "space", "world", "universe", "science", "art", "music", "dance", "sport", "game", "fun", "work",
    "play", "learn", "teach", "create", "build", "destroy", "begin", "end", "start", "stop", "open", "close", "enter", "exit", "come", "go"
  ];

  function randomWord() {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }
  function generateLine() {
    const isMobile = window.innerWidth < 640;
    const targetLength = isMobile ? 18 : 43; 
    let line = "";

    while (line.length < targetLength) {
      const word = randomWord();
      if (line.length === 0) {
        line = word;
      } else {
        const newLine = line + " " + word;
        const wordCount = newLine.split(" ").length;
        if (isMobile && wordCount > 3) break;

        if (newLine.length <= targetLength) {
          line = newLine;
        } else {
          break;
        }
      }
    }
    return line || randomWord();
  }
  function generateInitialLines() {
    const initialLines = [];
    for (let i = 0; i < 3; i++) {
      initialLines.push(generateLine());
    }
    setTextLines(initialLines);
    setRandomSentence(initialLines.join(" "));
    setTypedChars([]);
  }

  function generateNextLine() {
    const newLine = generateLine();
    const updatedLines = [...textLines, newLine];
    setTextLines(updatedLines);
    setRandomSentence(updatedLines.join(" "));
  }


  function checkLineCompletion() {
    if (!randomSentence) return;
    const currentTypedLength = typedCharsRef.current.length;
    if (currentTypedLength === randomSentence.length && randomSentence.length > 0) {
      if (roomId) {
        import('../socket.js').then(({ default: socket }) => {
          socket.emit("player_completed", { roomId, wpm: LiveWPM });
          stopgame();
        });
        return;
      }
      pushUpTopLine();
    }
  }

  function pushUpTopLine() {
    const completedLine = textLines[0];
    const remainingLines = textLines.slice(1);
    const newLine = generateLine();
    const transitionLines = [completedLine, ...remainingLines, newLine];
    setTextLines(transitionLines);

    setTimeout(() => {
      const finalLines = [...remainingLines, newLine];
      setTextLines(finalLines);
      setRandomSentence(finalLines.join(" "));
      setTypedChars([]); 
    }, 400); 
  }


  useEffect(() => {
    if (GameState === 'playing') {
        if (text && textBlocks.length === 0) {
            setTextBlocks([text]);
            setRandomSentence(text);
            setTypedChars([]);
            setTextLines(generateLinesFromText(text));
        }
    }
    else {
        setTextBlocks([]); 
        generateInitialLines();
    }
  }, [GameState, text]);

  useEffect(() => {
    if (GameState !== 'playing') return;

    const handleAdditionalText = (data) => {
      const newTextBlocks = [...textBlocks, data.text];
      setTextBlocks(newTextBlocks);
      const fullText = newTextBlocks.join(' ');
      const newLines = generateLinesFromText(fullText);
      setTextLines(newLines);
      setRandomSentence(fullText);
      setWaitingForMoreText(false); 
      setTextUpdateCount(prev => prev + 1); 
    };

    import('../socket.js').then(({ default: socket }) => {
      socket.on("additional_text", handleAdditionalText);
      return () => {
        socket.off("additional_text", handleAdditionalText);
      };
    });
  }, [GameState, textLines]);

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
    const handleResize = () => generateInitialLines();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyPress = () => setIsFocused(true);
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleTyping = useCallback((e) => {
      const currentSentence = randomSentence;
      const currentTypedLength = typedCharsRef.current.length;
      
      if (!currentSentence || isGameover) return;
      
      const idx = currentTypedLength;
      const expectedChar = currentSentence[idx];
      if (idx >= currentSentence.length) return;

      const startingNow = !isTyping && e.key.length === 1 && !e.ctrlKey && !e.metaKey && GameState !== 'playing';
      if (startingNow) {
        setIsTyping(true);
        startgame();
      }

      const canType = startingNow || (isTyping && GameState !== 'playing') || (GameState === 'playing');
      if (!canType) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setTypedChars((prev) => {
          if (prev.length === 0) return prev;
          const currentIdx = prev.length;
          let wordStart = currentIdx;
          while (wordStart > 0 && currentSentence[wordStart - 1] !== " ") wordStart--;
          if (currentIdx <= wordStart) return prev;
          const newTyped = prev.slice(0, prev.length - 1);
          typedCharsRef.current = newTyped;
          return newTyped;
        });
        return;
      }
      if (e.code === "Space") {
        e.preventDefault(); 
        const isCorrect = expectedChar === " ";
        if (!isCorrect && difficulty === 'death') {
          stopgame('death_fail');
          return;
        }
        if (!isCorrect) return;

        setTypedChars((prev) => {
          const newTyped = [...prev, { correct: isCorrect, expected: expectedChar }];
          typedCharsRef.current = newTyped;
          return newTyped;
        });
        setTotalTypedChars((prev) => prev + 1);
        checkLineCompletion();
        return;
      }

      if (expectedChar === " ") return;

      if (e.key.length === 1) {
        const isCorrect = e.key === expectedChar;
        if (!isCorrect && difficulty === 'death') {
            stopgame('death_fail');
            return;
        }

        setTypedChars((prev) => {
          const newTyped = [...prev, { correct: isCorrect, expected: expectedChar }];
          typedCharsRef.current = newTyped;
          return newTyped;
        });
        setTotalTypedChars((prev) => prev + 1);
        checkLineCompletion();
      }
  }, [randomSentence, isTyping, isGameover, difficulty, GameState, startgame, stopgame, setTypedChars, setTotalTypedChars, LiveWPM, roomId]);

  useEffect(() => {
    window.addEventListener("keydown", handleTyping);
    return () => window.removeEventListener("keydown", handleTyping);
  }, [handleTyping]); 

  useEffect(() => {
    if (!isRunning || gameMode === 'casual') return;
    let localElapsed = 0;
    const interval = setInterval(() => {
      localElapsed++;
      if (GameState !== 'playing') {
        setCountDown((prev) => {
          const timeLeft = prev - 1;
          if (timeLeft <= 0 && difficulty !== 'ghost') {
            stopgame('time');
            return 0;
          }
          return timeLeft;
        });
      }

      if (localElapsed % 2 === 0) { 
        const currentCorrect = correctCharsRef.current;
        if (localElapsed > 0) {
          const wpm = (currentCorrect / 5) / (localElapsed / 60);
          const roundedWPM = Math.max(0, Math.round(wpm));
          addWPMEntry(roundedWPM);
          setLiveWPM(roundedWPM);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, gameMode, difficulty, GameState, setCountDown, addWPMEntry, stopgame]);

  useEffect(() => {
      if (!isRunning || difficulty !== 'ghost') return;
      const cpm = deathWPM * 5; 
      const intervalMs = 60000 / cpm;
      const ghostInterval = setInterval(() => {
        let currentGhostPos = 0;
        setGhostIndex((prev) => {
          currentGhostPos = prev + 1;
          return currentGhostPos;
        });
        const currentUserPos = userIndexRef.current;
        if (currentGhostPos > currentUserPos) {
          stopgame('ghost_death');
          clearInterval(ghostInterval);
        }
      }, intervalMs);
      return () => clearInterval(ghostInterval);
    }, [isRunning, difficulty, deathWPM, stopgame, setGhostIndex]);

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
    if (distance <= 2) return "opacity-80 blur-[1px] transition-all duration-150 ease-out";
    if (distance <= 5) return "opacity-60 blur-[1px] text-gray-400 transition-all duration-300 ease-out";
    if (distance <= 8) return "opacity-40 blur-[2px] text-gray-600 transition-all duration-400 ease-out";
    return "opacity-30 blur-[3px] text-gray-700 transition-all duration-500 ease-out";
  };

  return (
    <div className="flex flex-col justify-center items-center w-full text-white select-none mt-4 mb-20 h-full relative -translate-y-12 transition-transform duration-700">
      {difficulty === 'fog' && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.2) 70%, rgba(15, 23, 42, 0.4) 100%)",
            filter: "blur(1px)"
          }}
        />
      )}
      
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className={`flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full mx-auto transition-all duration-400 ${
          textLines.length === 4 ? 'min-h-[300px]' : 'min-h-[250px]'
        }`}>
          {textLines.map((line, lineIndex) => {
            const lineOffset = textLines.slice(0, lineIndex).reduce((acc, l) => acc + l.length + 1, 0);

            return (
              <p
                key={lineIndex}
                className={`tracking-wide text-center transition-all duration-500 ${
                  isFocused ? "opacity-100 blur-0" : "opacity-50 blur-sm"
                } ${
                  textLines.length === 4 && lineIndex === 0 ? 'animate-line-push-up' :
                  textLines.length === 4 && lineIndex === 3 ? 'animate-line-slide-up-from-below' :
                  textLines.length === 4 && (lineIndex === 1 || lineIndex === 2) ? 'transition-transform duration-400 ease-out' :
                  lineIndex === 0 ? 'animate-in fade-in slide-in-from-top-4 duration-700' : ''
                }`}
                style={{
                  wordBreak: "keep-all",
                  whiteSpace: "nowrap",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: window.innerWidth < 640 ? "1.5rem" : "2rem", 
                  lineHeight: "1.2em",
                  minHeight: "1.2em",
                  width: "100%",
                  maxWidth: "1000px", 
                  display: "block",
                  overflow: "visible",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {line.split("").map((char, charIndex) => {
                  const globalIndex = lineOffset + charIndex;
                  const typed = typedChars[globalIndex];
                  const cursorIndex = typedChars.length;
                  const fogClass = getFogClass(globalIndex, cursorIndex);
                  const isGhostHere = difficulty === 'ghost' && globalIndex === ghostIndex;
  
                  if (char === " ") {
                    return (
                      <span key={charIndex} className={`relative inline align-baseline ${fogClass}`}>
                        {globalIndex === typedChars.length && <span className="absolute left-0 top-0" style={cursorStyle} />}
                        {isGhostHere && <span className="absolute left-0 top-0" style={ghostCursorStyle} />}
                        {" "}
                      </span>
                    );
                  }
                  return (
                    <span key={charIndex} className={`relative align-baseline ${fogClass}`}>
                      {globalIndex === typedChars.length && <span className="absolute left-0 top-0" style={cursorStyle} />}
                      {isGhostHere && <span className="absolute left-0 top-0" style={ghostCursorStyle} />}
                      {typed ? (
                        typed.correct ? (
                          <span className="text-[#e2b714] drop-shadow-[0_0_12px_rgba(226,183,20,0.4)]">{char}</span>
                        ) : (
                          <span className="text-[#ca4754] border-b-3 border-[#ca4754] animate-pulse">{typed.expected}</span>
                        )
                      ) : (
                        <span className="text-[#646669]">{char}</span>
                      )}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>

        {GameState !== 'playing' && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                resetGame();
                generateInitialLines();
              }}
              className="p-4 cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              <RotateCcw size={28} className="text-yellow-500" />
            </button>
          </div>
        )}
      </div>

      {!isFocused && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-30 animate-in fade-in duration-300">
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