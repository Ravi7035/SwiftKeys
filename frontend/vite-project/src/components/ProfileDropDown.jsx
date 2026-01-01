import React from 'react';
import { BarChart3, LogOut, User } from 'lucide-react';
import userAuthStore from '../store/AuthenticationStore';
import { useNavigate } from "react-router-dom";

const ProfileDropDown = () => {
    const {logout} =userAuthStore();
    const navigate=useNavigate();
     const stats=()=>
     { 
      navigate("/stats");
     }

  const menuItems = [
    { label: 'Stats', icon: <BarChart3 size={18} />, action: stats },
    { label: 'Logout', icon: <LogOut size={18} />, action: logout },
  ];

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-800 bg-[#0a0a0a] p-2 shadow-2xl ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-150">
   
      <div className="flex flex-col gap-1 ">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={
              item.action
            }
            className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/5 rounded-md transition-all duration-200 group"
          >
            <span className="group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileDropDown;