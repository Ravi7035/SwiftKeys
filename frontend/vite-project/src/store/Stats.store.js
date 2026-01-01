import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useStatsStore = create((set) => ({
    UserStats:null,
    updateStats: async (data)=>
        {
        try{
            console.log("Sending stats update:", data);
            const res=await axiosInstance.post("/Stats",data);
            console.log("Stats update response:", res.data?.stats);
            }
        catch(err)
            {
                console.log("Stats update error:", err.response?.data || err.message);
                console.log("Full error:", err);
            }
        }
        ,
        retrieveStats:async ()=>
        {
            try
            {
                const res=await axiosInstance.get("/Stats");
                set({UserStats:res.data?.stats});
                console.log("successfully fetched from db");
            }
            catch(err)
            {
                console.log("error here")
            }
        }
}));