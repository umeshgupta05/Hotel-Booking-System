import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const imageSrc =
    hotel?.image_url ||
    hotel?.imageUrl ||
    `https://picsum.photos/seed/${(hotel?.hotelId || hotel?.hotel_id || 1) * 10}/1600/900`;

  const reviewCount = reviews.length;
  const hotelRating = useMemo(() => Number(hotel?.rating || 0), [hotel]);

  const formatHotelAddress = () => {
    const address = hotel?.address;
    if (!address) {
      return "Address not available";
    }
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zipCode,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not available";
  };

  const renderStars = (value) => {
    const rounded = Math.round(Number(value || 0));
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            className={index <= rounded ? "text-yellow-500" : "text-slate-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const loadReviews = async () => {
    setReviewLoading(true);
    try {
      const reviewData = await api.getHotelReviews(id);
      setReviews(reviewData);
    } catch {
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, roomsData, reviewData] = await Promise.all([
          api.getHotelById(id),
          api.getRoomsByHotel(id),
          api.getHotelReviews(id),
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
        setReviews(reviewData);
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
        setReviewLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/hotels/${id}` } } });
      return;
    }

    const parsedRating = Number(reviewRating);
    if (
      !Number.isFinite(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      setReviewError("Please select a rating between 1 and 5.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await api.submitHotelReview({
        hotelId: Number(id),
        rating: parsedRating,
        comment: reviewComment.trim(),
      });

      const [updatedHotel] = await Promise.all([
        api.getHotelById(id),
        loadReviews(),
      ]);
      setHotel(updatedHotel);
      setReviewComment("");
      setReviewSuccess("Review saved. Hotel rating updated in real time.");
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32 min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="py-20 text-center text-xl">Hotel not found</div>;
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header Image */}
      <div className="h-[420px] bg-slate-800 relative">
        <img
          src={imageSrc}
          alt={hotel.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/1600x900?text=Hotel+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081a2b]/90 via-[#081a2b]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Link
              to="/hotels"
              className="text-white/90 hover:text-cyan-200 text-sm mb-4 inline-flex items-center font-medium"
            >
              Back to Hotels
            </Link>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center text-slate-200 space-x-4">
                  <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    <svg
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {hotelRating.toFixed(1)} Rating ({reviewCount} reviews)
                  </span>
                  <span className="text-sm">{hotel.contact_email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="surface-panel p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About this property
              </h2>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {hotel.description}
                <br />
                <br />
                Experience the luxury of LuxeStay with our premium properties.
                Enjoy round-the-clock service, elegant dining options, and prime
                locations that capture the essence of the city.
              </p>
            </div>

            <div className="surface-panel text-left p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Available Rooms
              </h2>
              <div className="space-y-4">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <RoomCard
                      key={room.roomId || room.room_id}
                      room={room}
                      hotelId={hotel.hotelId || hotel.hotel_id}
                    />
                  ))
                ) : (
                  <p className="text-slate-500">
                    No rooms available for this property at the moment.
                  </p>
                )}
              </div>
            </div>

            <div className="surface-panel text-left p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Guest Reviews & Ratings
              </h2>
              <p className="text-slate-500 mb-6">
                Share your experience. If you review again, your previous rating
                is updated.
              </p>

              <form
                onSubmit={handleSubmitReview}
                className="space-y-4 surface-glass rounded-xl p-4 mb-6"
              >
                {reviewError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                    {reviewError}
                  </div>
                )}
                {reviewSuccess && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 py-2">
                    {reviewSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="input-field w-full sm:w-56 px-3 py-2"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Write your feedback..."
                    className="input-field w-full px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn-primary px-5 py-2 disabled:opacity-60"
                >
                  {reviewSubmitting
                    ? "Saving..."
                    : isAuthenticated
                      ? "Submit / Update Review"
                      : "Login to Review"}
                </button>
              </form>

              {reviewLoading ? (
                <p className="text-slate-500">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-slate-500">
                  No reviews yet. Be the first to rate this hotel.
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewId || review.review_id}
                      className="surface-glass rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-sm font-semibold text-slate-700">
                          Guest Review #{review.reviewId || review.review_id}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-line">
                        {review.comment || "No comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map/Contact Sidebar */}
          <div className="space-y-6 mt-8 lg:mt-0">
            <div className="surface-panel p-6">
              <h3 className="font-bold text-lg text-brand-navy mb-4">
                Property Info
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-brand-accent mr-3 mt-0.5"
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
                  <span>{formatHotelAddress()}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-brand-accent mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <span>{hotel.contact_phone}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-brand-accent mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>{hotel.contact_email}</span>
                </div>
              </div>
            </div>

            <div className="surface-panel p-6">
              <h3 className="font-bold text-lg text-brand-navy mb-4">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(hotel.amenities) &&
                hotel.amenities.length > 0 ? (
                  hotel.amenities.map((am) => (
                    <span
                      key={am.amenityId || am.amenity_id || am.name}
                      className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100"
                    >
                      {am.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No amenities listed yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
