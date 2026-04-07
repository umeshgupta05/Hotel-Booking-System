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
      active ? "text-brand-accent bg-white/10" : "hover:text-brand-accent"
    } px-3 py-2 rounded-md text-sm font-medium transition-colors`;
  };

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={closeMobile}
              className="text-xl font-bold flex items-center space-x-2"
            >
              <svg
                className="w-8 h-8 text-brand-accent"
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
              <span>LuxeStay</span>
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
                  <Link to={adminHomePath} className={navClass(adminHomePath)}>
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
                    className="text-sm font-medium hover:text-brand-accent transition-colors"
                  >
                    Hi, {user?.name || "User"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-outline border-white/30 text-white hover:bg-white/10 py-1.5 px-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:text-brand-accent transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary py-1.5 px-4 shadow-lg shadow-brand-accent/30"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-white/10"
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
        <div className="md:hidden border-t border-white/10 bg-brand-navy/95 backdrop-blur">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/hotels"
              onClick={closeMobile}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
            >
              Hotels
            </Link>

            {isAuthenticated && !isAdmin && (
              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 text-brand-accent"
              >
                Booking History
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to={adminHomePath}
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 text-brand-accent"
              >
                {hasPublishedHotel ? "Admin Dashboard" : "Publish Hotel"}
              </Link>
            )}

            <div className="pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-slate-200">
                    Signed in as {user?.name || "User"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-brand-accent hover:bg-white/10"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
