import mongoose from "mongoose";
const StatsSchema=mongoose.Schema(
    {
      userId:
      {
        type:ObjectId,
        ref:User
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
      totalMatches: { type: Number, default: 0 },
        Wins:
        {
            type:Number,
            required:true
        },
        history: [
            {
              wpm: Number,
              date: { type: Date, default: Date.now }
            }
          ]
});
const Stats=mongoose.model("Stats",StatsSchema);
export default Stats;