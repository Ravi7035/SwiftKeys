import { Keyboard, Swords, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileDropDown from "./ProfileDropDown";
import userAuthStore from "../store/AuthenticationStore.js";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ButtonGroup = ({ onPracticeClick }) => {
  const [activeItem, setActiveItem] = useState("practice");
  const [showProfile, setShowProfile] = useState(false);
  const { userauth, checkauth } = userAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkauth();
  }, [checkauth]);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/home") setActiveItem("practice");
    else if (pathname === "/multiplayer") setActiveItem("battle");
    else if (pathname === "/leaderboard") setActiveItem("leaderboard");
    else setActiveItem(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!userauth) setShowProfile(false);
  }, [userauth]);

  const navItems = [
    { id: "practice", icon: Keyboard, label: "Practice" },
    { id: "battle", icon: Swords, label: "Battle" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === "practice") {
      if (onPracticeClick) onPracticeClick();
      navigate("/");
    } else if (itemId === "battle") {
      if (userauth) navigate("/multiplayer");
      else {
        toast.error("Sign in first");
        navigate("/auth");
      }
    } else if (itemId === "leaderboard") {
      navigate("/leaderboard");
    }
  };

  const tooltipStyle = "absolute top-full mt-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-neutral-700/50 z-50 tracking-wider";

  return (
    // Reduced padding for mobile (py-2 px-2) to maximize space
    <nav className="w-full flex items-center justify-between py-2 md:py-6 px-2 md:px-12 select-none">
      
      {/* --- LEFT SIDE: NAVIGATION --- */}
      {/* Tightened gaps for mobile (gap-4) */}
      <div className="flex items-center gap-4 md:gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`group relative transition-all duration-300 ${
                isActive ? "text-yellow-500" : "text-neutral-500 hover:text-neutral-200"
              }`}
            >
              {/* COMPACT SIZE: Reduced to h-4.5 w-4.5 on mobile */}
              <Icon className="h-[18px] w-[18px] md:h-6 md:w-6 cursor-pointer transform transition-transform group-hover:scale-110" />
              <span className={tooltipStyle}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- RIGHT SIDE: PROFILE --- */}
      <div className="flex items-center relative">
        <button
          className="group cursor-pointer flex items-center gap-2 md:gap-3"
          onClick={() => {
            if (userauth) setShowProfile(!showProfile);
            else navigate("/auth");
          }}
        >
          {userauth ? (
            <>
              {/* Hide username on mobile to keep navbar clean */}
              <div className="hidden md:block text-right">
                <div className="text-[12px] font-extrabold text-neutral-200 group-hover:text-yellow-500 transition-colors uppercase tracking-tight leading-none">
                  {userauth.username}
                </div>
              </div>

              {userauth.profile_pic && userauth.profile_pic.trim() ? (
                <img
                  src={userauth.profile_pic}
                  alt="avatar"
                  // Small avatar for mobile
                  className="h-6 w-6 md:h-9 md:w-9 rounded-full object-cover border border-neutral-800 group-hover:border-yellow-500 transition-all duration-300"
                />
              ) : (
                <div className="h-6 w-6 md:h-9 md:w-9 rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-yellow-500 transition-all flex items-center justify-center">
                   <User className="h-3.5 w-3.5 md:h-5 md:w-5 text-neutral-400 group-hover:text-yellow-500" />
                </div>
              )}
            </>
          ) : (
             <div className="p-1.5 rounded-full hover:bg-white/5 transition-colors group">
                <User className="h-5 w-5 md:h-6 md:w-6 text-neutral-400 group-hover:text-yellow-500 transition-colors" />
             </div>
          )}
        </button>

        {showProfile && (
          <div className="absolute right-0 top-full mt-3 z-50">
            <ProfileDropDown />
          </div>
        )}
      </div>
    </nav>
  );
};

export default ButtonGroup;