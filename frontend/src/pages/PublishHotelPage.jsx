import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PublishHotelPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [amenities, setAmenities] = useState([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
  });

  useEffect(() => {
    const isAdmin = (user?.role || "").toUpperCase() === "ROLE_ADMIN";
    if (!isAdmin) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (user?.hotelId || user?.hotel_id) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const loadAmenities = async () => {
      setLoadingAmenities(true);
      try {
        const data = await api.getAdminAmenities();
        setAmenities(data);
      } catch {
        setAmenities([]);
      } finally {
        setLoadingAmenities(false);
      }
    };

    loadAmenities();
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenityIds((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      }
      return [...prev, amenityId];
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");

    const parsedBasePrice = Number(formData.basePrice);
    if (!Number.isFinite(parsedBasePrice) || parsedBasePrice <= 0) {
      setError("Base price must be greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const hotel = await api.publishAdminHotel({
        name: formData.name.trim(),
        description: formData.description.trim(),
        basePrice: parsedBasePrice,
        imageUrl: formData.imageUrl.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipCode: formData.zipCode.trim(),
        amenityIds: selectedAmenityIds,
      });

      const createdHotelId = hotel.hotelId || hotel.hotel_id;
      if (createdHotelId) {
        updateUser({
          ...user,
          hotelId: createdHotelId,
          hotel_id: createdHotelId,
        });
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to publish hotel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-panel p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Publish Your Hotel
          </h1>
          <p className="text-slate-600 mt-1">
            Complete these details to publish your property and start managing
            rooms.
          </p>
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={handlePublish}
          className="surface-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Hotel Name"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            type="number"
            min="1"
            placeholder="Base Price"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            type="email"
            placeholder="Contact Email"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="input-field px-4 py-2 md:col-span-2"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Hotel Description"
            rows={4}
            className="input-field px-4 py-2 md:col-span-2"
            required
          />

          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="input-field px-4 py-2"
            required
          />
          <input
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="input-field px-4 py-2 md:col-span-2"
            required
          />

          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Amenities</h2>
            {loadingAmenities ? (
              <p className="text-sm text-slate-500">Loading amenities...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {amenities.map((amenity) => {
                  const amenityId = amenity.amenityId || amenity.amenity_id;
                  return (
                    <label
                      key={amenityId}
                      className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg bg-white/70"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenityIds.includes(amenityId)}
                        onChange={() => toggleAmenity(amenityId)}
                      />
                      <span className="text-sm text-slate-700">
                        {amenity.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2 disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Publish Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishHotelPage;
