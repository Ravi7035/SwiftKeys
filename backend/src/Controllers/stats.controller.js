import Stats from "../Models/Stats.db.js";

export const UpdateStats = async (req, res) => {
  try {
    console.log("Stats update request received:", req.body);
    const { Wpm, Accuracy,type,Winner} = req.body;
    const UserId = req.user._id;
    console.log("User ID:", UserId);
    const winner = Winner; // Winner is now sent as a string directly
    const PresentStatsDetails = await Stats.findOne({ userId: UserId });
    if (!PresentStatsDetails) {
      return res.status(404).json({ message: "User stats not found" });
    }
    // property names must match schema exactly
    const CurrentTotalTests = PresentStatsDetails.TotalTests;
    const CurrentbestWpm = PresentStatsDetails.bestWpm;
    const CurrentAverageWpm = PresentStatsDetails.AverageWpm;
    const CurrentAverageAccuracy = PresentStatsDetails.Averageaccuracy;
    const CurrentTotalWins=PresentStatsDetails.TotalWins;

    // Updated metrics
    const UpdatedTotalTests = CurrentTotalTests + 1;
    let isAdd=0;

    //checking type - singlemode or multiplayer
    console.log("Win check - Type:", type, "Winner:", winner, "Will increment wins:", (type==="multiplayer" && winner==='You'));
    if(type==="multiplayer"  &&  winner==='You'){
      isAdd=1;
      console.log("Win detected! Incrementing total wins from", CurrentTotalWins, "to", CurrentTotalWins + 1);
    }
    const UpdatedTotalWins=CurrentTotalWins+isAdd;

    const UpdatedbestWpm =
      Wpm > CurrentbestWpm ? Wpm : CurrentbestWpm;

    const UpdatedAverageWpm =
      (CurrentAverageWpm * CurrentTotalTests + Wpm) / UpdatedTotalTests;

    const UpdatedAverageAccuracy =
      (CurrentAverageAccuracy * CurrentTotalTests + Accuracy) / UpdatedTotalTests;

    const UpdatedStatsDetails = await Stats.findOneAndUpdate(
      { userId: UserId },
      {
        bestWpm: UpdatedbestWpm,
        TotalTests: UpdatedTotalTests,
        TotalWins:UpdatedTotalWins,
        AverageWpm: UpdatedAverageWpm,
        Averageaccuracy: UpdatedAverageAccuracy
      },
      { new: true }
    );
    if(UpdatedStatsDetails)
    {
     console.log(UpdatedStatsDetails);
    }
    res.status(200).json({
      success: true,
      stats: UpdatedStatsDetails
    });

  } catch (err) {
    console.error("Error updating stats:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const RetrieveStats = async (req, res) => {
  try {
    console.log(req.user);
    const UserId = req.user._id;

    // use findOne, not findById
    let UserStats = await Stats.findOne({ userId: UserId });

    if (!UserStats) {
      UserStats = new Stats({
        userId: UserId,
        bestWpm: 0,
        AverageWpm: 0,
        Averageaccuracy: 0,
        TotalTests: 0,
        TotalWins: 0
      });

      await UserStats.save();
    }

    res.status(200).json({
      success: true,
      stats: UserStats
    });

  } catch (err) {
    console.error("Error retrieving stats:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
