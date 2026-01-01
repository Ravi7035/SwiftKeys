import { useEffect } from "react";
import useLeaderboardStore from "../store/LeaderboardStore.js";
import { Trophy, Medal, Award, Crown, RefreshCw } from "lucide-react";

const LeaderboardUI= () => {
  const {
    leaderboard,
    fetchLeaderboard,
    isLoadingLeaderboard
  } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500 h-6 w-6" />;
      case 2:
        return <Medal className="text-gray-400 h-6 w-6" />;
      case 3:
        return <Award className="text-amber-600 h-6 w-6" />;
      default:
        return <Trophy className="text-[#e2b714] h-5 w-5" />;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/20";
      case 2:
        return "bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/20";
      case 3:
        return "bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/20";
      default:
        return "bg-[#2c2e31]/30 border-[#2c2e31]";
    }
  };

  if (isLoadingLeaderboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#e2b714] text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center relative">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="text-[#e2b714] h-8 w-8" />
          <h1 className="text-4xl font-bold text-[#e2b714]">Leaderboard</h1>
        </div>
        <p className="text-[#646669]">Top typists across all game modes</p>
        <button
          onClick={() => fetchLeaderboard()}
          disabled={isLoadingLeaderboard}
          className="absolute right-0 top-0 p-2 rounded-lg bg-[#2c2e31]/30 hover:bg-[#2c2e31]/50 border border-[#2c2e31] transition-all duration-200 disabled:opacity-50"
          title="Refresh leaderboard"
        >
          <RefreshCw className={`h-5 w-5 text-[#e2b714] ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          return (
            <div
              key={entry._id || index}
              className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${getRankBg(rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1d1f23] border border-[#2c2e31]">
                    {getRankIcon(rank)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">#{rank}</span>
                      <span className="text-xl font-semibold text-white">{entry.username}</span>
                    </div>
                    <div className="text-sm text-[#646669]">
                      {entry.gameMode} • {entry.difficulty}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-sm text-[#646669] uppercase tracking-wide">Best WPM</div>
                    <div className="text-2xl font-bold text-[#e2b714]">{entry.WPM}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#646669] uppercase tracking-wide">Avg Accuracy</div>
                    <div className="text-2xl font-bold text-[#e2b714]">{entry.Accuracy.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#646669] uppercase tracking-wide">Games</div>
                    <div className="text-lg font-semibold text-[#e2b714]">{entry.totalMatches}</div>
                  </div>
                </div>
              </div>

              {rank <= 3 && (
                <div className="mt-4 flex justify-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    rank === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                    'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                  }`}>
                    {rank === 1 ? '🏆 Champion' : rank === 2 ? '🥈 Runner-up' : '🥉 Third Place'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 && !isLoadingLeaderboard && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-16 w-16 text-[#646669] mb-4" />
          <h3 className="text-xl font-medium text-[#646669] mb-2">No entries yet</h3>
          <p className="text-[#646669]">Be the first to set a record!</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-[#646669] pt-6 border-t border-[#2c2e31]">
        Rankings based on best WPM from user statistics • Updated automatically after games
      </div>
    </div>
  );
};

export default LeaderboardUI;
