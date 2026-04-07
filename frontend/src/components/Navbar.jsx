import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = (user?.role || "").toUpperCase() === "ROLE_ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
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
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/hotels"
                  className="hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Hotels
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    className="text-sm font-medium hover:text-brand-accent transition-colors"
                  >
                    Hi, {user?.name || "User"}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="text-sm font-medium hover:text-brand-accent transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
