import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = (user?.role || "").toUpperCase() === "ROLE_ADMIN";
  const hasPublishedHotel = Boolean(user?.hotelId || user?.hotel_id);
  const adminHomePath = hasPublishedHotel
    ? "/admin/dashboard"
    : "/admin/publish-hotel";
  const primaryAccountPath = isAdmin ? adminHomePath : "/dashboard";

  const navClass = (to) => {
    const active = location.pathname === to;
    return `${
      active
        ? "text-white bg-white/16 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        : "text-slate-200/95 hover:text-white hover:bg-white/10"
    } px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300`;
  };

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/35 bg-[linear-gradient(120deg,rgba(9,25,40,0.94),rgba(8,34,58,0.9))] shadow-[0_18px_44px_rgba(8,20,35,0.28)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                onClick={closeMobile}
                className="text-xl font-bold flex items-center space-x-2 group"
              >
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-400 shadow-[0_10px_20px_rgba(20,112,255,0.45)] transition-transform duration-300 group-hover:scale-105">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </span>
                <span className="tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  LuxeStay
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-2">
                  <Link to="/" className={navClass("/")}>
                    Home
                  </Link>
                  <Link to="/hotels" className={navClass("/hotels")}>
                    Hotels
                  </Link>
                  {isAuthenticated && !isAdmin && (
                    <Link to="/dashboard" className={navClass("/dashboard")}>
                      Booking History
                    </Link>
                  )}
                  {isAuthenticated && isAdmin && (
                    <Link
                      to={adminHomePath}
                      className={navClass(adminHomePath)}
                    >
                      {hasPublishedHotel ? "Admin Dashboard" : "Publish Hotel"}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={primaryAccountPath}
                      className="text-sm font-semibold text-slate-100 hover:text-white transition-colors"
                    >
                      Hi, {user?.name || "User"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn-outline border-white/30 bg-white/5 text-white hover:bg-white/12 py-1.5 px-4"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-slate-100 hover:text-white transition-colors"
                    >
                      Log in
                    </Link>
                    <Link to="/register" className="btn-primary py-1.5 px-4">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/12 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/15 bg-[linear-gradient(120deg,rgba(8,29,47,0.98),rgba(7,24,38,0.95))] backdrop-blur-xl">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                to="/hotels"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                Hotels
              </Link>

              {isAuthenticated && !isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-cyan-200 hover:bg-white/10"
                >
                  Booking History
                </Link>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to={adminHomePath}
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-cyan-200 hover:bg-white/10"
                >
                  {hasPublishedHotel ? "Admin Dashboard" : "Publish Hotel"}
                </Link>
              )}

              <div className="pt-2 border-t border-white/15">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-slate-300">
                      Signed in as {user?.name || "User"}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-100 hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-100 hover:bg-white/10"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobile}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-cyan-200 hover:bg-white/10"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
