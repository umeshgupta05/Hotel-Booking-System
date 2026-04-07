import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledEmail = useMemo(() => {
    const emailFromQuery = (searchParams.get("email") || "")
      .trim()
      .toLowerCase();
    return emailFromQuery;
  }, [searchParams]);

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!OTP_REGEX.test(normalizedOtp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.resetPassword({
        email: normalizedEmail,
        otp: normalizedOtp,
        newPassword,
      });

      setSuccess(
        result?.message || "Password reset successful. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message: "Password reset successful. Please log in." },
        });
      }, 1200);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-300/20 blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md p-10 m-4 relative z-10 rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-amber-200 mb-2">
            Reset Password with OTP
          </h2>
          <p className="text-slate-400 text-sm">
            Enter your email, 6-digit OTP, and a new password.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300/40 focus:border-violet-300/40 transition-all shadow-inner"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300/40 focus:border-violet-300/40 transition-all shadow-inner"
              placeholder="6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300/40 focus:border-violet-300/40 transition-all shadow-inner"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300/40 focus:border-violet-300/40 transition-all shadow-inner"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-slate-400 ml-1">
              Use at least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-400/80 to-amber-400/80 hover:from-violet-400 hover:to-amber-400 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Verify OTP and Update Password"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Back to
          <Link
            to="/login"
            className="text-violet-300 hover:text-violet-200 font-semibold transition-colors ml-1"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
