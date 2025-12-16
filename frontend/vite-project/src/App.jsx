import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Authpage.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Homepage.jsx";
import MultiplayerMode from "./components/MultiplayerMode.jsx"
import { useGameStore } from "./store/Gamestore.js";

function App() {
  
  const [refreshKey, setRefreshKey] = useState(0);
   const {
    resetGame
  } = useGameStore();
  

  const handlePracticeClick = () => {
    setRefreshKey((prev) => prev + 1);
    resetGame()
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar onPracticeClick={handlePracticeClick} />


      <Routes>
        <Route path="/" element={<HomePage refreshKey={refreshKey} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/multiplayer" element={<MultiplayerMode/>}/>
      </Routes>
    </div>
  );
}

export default App;
