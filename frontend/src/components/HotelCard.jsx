import React from "react";
import { Link } from "react-router-dom";

const HotelCard = ({ hotel }) => {
  const hotelId = hotel.hotel_id ?? hotel.hotelId ?? hotel.id;
  const hotelPrice = hotel.base_price ?? hotel.basePrice;
  const imageSrc =
    hotel.image_url ||
    hotel.imageUrl ||
    "https://placehold.co/800x600?text=Hotel+Image";

  return (
    <div className="group surface-panel hover-lift overflow-hidden flex flex-col">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/800x600?text=Hotel+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2b]/65 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          Curated Stay
        </div>
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
          <svg
            className="w-4 h-4 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-slate-900">
            {Number(hotel.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 transition-colors group-hover:text-blue-700">
          {hotel.name}
        </h3>
        <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-6">
          {hotel.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-200/80 pt-4">
          <div className="text-slate-600">
            <span className="font-bold text-xl text-slate-900">
              ₹{hotelPrice?.toLocaleString() || "N/A"}
            </span>
            <span className="text-xs ml-1 uppercase tracking-wide">
              / night
            </span>
          </div>
          <Link to={`/hotels/${hotelId}`} className="btn-primary px-4 py-2">
            View stay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
