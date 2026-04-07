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
    <div className="auth-shell">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-300/28 blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/28 blur-[150px] pointer-events-none animate-float-reverse"></div>
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-300/20 blur-[100px] pointer-events-none animate-float-slow"></div>

      <div className="auth-card">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-orange-200 mb-2">
            Create Account
          </h2>
          <p className="text-slate-300 text-sm">
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
                  ? "bg-cyan-500/30 text-white"
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
                  ? "bg-cyan-500/30 text-white"
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
              className="auth-input"
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
              className="auth-input"
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
              className="auth-input"
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
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-400/85 via-blue-500/85 to-orange-400/85 hover:from-cyan-400 hover:via-blue-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all shadow-[0_0_24px_rgba(56,189,248,0.26)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-200 hover:text-white font-semibold transition-colors ml-1"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
