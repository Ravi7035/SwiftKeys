import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useGameStore = create((set) => ({

    updateStats: async (data)=>

        {
        try{
            const res=await axiosInstance.post("/",UpdateState,data);

            console.log(res.data?.data);
            }
        catch(err)
            {
                console.log(err);
            }

        }
}));