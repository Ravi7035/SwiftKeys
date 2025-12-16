import { Keyboard } from "lucide-react";
import ButtonGroup from "./Buttongroup";

const Navbar = ({ onPracticeClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-18">
        <div className="flex items-center gap-3 group cursor-pointer select-none">
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md scale-0 group-hover:scale-125 transition-all duration-500 ease-out"></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative w-8 h-8 text-yellow-500 transition-transform duration-300 "
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
      <path d="M7 16h10" />
    </svg>
  </div>

  <h1
    className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-sm transition-all duration-300"
    style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
  >
    SWIFT<span className="text-neutral-200">KEYS</span>
  </h1>
</div>
          <ButtonGroup onPracticeClick={onPracticeClick} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
