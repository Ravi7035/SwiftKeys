import { useEffect } from "react";
import useLeaderboardStore from "../store/LeaderboardStore.js";
import userAuthStore from "../store/AuthenticationStore.js";
import { Trophy, RefreshCw, User } from "lucide-react";
import { Spinner } from "./ui/spinner.jsx";

const LeaderboardUI = () => {
  const { leaderboard, fetchLeaderboard, isLoadingLeaderboard } = useLeaderboardStore();
  const { userauth } = userAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (isLoadingLeaderboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 sm:p-12 backdrop-blur-sm text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <Trophy size={28} className="text-black" />
            </div>
            <Spinner className="w-12 h-12 text-yellow-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Leaderboard</h3>
          <p className="text-gray-400 text-sm">Fetching the latest rankings...</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  const getDisplayName = (username) => (userauth?.username === username ? "You" : username);
  const isCurrentUser = (username) => userauth?.username === username;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 pt-20 sm:pt-24 select-none animate-in fade-in duration-500" style={{ fontFamily: '"JetBrains Mono", monospace' }}>

      {/* Header */}
      <div className="flex items-center justify-center mb-6 sm:mb-8 px-2">
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-[#e2b714] sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase bg-gradient-to-r from-white to-[#e2b714] bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Podium (Top 3) - Scaled for mobile */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8 sm:mb-10">
        {podiumOrder.map((entry) => {
          const actualRank = leaderboard.indexOf(entry) + 1;
          const isFirst = actualRank === 1;

          return (
            <div key={entry._id} className={`flex flex-col items-center transition-all duration-300 ${isFirst ? 'flex-1 z-10' : 'flex-1 opacity-80 sm:opacity-70'}`}>
              <div className="mb-1 text-xs sm:text-sm font-bold text-[#646669]">
                #{actualRank}
              </div>

              {/* Avatar Box */}
              <div className={`mb-2 rounded-lg sm:rounded-xl flex items-center justify-center border-2 
                ${isFirst ? 'w-12 h-12 sm:w-16 sm:h-16 border-yellow-500 bg-yellow-500/5' : 'w-10 h-10 sm:w-14 sm:h-14 border-[#2c2e31] bg-[#1d1f23]'}`}>
                <User size={isFirst ? 24 : 18} className="text-white opacity-30" />
              </div>

              {/* Stats Box */}
              <div className={`w-full p-2 sm:p-4 rounded-lg sm:rounded-xl border text-center backdrop-blur-sm
                ${isFirst ? 'border-yellow-500/30 bg-gradient-to-b from-yellow-500/5 to-[#2c2e31]/60 shadow-lg shadow-yellow-500/10' : 'border-[#2c2e31] bg-[#1d1f23]/50'}
                ${isCurrentUser(entry.username) ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''}`}>
                
                <p className={`text-[10px] sm:text-sm font-bold truncate mb-1 sm:mb-3 ${isCurrentUser(entry.username) ? 'text-blue-400' : 'text-white'}`}>
                  {getDisplayName(entry.username)}
                </p>
                
                <div className="flex flex-col sm:gap-1">
                  <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
                    <span className={`font-black bg-gradient-to-r ${isFirst ? 'from-[#e2b714] to-yellow-400 bg-clip-text text-transparent text-xl sm:text-3xl' : 'from-white to-[#e2b714] bg-clip-text text-transparent text-lg sm:text-2xl'}`}>
                      {entry.WPM}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-[#646669] font-bold uppercase">WPM</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-[10px] sm:text-xs font-bold ${entry.Accuracy >= 95 ? 'text-green-400' : entry.Accuracy >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {entry.Accuracy.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      {/* Enhanced Table Section */}
<div className="w-full bg-gradient-to-b from-[#1d1f23]/40 to-[#1d1f23]/20 rounded-xl border border-[#2c2e31]/50 backdrop-blur-sm shadow-lg overflow-hidden">
  
  {/* Header: Added 'pl' to 'User' to account for the icon in the rows below */}
  <div className="flex px-4 sm:px-8 py-3 bg-[#2c2e31]/30 text-[#646669] text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b border-[#2c2e31]/50">
    <span className="w-12 sm:w-20">Rank</span>
    <span className="flex-1 text-left sm:text-left sm:pl-11">User</span> {/* pl-11 aligns 'User' text with the names */}
    <span className="w-16 sm:w-28 text-right">WPM</span>
    <span className="w-16 sm:w-28 text-right">ACC</span>
  </div>

  {/* Scrollable Body */}
  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
    {remaining.map((entry, index) => {
      const rank = index + 4;
      const isMe = isCurrentUser(entry.username);
      
      return (
        <div key={entry._id} className={`flex items-center px-4 sm:px-8 py-3 border-b transition-all duration-200
          ${isMe ? 'border-blue-500/30 bg-blue-500/5' : 'border-[#2c2e31]/20 hover:bg-[#2c2e31]/30'}`}>
          
          {/* Rank Column */}
          <span className={`w-12 sm:w-20 text-xs sm:text-sm font-medium ${isMe ? 'text-blue-400' : 'text-[#646669]'}`}>
            #{rank}
          </span>

          {/* User Column: Icon and Name */}
          <div className="flex-1 flex items-center gap-10 sm:gap-10 min-w-0">
            <div className={`hidden sm:flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0
              ${isMe ? 'bg-blue-500/20' : 'bg-[#2c2e31]'}`}>
              <User size={14} className={isMe ? 'text-blue-400' : 'text-[#e2b714]/60'} />
            </div>
            <span className={`text-xs sm:text-sm text-right font-bold truncate ${isMe ? 'text-blue-400' : 'text-white'}`}>
              {getDisplayName(entry.username)}
            </span>
          </div>

          {/* Stats Columns */}
          <div className="w-16 sm:w-28 text-right">
            <span className={`font-bold text-sm sm:text-lg ${isMe ? 'text-yellow-400' : 'text-[#e2b714]'}`}>
              {entry.WPM}
            </span>
          </div>

          <div className="w-16 sm:w-28 text-right">
            <span className={`text-xs sm:text-sm font-bold ${isMe ? 'text-yellow-400' : entry.Accuracy >= 95 ? 'text-green-400' : 'text-gray-400'}`}>
              {entry.Accuracy.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>
      
      {/* Footer / Refresh */}
      <div className="mt-6 sm:mt-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-[#646669]/20 flex-1"></div>
          <button
            onClick={() => fetchLeaderboard()}
            disabled={isLoadingLeaderboard}
            className="flex items-center gap-2 text-[10px] text-[#646669] uppercase tracking-widest hover:text-[#e2b714] transition-colors"
          >
            Refresh
            <RefreshCw size={12} className={isLoadingLeaderboard ? 'animate-spin' : ''} />
          </button>
          <div className="h-px bg-[#646669]/20 flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardUI;