import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route,Navigate} from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Homepage.jsx";
import StatsUI from "./components/Stats.jsx";
import LeaderboardUI from "./components/Leaderboard.jsx";
import MultiplayerMode from "./components/MultiplayerMode.jsx"
import { useGameStore } from "./store/Gamestore.js";
import { Toaster } from "react-hot-toast";
import userAuthStore  from "./store/AuthenticationStore.js";
import ProfileDropDown from "./components/ProfileDropDown.jsx";
import UserDetails from "./components/userdetails.jsx";

function App() {
 
  const {userauth,checkauth}=userAuthStore();

  useEffect(()=>
  {
    checkauth();
  },[])
  
  const [refreshKey, setRefreshKey] = useState(0);
   const {
    resetGame
  } = useGameStore();
  
  const handlePracticeClick = () => {
    setRefreshKey((prev) => prev + 1);
    resetGame()
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar onPracticeClick={handlePracticeClick} />
      <Routes>
        <Route path="/" element={<HomePage refreshKey={refreshKey} />} />
        <Route path="/auth" element={!userauth ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/multiplayer" element={userauth ? <MultiplayerMode/> : <Navigate to="/auth"/>}/>
        <Route path="/profile" element={userauth ? <ProfileDropDown/> : <Navigate to="/auth" />} />
        <Route path="/stats" element={userauth ? <StatsUI/> : <Navigate to="/auth" />} />
        <Route path="/userdetails" element={userauth ? <UserDetails/> : <Navigate to="/auth" />} />
        <Route path="/leaderboard" element={<LeaderboardUI/>}/>
      </Routes>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "14px",
            padding: "8px 12px",
            borderRadius: "8px",
          },
        }}
        containerStyle={{
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

export default App;
