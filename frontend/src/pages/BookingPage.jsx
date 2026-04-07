import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const toIsoDate = (date) => date.toISOString().slice(0, 10);
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SaXL0fheGFoGLq";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;
  const selectedHotelId =
    location.state?.hotelId ?? room?.hotel_id ?? room?.hotelId;

  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setCheckIn(toIsoDate(today));
    setCheckOut(toIsoDate(tomorrow));
  }, []);

  useEffect(() => {
    if (!room || !selectedHotelId) {
      navigate("/hotels", { replace: true });
      return;
    }

    const fetchHotel = async () => {
      setLoading(true);
      try {
        const data = await api.getHotelById(selectedHotelId);
        setHotel(data);
      } catch (err) {
        setError(err.message || "Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [room, selectedHotelId, navigate]);

  const roomPrice = useMemo(() => {
    const value = room?.base_price ?? room?.basePrice ?? 0;
    return Number(value) || 0;
  }, [room]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const total = roomPrice * nights;

  const launchRazorpayCheckout = async ({ bookingId }) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error(
        "Unable to load Razorpay checkout. Please check your connection and try again.",
      );
    }

    const order = await api.createRazorpayOrder({
      bookingId,
      amount: Math.round(total),
      currency: "INR",
    });

    return new Promise((resolve, reject) => {
      const storedUserRaw = localStorage.getItem("hotel_user");
      let storedUser = null;
      if (storedUserRaw) {
        try {
          storedUser = JSON.parse(storedUserRaw);
        } catch {
          storedUser = null;
        }
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "LuxeStay",
        description: `Booking at ${hotel.name}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await api.verifyPaymentSignature({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId,
            });
            resolve();
          } catch (verifyError) {
            reject(verifyError);
          }
        },
        modal: {
          ondismiss: () => {
            reject(
              new Error(
                "Payment was cancelled. Your booking is still created as pending.",
              ),
            );
          },
        },
        theme: {
          color: "#2563eb",
        },
      };

      if (storedUser) {
        options.prefill = {
          name: storedUser.name || "",
          email: storedUser.email || "",
        };
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        reject(
          new Error(
            response?.error?.description ||
              "Payment failed. Please try again with another method.",
          ),
        );
      });
      razorpay.open();
    });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");

    if (!hotel || !room) {
      setError("Booking details are incomplete. Please try again.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setProcessing(true);
    try {
      const booking = await api.createBooking({
        hotelId: hotel.hotel_id ?? hotel.hotelId,
        roomId: room.room_id ?? room.roomId,
        checkIn,
        checkOut,
      });

      const bookingId = booking.booking_id ?? booking.bookingId;

      if (paymentMethod === "RAZORPAY") {
        await launchRazorpayCheckout({ bookingId });
      } else {
        await api.processPayment({
          bookingId,
          amount: total,
          method: "PAY_AT_HOTEL",
        });
      }

      navigate("/dashboard", {
        replace: true,
        state: {
          message:
            paymentMethod === "RAZORPAY"
              ? "Booking confirmed and payment completed successfully."
              : "Booking confirmed. Payment marked as Pay at Hotel.",
        },
      });
    } catch (err) {
      setError(err.message || "Failed to confirm booking.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  if (!hotel || !room) {
    return (
      <div className="p-20 text-center">
        {error || "Booking details not found."}
      </div>
    );
  }

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
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Reservation Details
            </h2>

            {error && (
              <div className="mb-6 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
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
                    min={toIsoDate(new Date())}
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
                    min={checkIn || toIsoDate(new Date())}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-brand-blue bg-blue-50/50 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="ml-3 font-medium text-brand-navy">
                      Pay now with Razorpay (UPI / Cards / Netbanking)
                    </span>
                  </label>

                  <label className="flex items-center p-4 border border-slate-200 bg-slate-50/70 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === "PAY_AT_HOTEL"}
                      onChange={() => setPaymentMethod("PAY_AT_HOTEL")}
                      className="text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="ml-3 font-medium text-slate-700">
                      Pay at Hotel
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-brand-blue hover:bg-brand-accent text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-70"
              >
                {processing
                  ? "Processing..."
                  : paymentMethod === "RAZORPAY"
                    ? `Pay ₹${total.toLocaleString()} with Razorpay`
                    : `Confirm Booking - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={hotel.name}
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
                {room.category_name || room.categoryName || "Room"}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Price (per night)</span>
                  <span className="font-medium">
                    ₹{roomPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment</span>
                  <span className="font-medium">
                    {paymentMethod === "RAZORPAY" ? "Razorpay" : "Pay at Hotel"}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-brand-blue">
                  ₹{total.toLocaleString()}
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
