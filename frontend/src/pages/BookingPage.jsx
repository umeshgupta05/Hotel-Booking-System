import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state;

  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state?.room || !state?.hotelId) {
      navigate("/hotels");
      return;
    }

    const fetchHotel = async () => {
      try {
        const data = await api.getHotelById(state.hotelId);
        setHotel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [state, navigate]);

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return state?.room?.base_price || 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0
      ? state.room.base_price * diffDays
      : state.room.base_price;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut)
      return alert("Select check-in and check-out dates");

    const hotelId = hotel?.hotel_id ?? hotel?.hotelId ?? hotel?.id;
    const roomId = state?.room?.room_id ?? state?.room?.roomId;
    if (!hotelId || !roomId) {
      setError("Missing hotel or room details. Please reopen this booking.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      const booking = await api.createBooking({
        user_id: user.user_id,
        hotel_id: hotelId,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        total_amount: calculateTotal(),
      });

      await api.processPayment({
        booking_id: booking.booking_id ?? booking.bookingId,
        amount: booking.total_amount ?? booking.totalAmount ?? calculateTotal(),
        payment_method: "PAY_AT_HOTEL",
      });

      navigate("/dashboard", {
        state: { message: "Booking and payment confirmed successfully!" },
      });
    } catch (err) {
      setError(err?.message || "Failed to confirm booking.");
      setProcessing(false);
    }
  };

  if (loading || !hotel)
    return <div className="p-20 text-center">Loading...</div>;

  const imageSrc =
    hotel.image_url ||
    hotel.imageUrl ||
    "https://placehold.co/600x400?text=Hotel+Image";

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-brand-navy mb-8">
          Confirm Your Booking
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Booking Form */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Reservation Details
            </h2>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Payment Method
                </h3>
                <div className="flex items-center p-4 border border-brand-blue bg-blue-50/50 rounded-xl">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="ml-3 font-medium text-brand-navy">
                    Pay at Hotel
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-brand-blue hover:bg-brand-accent text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-70 mt-4"
              >
                {processing
                  ? "Processing..."
                  : `Confirm Booking - ₹${calculateTotal()}`}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Hotel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400?text=Hotel+Image";
                  }}
                />
              </div>
              <h3 className="font-bold text-lg text-brand-navy">
                {hotel.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {state.room.category_name}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Price (per night)</span>
                  <span className="font-medium">₹{state.room.base_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Taxes & Fees</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-brand-blue">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
