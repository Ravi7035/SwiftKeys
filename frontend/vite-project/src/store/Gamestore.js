import { create } from "zustand";

export const useGameStore = create((set) => ({
  // --- STATE VARIABLES ---
  gameMode: "time",
  gameDuration: 30,
  difficulty: "none",
  savedDifficulty: "none",
  deathWPM: 60,

  OnlineUsers: 0,

  GameState: "Idle",
  OpponentProgress: 0,
  text: '',
  roomId: null,

  typedChars: [],

  countdown: 30,
  isRunning: false,
  isTyping: false,
  isGameover: false,
  gameOverReason: null,

  TotalTypedChars: 0,
  CorrectChars: 0,

  WPM_History: [],
  ghostIndex: 0,

  // --- ACTIONS ---

  setGameState: (status) => set({ GameState: status }),

  // ✅ FIXED
  setGameData: (data) => set({
    GameState: "playing",
    text: data.text,
    roomId: data.roomId,
    OpponentProgress: 0,
    typedChars: [],
    TotalTypedChars: 0,
    CorrectChars: 0,
    WPM_History: [],
    ghostIndex: 0
  }),

  setOpponentProgress: (progress) => set({ OpponentProgress: progress }),

  setTypedChars: (updater) => set((state) => ({
    typedChars: typeof updater === "function" ? updater(state.typedChars) : updater
  })),

  setOnlineUsers:(data)=>{
    set({ OnlineUsers: data.TotalNumberOnline })
  },

  setCorrectChars: (value) => set({ CorrectChars: value }),

  setTotalTypedChars: (value) =>
    set((state) => ({
      TotalTypedChars: typeof value === "function" ? value(state.TotalTypedChars) : value,
    })),

  setGameMode: (mode) => set({ gameMode: mode }),
  setDifficulty: (diff) => set({ difficulty: diff }),
  setSavedDifficulty: (diff) => set({ savedDifficulty: diff }),
  setDeathWPM: (wpm) => set({ deathWPM: wpm }),

  addWPMEntry: (wpm) =>
    set((state) => ({ WPM_History: [...state.WPM_History, wpm] })),

  resetWPMHistory: () => set({ WPM_History: [] }),

  setGameDuration: (duration) => set({ gameDuration: duration, countdown: duration }),

  startgame: () => {
    set({
      isTyping: true,
      isRunning: true,
      isGameover: false,
      gameOverReason: null,
      WPM_History: [],
      ghostIndex: 0
    });
  },

  stopgame: (reason = 'time') => {
    set((state) => ({
      isRunning: false,
      isGameover: true,
      gameOverReason: reason,
      countdown: state.countdown
    }));
  },

  setCountDown: (updater) =>
    set((state) => ({
      countdown: typeof updater === "function" ? updater(state.countdown) : updater,
    })),

  setGhostIndex: (val) =>
    set((state) => ({
      ghostIndex: typeof val === 'function' ? val(state.ghostIndex) : val
    })),

  resetGame: () =>
    set((state) => ({
      GameState: "Idle",
      roomId: null,
      text: '',
      OpponentProgress: 0,
      typedChars: [],
      countdown: state.gameDuration,
      isRunning: false,
      isTyping: false,
      isGameover: false,
      gameOverReason: null,
      TotalTypedChars: 0,
      CorrectChars: 0,
      WPM_History: [],
      ghostIndex: 0
    })),
}));
