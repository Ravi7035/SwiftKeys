import Stats from "../Models/Stats.db.js";
//Get global leaderboard (top players by best WPM from Stats collection)
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Query Stats collection and populate user information
    const leaderboard = await Stats.find({})
      .populate('userId', 'username')
      .sort({ bestWpm: -1 })
      .limit(limit)
      .select('bestWpm AverageWpm Averageaccuracy TotalTests TotalWins userId');

    // Handle backward compatibility for old stats documents
    const User = (await import('../Models/user.model.js')).default;
    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        let username = entry.userId?.username;
        // If no userId field (old format), use _id as userId
        if (!username && entry._id) {
          const user = await User.findById(entry._id).select('username');
          username = user?.username;
        }
        return {
          _id: entry._id,
          username: username || 'Unknown',
          WPM: entry.bestWpm,
          Accuracy: entry.Averageaccuracy,
          totalMatches: entry.TotalTests,
          Wins: entry.TotalWins,
          gameMode: 'all',
          difficulty: 'mixed'
        };
      })
    );

    res.status(200).json({
      success: true,
      leaderboard: populatedLeaderboard
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leaderboard"
    });
  }
};
