import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { ApiError } from "../lib/api";
import { useAuth } from "../state/auth";
import type { UserRole } from "../lib/types";

interface LoginPageProps {
  onAuthed: (role: UserRole) => void;
  isDarkMode: boolean;
}

export function LoginPage({ onAuthed }: LoginPageProps) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isRegister) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/.test(password)) {
        setError("Password must contain at least one special character.");
        return;
      }
    }
    try {
      const user = isRegister ? await register(name, email, password) : await login(email, password);
      onAuthed(user.role);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-white/10 dark:backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-white/20 transition-colors duration-300">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">CL</span>
            </div>
            <h2 className="text-3xl text-gray-900 dark:text-white transition-colors">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors">
              {isRegister 
                ? "Join CivicLink to report and track issues" 
                : "Sign in to your CivicLink account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 dark:backdrop-blur-xl border border-red-200 dark:border-red-500/30 text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-[#2563eb] transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                Email or Username
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-[#2563eb] transition-colors" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-[#2563eb] transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="mr-2 rounded cursor-pointer" />
                  <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-[#2563eb] dark:text-blue-400 hover:text-[#1d4ed8] dark:hover:text-blue-300 hover:underline transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white py-3 rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02]"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#2563eb] dark:text-blue-400 hover:text-[#1d4ed8] dark:hover:text-blue-300 hover:underline transition-colors"
              >
                {isRegister ? "Sign In" : "Register"}
              </button>
            </p>
          </div>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-500/10 dark:to-green-500/10 dark:backdrop-blur-xl rounded-xl border border-blue-100 dark:border-blue-500/30 transition-colors">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed transition-colors">
              <strong className="text-[#2563eb] dark:text-blue-400">Tip:</strong> If you can’t access the admin dashboard, your account needs the admin role on the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}