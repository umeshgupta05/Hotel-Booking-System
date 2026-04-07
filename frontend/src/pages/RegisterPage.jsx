import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
    hotelId: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = formData.email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      await api.register({
        ...formData,
        email: normalizedEmail,
        hotelId:
          formData.role === "ROLE_ADMIN" &&
          Number.isFinite(Number(formData.hotelId))
            ? Number(formData.hotelId)
            : null,
      });
      navigate("/login", {
        state: { message: "Registration successful. Please log in." },
      });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      {/* Liquid Geometry & Ambient Pastel Glow Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-rose-300/20 blur-[130px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/10 blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-fuchsia-300/10 blur-[100px] mix-blend-screen pointer-events-none animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-10 m-4 relative z-10 rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-orange-200 mb-2">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm">
            Join LuxeStay and book premium hotels
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/30 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  role: "ROLE_USER",
                  hotelId: null,
                }))
              }
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.role === "ROLE_USER"
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              User Signup
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  role: "ROLE_ADMIN",
                  hotelId: null,
                }))
              }
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.role === "ROLE_ADMIN"
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Admin Signup
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300/40 transition-all shadow-inner"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300/40 transition-all shadow-inner"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300/40 transition-all shadow-inner"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-slate-400 ml-1">
              Use at least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>

          {formData.role === "ROLE_ADMIN" && (
            <div className="p-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200 text-sm">
              On first login, you can publish your hotel by entering full hotel
              and address details.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-400/80 to-orange-400/80 hover:from-rose-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(251,146,60,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-rose-300 hover:text-rose-200 font-semibold transition-colors ml-1"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
