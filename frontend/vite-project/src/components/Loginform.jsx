import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import userAuthStore from "../store/AuthenticationStore";
import toast from "react-hot-toast";

const LoginForm = () => {
  const { login } = userAuthStore();
  const [FormData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!FormData.email) {
      toast.error("Email required");
      return false;
    }
    if (!FormData.password) {
      toast.error("Password required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await login(FormData);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm"
    >
      <div className="bg-gradient-to-b from-neutral-700 to-neutral-800 border border-neutral-600 rounded-2xl p-8 shadow-2xl flex flex-col h-[450px] backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            Welcome back
          </h2>
          <p className="text-neutral-400 text-sm">Enter your credentials to access your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          {/* Email Field */}
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-300 font-bold block mb-2.5 flex items-center gap-2">
              <Mail size={15} /> Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={FormData.email}
              onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-600 bg-neutral-900/50 text-white placeholder-neutral-500 hover:border-neutral-500 focus:border-yellow-500 focus:bg-neutral-900 focus:outline-none transition-all text-sm font-medium"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-300 font-bold block mb-2.5 flex items-center gap-2">
              <Lock size={15} /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={FormData.password}
              onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-600 bg-neutral-900/50 text-white placeholder-neutral-500 hover:border-neutral-500 focus:border-yellow-500 focus:bg-neutral-900 focus:outline-none transition-all text-sm font-medium"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 rounded-lg transition-all duration-200 mt-auto cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
