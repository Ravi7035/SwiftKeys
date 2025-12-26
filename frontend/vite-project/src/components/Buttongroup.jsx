import { Keyboard, Settings, Swords, Trophy, User } from "lucide-react";
import { useState } from "react";
import ProfileDropDown from "./ProfileDropDown";

const ButtonGroup = ({ onPracticeClick }) => {
  const [activeItem, setActiveItem] = useState("practice");
  const [showProfile, setShowProfile] = useState(false); // State to toggle dropdown

  const navItems = [
    { id: "practice", icon: Keyboard, label: "Start Typing" },
    { id: "battle", icon: Swords, label: "Battle" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const rightItems = [
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === "practice" && onPracticeClick) {
      onPracticeClick();
    }
  };

  const tooltipStyle = "absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-neutral-700/50 z-50";

  return (
    <div className="relative flex items-center justify-end w-full py-4 px-8">
      
      {/* 1. CENTER GROUP (Absolute Centering) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`group relative transition-all duration-300 ${
                isActive ? "text-yellow-500" : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              <Icon className="h-6 w-6 cursor-pointer transform transition-transform group-hover:scale-110" />
              <span className={tooltipStyle}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. RIGHT GROUP */}
      <div className="flex items-center gap-6">
        {rightItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative ">
              <button
                className="group cursor-pointer relative text-neutral-600 hover:text-neutral-300 transition-colors"
                onClick={() => {
                  if (item.id === "profile") setShowProfile(!showProfile);
                }}
              >
                <Icon className="h-6 w-6 transform transition-transform group-hover:scale-110" />
                <span className={tooltipStyle}>{item.label}</span>
              </button>

              {item.id === "profile" && showProfile && (
                <div className="absolute right-0 mt-2 top-full z-[100]">
                  <ProfileDropDown />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;