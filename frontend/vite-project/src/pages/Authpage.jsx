import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import userAuthStore from "../store/AuthenticationStore";
import { useState } from "react";

const AuthPage = () => {
  const { userauth } = userAuthStore();
  const [isRegister, setIsRegister] = useState(false);

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 pt-24">
        {!userauth ? (
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-20">
            {/* Left Side - Form Toggle */}
            <div className="flex flex-col items-center justify-center">
              {isRegister ? <RegisterForm /> : <LoginForm />}
              
              {/* Toggle Link */}
              <div className="mt-6 text-center">
                <p className="text-neutral-400 text-sm">
                  {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-yellow-500 hover:text-yellow-600 font-bold transition-colors"
                  >
                    {isRegister ? "Login" : "Create account"}
                  </button>
                </p>
              </div>
            </div>

            {/* Right Side - Branding */}
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Logo/Title Section */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-6">
  
                     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="rela tive w-14 h-14 text-white transition-transform duration-300"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
      <path d="M7 16h10" />
    </svg>
                 
                </div>
                
                <h1 className="text-5xl font-black text-white" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  Swift Keys
                </h1>
                <p className="text-neutral-400 text-lg">Master your typing speed</p>
              </div>

              {/* Features Section */}
              <div className="space-y-5 w-full max-w-sm px-4">
                <div className="flex gap-1 items-start">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Real-time Multiplayer</p>
                    <p className="text-neutral-500 text-xs mt-1">Battle with players worldwide</p>
                  </div>
                </div>

                <div className="flex gap-1 items-start">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Track Progress</p>
                    <p className="text-neutral-500 text-xs mt-1">View detailed statistics and rankings</p>
                  </div>
                </div>

                <div className="flex gap-1 items-start">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Multiple Modes</p>
                    <p className="text-neutral-500 text-xs mt-1">Practice, race, and compete</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-neutral-900 rounded-full blur-3xl absolute bottom-0 right-0 -z-10 opacity-30"></div>
            </div>
          </div>
        ) : (
          <AuthSuccessUI />
        )}
      </main>
    </>
  );
};

export default AuthPage;
