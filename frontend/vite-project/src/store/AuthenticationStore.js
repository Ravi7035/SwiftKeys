import { create } from "zustand";
import {axiosInstance} from "../lib/axios.js"; 
import toast from "react-hot-toast";

const userAuthStore = create((set,get) => ({
  userauth: null,
  isSigningup: false,
  isLoginin: false,
  isUpdatingprofile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  checkauth: async () => {
     set({isCheckingAuth:true})
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log(res);
      set({ userauth: res.data });
    } catch (err) {
      console.log(err.response?.data?.message ||  "Auth check failed");
      set({ userauth: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup:async (data)=>
  {
    set({isSigningup:true});
    try{
        const res = await axiosInstance.post("/auth/signup", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    });
        set({userauth:res.data});
        toast.success("account created successfully");
    }
    catch(err)
    {  
        toast.error(err.response?.data?.message);
    }
      
    finally{
        set({isSigningup:false})
    }
  },
  login:async (data)=>
  {
    set({isLoginin:true});
    try{
        const res = await axiosInstance.post("/auth/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
        }
        );
        set({userauth:res.data});
        toast.success("login successfully");
       
    }
    catch(error)
    {
      toast.error(error.response?.data?.message || "something went wrong");
    }
    finally{
      set({isLoginin:false})
    }
  },
  logout:async ()=>
  {
    try{
        await axiosInstance.post("/auth/logout",{ withCredentials: true });
        set({userauth:null});
        toast.success("logout successfull");
    }
    catch(error)
    {
        toast.error("error occurred");
    }
  },
  updatingprofile:async (data)=>
  {
    try{
      set({isUpdatingprofile:true});
      const res=await axiosInstance.put("/auth/updateprofile",data,
        {
          withCredentials:true,
          headers: { "Content-Type": "application/json" }
        }
      );
      set({userauth:res.data});
      toast.success("profile picture updated successfully");

    }
    catch(error)
    {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    finally{
      set({isUpdatingprofile:false})
    }
  }
}
));
export default userAuthStore;
