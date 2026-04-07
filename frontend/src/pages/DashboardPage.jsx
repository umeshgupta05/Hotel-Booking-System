import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const response = await api.getUserBookings({
          page,
          size: pageSize,
          sortBy: "bookingId",
          sortDir: "desc",
        });
        setBookings(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, page, pageSize]);

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [totalPages, page]);

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.cancelBooking(bookingId);

        const response = await api.getUserBookings({
          page,
          size: pageSize,
          sortBy: "bookingId",
          sortDir: "desc",
        });
        setBookings(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setMessage("Booking cancelled successfully.");
      } catch {
        alert("Failed to cancel booking");
      }
    }
  };

  const activeBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const status = (booking.status || "").toUpperCase();
        return status !== "CANCELLED" && status !== "EXPIRED";
      }),
    [bookings],
  );

  const cancelledBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const status = (booking.status || "").toUpperCase();
        return status === "CANCELLED" || status === "EXPIRED";
      }),
    [bookings],
  );

  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

  const renderBookingCard = (booking) => (
    <div
      key={booking.booking_id}
      className="surface-glass rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover-lift"
    >
      <div className="mb-4 md:mb-0 space-y-2">
        <div className="flex items-center space-x-3">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              booking.status === "CONFIRMED"
                ? "bg-green-100 text-green-700"
                : booking.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : booking.status === "EXPIRED"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.status}
          </span>
          <span className="text-slate-400 text-sm">
            ID: #{booking.booking_id}
          </span>
        </div>
        <h4 className="font-bold text-lg text-slate-800">
          Hotel Property #{booking.hotel_id}
        </h4>
        <div className="flex text-sm text-slate-600 space-x-4">
          <span>
            <span className="font-medium">In:</span> {booking.check_in}
          </span>
          <span>
            <span className="font-medium">Out:</span> {booking.check_out}
          </span>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
        <div className="text-xl font-bold text-slate-900">
          ₹{Number(booking.total_amount || 0).toLocaleString()}
        </div>
        {(booking.status || "").toUpperCase() === "CONFIRMED" && (
          <button
            onClick={() => handleCancel(booking.booking_id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center shadow-sm page-fade-in">
            <svg
              className="w-5 h-5 mr-3 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="surface-panel p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-[0_20px_26px_rgba(10,108,255,0.28)]">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              <div className="pt-6 border-t border-slate-100 flex justify-between text-sm">
                <span className="text-slate-600">Total Bookings</span>
                <span className="font-bold text-slate-900">
                  {totalElements}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content - Bookings */}
          <div className="flex-1">
            <div className="surface-panel p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                My Bookings
              </h2>

              {loading ? (
                <div className="py-10 text-center">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                    You haven't made any reservations. Discover our
                    extraordinary properties and book your first stay.
                  </p>
                  <Link to="/hotels" className="btn-primary">
                    Explore Hotels
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Active Bookings
                      </h3>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                        {activeBookings.length}
                      </span>
                    </div>
                    {activeBookings.length === 0 ? (
                      <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                        No active bookings right now.
                      </div>
                    ) : (
                      <div className="space-y-4 stagger-children">
                        {activeBookings.map((booking) =>
                          renderBookingCard(booking),
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Cancelled / Expired Bookings
                      </h3>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700">
                        {cancelledBookings.length}
                      </span>
                    </div>
                    {cancelledBookings.length === 0 ? (
                      <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                        No cancelled or expired bookings in this page.
                      </div>
                    ) : (
                      <div className="space-y-4 stagger-children">
                        {cancelledBookings.map((booking) =>
                          renderBookingCard(booking),
                        )}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => canGoPrev && setPage((prev) => prev - 1)}
                        disabled={!canGoPrev}
                        className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => canGoNext && setPage((prev) => prev + 1)}
                        disabled={!canGoNext}
                        className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
