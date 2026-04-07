import React, { useState, useEffect } from "react";
import HotelCard from "../components/HotelCard";
import { api } from "../services/api";

const HotelsPage = () => {
  const [allHotels, setAllHotels] = useState([]);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [maxPrice, setMaxPrice] = useState(20000); // INR max limit
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("Recommended");

  const getHotelPrice = (hotel) => {
    const price = hotel.base_price ?? hotel.basePrice;
    return typeof price === "number" ? price : Number.POSITIVE_INFINITY;
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await api.getHotels();
        setAllHotels(data);
        setDisplayedHotels(data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Filter and Sort effect
  useEffect(() => {
    let result = allHotels.filter((hotel) => {
      const priceCondition = getHotelPrice(hotel) <= maxPrice;
      const ratingCondition = hotel.rating >= minRating;
      return priceCondition && ratingCondition;
    });

    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => getHotelPrice(a) - getHotelPrice(b));
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => getHotelPrice(b) - getHotelPrice(a));
    } else if (sortBy === "Highest Rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setDisplayedHotels(result);
  }, [maxPrice, minRating, sortBy, allHotels]);

  const handleRatingChange = (e, ratingVal) => {
    if (e.target.checked) setMinRating(ratingVal);
    else if (minRating === ratingVal) setMinRating(0); // Optional: reset if unchecking the active one
  };

  const handleReset = () => {
    setMaxPrice(20000);
    setMinRating(0);
    // Uncheck all radio/checkbox inputs by key or refs if needed,
    // for simplicity, resetting states is enough right now.
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="font-bold text-lg text-brand-navy mb-4">
                Filters
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Price: ₹{maxPrice}
                </label>
                <input
                  type="range"
                  className="w-full accent-brand-accent"
                  min="500"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹500</span>
                  <span>₹20,000+</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === rating}
                        onChange={(e) => handleRatingChange(e, rating)}
                        className="rounded text-brand-accent focus:ring-brand-accent mr-2"
                      />
                      <div className="flex items-center">
                        <span className="text-sm text-slate-600">
                          {rating} Stars & Up
                        </span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="rounded text-brand-accent focus:ring-brand-accent mr-2"
                    />
                    <div className="flex items-center">
                      <span className="text-sm text-slate-600">Any Rating</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Hotel List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-brand-navy">
                Available Properties ({displayedHotels.length})
              </h1>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.hotel_id ?? hotel.hotelId ?? hotel.id}
                    hotel={hotel}
                  />
                ))}
                {displayedHotels.length === 0 && (
                  <div className="col-span-1 lg:col-span-2 py-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
                    No properties match your exact filters. Try adjusting the
                    price or rating.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
