import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://swiftkeys.onrender.com/api",
  withCredentials: true
});


