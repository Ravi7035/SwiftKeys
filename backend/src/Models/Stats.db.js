import mongoose from "mongoose";

const StatsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
      bestWpm:  
      { 
        type:Number,
        required:true,
        default:0
      },
      AverageWpm:
      {
        type:Number,
        required:true,
        default:0
      },
      Averageaccuracy:
      {
        type:Number,
        required:true,
        default:0
      }  ,
      TotalTests: { type: Number, default: 0 },
        TotalWins:
        {
            type:Number,
            default:0
        }
});
const Stats=mongoose.model("Stats",StatsSchema);
export default Stats;