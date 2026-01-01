import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const useLeaderboardStore = create((set, get) => ({
  // State
  leaderboard: [],
  isLoadingLeaderboard: false,

  // Actions

  // Fetch global leaderboard
  fetchLeaderboard: async (limit = 10) => {
    set({ isLoadingLeaderboard: true });
    try {
      const res = await axiosInstance.get(`/leaderboard?limit=${limit}`);
      set({ leaderboard: res.data.leaderboard });
      return res.data.leaderboard;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
      return null;
    } finally {
      set({ isLoadingLeaderboard: false });
    }
  },

  // Clear leaderboard data (for logout)
  clearLeaderboard: () => {
    set({
      leaderboard: []
    });
  }
}));

export default useLeaderboardStore;
