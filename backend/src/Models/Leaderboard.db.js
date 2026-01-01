
import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    WPM: {
        type: Number,
        required: true
    },
    Accuracy: {
        type: Number,
        required: true
    },
    rank: {
        type: Number
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
Leaderboard.index({ WPM: -1 });