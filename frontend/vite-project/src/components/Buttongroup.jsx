import { Keyboard, Settings, Swords, Trophy, Bell, User } from "lucide-react";
import { useState } from "react";

const ButtonGroup = ({ onPracticeClick }) => {
  const [activeItem, setActiveItem] = useState("practice");

  const navItems = [
    { id: "practice", icon: Keyboard, label: "Start Typing" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "battle", icon: Swords, label: "Battle" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const rightItems = [
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const handleNavClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === "practice" && onPracticeClick) {
      onPracticeClick();
    }
  };

  // Reusable styles for the tooltip bubble
  const tooltipStyle = "absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-neutral-700/50 z-50";

  return (
    <div className="relative flex items-center justify-between w-full py-4">
      
      {/* 1. CENTER GROUP */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              // 1. Added 'group' and 'relative' to parent button
              // 2. Removed 'hover:scale-110' from here (moved to Icon) to prevent tooltip from scaling
              className={`
                group relative
                transition-all duration-300 ease-out 
                ${isActive ? "text-yellow-500" : "text-neutral-600 hover:text-neutral-400"}
              `}
            >
              {/* Icon scales independently using group-hover */}
              <Icon
                className="h-6 w-6 cursor-pointer transform transition-transform duration-300 group-hover:scale-110"
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* TOOLTIP COMPONENT */}
              <span className={tooltipStyle}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. SPACER */}
      <div className="flex-grow"></div>

      {/* 3. RIGHT GROUP */}
      <div className="flex items-center gap-8 pr-8">
        {rightItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              // Added 'group' and 'relative' here too
              className="group relative text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
              aria-label={item.label}
            >
              <Icon 
                className="h-6 w-6 cursor-pointer transform transition-transform duration-300 group-hover:scale-110" 
                strokeWidth={2} 
              />
              
              {/* TOOLTIP COMPONENT */}
              <span className={tooltipStyle}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;