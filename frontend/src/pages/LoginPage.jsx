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
    <div className="auth-shell">
      <div className="absolute top-[-12%] left-[-8%] w-[520px] h-[520px] rounded-full bg-cyan-300/30 blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[-20%] right-[-8%] w-[620px] h-[620px] rounded-full bg-blue-300/30 blur-[150px] pointer-events-none animate-float-reverse"></div>
      <div className="absolute top-[22%] left-[60%] w-[320px] h-[320px] rounded-full bg-orange-300/25 blur-[110px] pointer-events-none animate-float-slow"></div>

      <div className="auth-card">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-orange-200 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-300 text-sm">
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
                  ? "bg-cyan-500/30 text-white"
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
                  ? "bg-cyan-500/30 text-white"
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
              className="auth-input"
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
                className="text-cyan-200 hover:text-white transition-colors normal-case tracking-normal"
              >
                Forgot password?
              </Link>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
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
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-400/85 via-blue-500/85 to-orange-400/85 hover:from-cyan-400 hover:via-blue-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all shadow-[0_0_24px_rgba(56,189,248,0.26)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-300">
          New to LuxeStay?{" "}
          <Link
            to="/register"
            className="text-cyan-200 hover:text-white font-semibold transition-colors ml-1"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
