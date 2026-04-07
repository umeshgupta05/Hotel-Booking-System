import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const token = destination.trim();

    if (token) {
      navigate(`/hotels?q=${encodeURIComponent(token)}`);
      return;
    }

    navigate("/hotels");
  };

  return (
    <div className="min-h-screen pb-10">
      <section className="relative overflow-hidden px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl surface-panel p-6 md:p-10 lg:p-12">
          <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-cyan-200/45 blur-3xl animate-float-slow"></div>
          <div className="absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-orange-200/45 blur-3xl animate-float-reverse"></div>

          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="stagger-children">
              <span className="eyebrow-chip mb-4">Curated luxury stays</span>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Luxury stays with
                <span className="text-gradient-brand">
                  {" "}
                  modern booking flow
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
                Find your next unforgettable stay across premium hotels,
                boutique retreats, and skyline escapes. Fast search, smooth
                checkout, and elevated guest experience from day one.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-7 surface-glass rounded-2xl p-3 sm:p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute left-4 top-3.5 text-slate-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Search by city, hotel, amenities, contact"
                      className="input-field pl-12"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary min-w-44 px-8 py-3"
                  >
                    Search hotels
                  </button>
                </div>
              </form>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="stat-tile">
                  <p className="text-2xl font-bold text-slate-900">500+</p>
                  <p className="text-xs text-slate-600 uppercase tracking-wide">
                    Luxury hotels
                  </p>
                </div>
                <div className="stat-tile">
                  <p className="text-2xl font-bold text-slate-900">10k+</p>
                  <p className="text-xs text-slate-600 uppercase tracking-wide">
                    Happy guests
                  </p>
                </div>
                <div className="stat-tile">
                  <p className="text-2xl font-bold text-slate-900">50+</p>
                  <p className="text-xs text-slate-600 uppercase tracking-wide">
                    Cities live
                  </p>
                </div>
                <div className="stat-tile">
                  <p className="text-2xl font-bold text-slate-900">4.9</p>
                  <p className="text-xs text-slate-600 uppercase tracking-wide">
                    Avg rating
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/60 shadow-[0_28px_52px_rgba(15,38,61,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1542314831-c6a4d14d8387?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="Hero Background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081c30]/85 via-[#081c30]/20 to-transparent"></div>
              <div className="absolute left-5 top-5 rounded-xl bg-white/88 px-4 py-3 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Featured pick
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  Sea-facing Presidential Suites
                </p>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/12 p-4 text-white backdrop-blur">
                <p className="text-sm text-slate-100/90">
                  From weekend escapes to long luxury stays, discover premium
                  comfort in one tap.
                </p>
                <Link
                  to="/hotels"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-cyan-200 hover:text-white"
                >
                  Browse collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow-chip">Inspired destinations</span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Handpicked stays that feel unforgettable
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                A refined selection of properties with design-forward interiors,
                premium comfort, and top-rated hospitality.
              </p>
            </div>
            <Link to="/hotels" className="btn-outline">
              View all stays
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 stagger-children">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group surface-panel hover-lift overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={`https://picsum.photos/seed/resort${i}/800/600`}
                    alt="Destination"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06192a]/70 via-transparent to-transparent"></div>
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                    Premium
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {
                      [
                        "Maldives Resort",
                        "Swiss Alps Lodge",
                        "Parisian Boutique",
                      ][i - 1]
                    }
                  </h3>
                  <p className="text-slate-600 mb-5">
                    Signature architecture, private experiences, and curated
                    wellness for elevated travel.
                  </p>
                  <Link
                    to="/hotels"
                    className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Explore properties
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
