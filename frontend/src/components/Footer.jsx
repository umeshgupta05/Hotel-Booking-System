import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto px-3 pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/35 bg-[linear-gradient(120deg,rgba(8,25,40,0.94),rgba(7,34,56,0.9))] px-5 py-8 text-slate-300 shadow-[0_20px_46px_rgba(8,20,35,0.28)] backdrop-blur-xl sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-400 text-white shadow-[0_10px_20px_rgba(20,112,255,0.45)]">
                <svg
                  className="w-4 h-4"
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
              <span>LuxeStay</span>
            </span>
            <p className="text-sm mt-2 text-slate-300/90">
              Luxury booking experiences crafted with speed, trust, and delight.
            </p>
          </div>

          <div className="text-sm text-slate-300/85">
            &copy; {new Date().getFullYear()} LuxeStay Hotel Management System.
            All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
