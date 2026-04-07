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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-navy z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-c6a4d14d8387?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-accent font-semibold tracking-wider uppercase mb-3 block">
            Discover Extraordinary
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect <br />
            Stay with LuxeStay
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
            Book premium hotels, resorts, and exclusive properties worldwide
            with our seamless booking experience.
          </p>

          {/* Quick Search */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3 max-w-3xl mx-auto"
          >
            <div className="flex-1 w-full relative">
              <div className="absolute left-4 top-3 text-slate-400">
                <svg
                  className="w-5 h-5"
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
                placeholder="Search hotels, city, amenities, contact..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-brand-blue hover:bg-brand-accent text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-blue/30 text-center"
            >
              Search Hotels
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-navy mb-2">
                500+
              </div>
              <div className="text-slate-500 font-medium">Premium Hotels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-navy mb-2">
                10k+
              </div>
              <div className="text-slate-500 font-medium">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-navy mb-2">50+</div>
              <div className="text-slate-500 font-medium">Cities Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-navy mb-2">4.9</div>
              <div className="text-slate-500 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore our handpicked selection of top-rated properties for your
              next unforgettable getaway.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dummy cards for homepage */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-slate-100">
                  <img
                    src={`https://picsum.photos/seed/resort${i}/800/600`}
                    alt="Destination"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {
                      [
                        "Maldives Resort",
                        "Swiss Alps Lodge",
                        "Parisian Boutique",
                      ][i - 1]
                    }
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Experience luxury and comfort in our prime locations.
                  </p>
                  <Link
                    to="/hotels"
                    className="text-brand-accent font-medium hover:underline"
                  >
                    Explore properties &rarr;
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
