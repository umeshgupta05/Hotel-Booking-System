import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const [loginType, setLoginType] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login({ email: normalizedEmail, password });

      const isAdminAccount =
        (response.user?.role || "").toUpperCase() === "ROLE_ADMIN";
      const hasPublishedHotel = Boolean(
        response.user?.hotelId || response.user?.hotel_id,
      );
      if (loginType === "ADMIN" && !isAdminAccount) {
        setError("This account is not registered as admin.");
        return;
      }
      if (loginType === "USER" && isAdminAccount) {
        setError("Please choose Admin Login for this account.");
        return;
      }

      login(response.user, response.token);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (isAdminAccount) {
          navigate(
            hasPublishedHotel ? "/admin/dashboard" : "/admin/publish-hotel",
            {
              replace: true,
            },
          );
        } else {
          navigate("/dashboard", {
            replace: true,
          });
        }
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      {/* Liquid Geometry & Ambient Pastel Glow Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-300/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-300/20 blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[20%] left-[60%] w-[300px] h-[300px] rounded-full bg-emerald-200/20 blur-[100px] mix-blend-screen pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md p-10 m-4 relative z-10 rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-violet-300 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to your LuxeStay account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/30 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setLoginType("USER")}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                loginType === "USER"
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType("ADMIN")}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                loginType === "ADMIN"
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Admin Login
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300/40 transition-all shadow-inner"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1 flex justify-between">
              Password
              <Link
                to="/forgot-password"
                className="text-violet-300 hover:text-violet-200 transition-colors normal-case tracking-normal"
              >
                Forgot password?
              </Link>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300/40 transition-all shadow-inner"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="current-password"
              required
            />
            <p className="text-xs text-slate-400 ml-1">
              Password must be at least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-400/80 to-violet-400/80 hover:from-rose-400 hover:to-violet-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-400">
          New to LuxeStay?{" "}
          <Link
            to="/register"
            className="text-rose-300 hover:text-rose-200 font-semibold transition-colors ml-1"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
