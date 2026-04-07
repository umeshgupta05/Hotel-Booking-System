import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AdminDashboardPage = () => {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    categoryId: "",
    availability: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [savingHotel, setSavingHotel] = useState(false);
  const [savingAmenities, setSavingAmenities] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [hotelData, roomData, amenityData, categoryData] =
          await Promise.all([
            api.getAdminHotel(),
            api.getAdminHotelRooms(),
            api.getAdminAmenities(),
            api.getAdminRoomCategories(),
          ]);

        setHotel(hotelData);
        setRooms(roomData);
        setAmenities(amenityData);
        setCategories(categoryData);

        setHotelForm({
          name: hotelData.name || "",
          description: hotelData.description || "",
          basePrice: hotelData.basePrice ?? "",
          imageUrl: hotelData.imageUrl || "",
          contactEmail: hotelData.contactEmail || "",
          contactPhone: hotelData.contactPhone || "",
        });

        const ids = Array.isArray(hotelData.amenities)
          ? hotelData.amenities
              .map((amenity) => amenity.amenityId || amenity.amenity_id)
              .filter(Boolean)
          : [];
        setSelectedAmenityIds(ids);

        if (categoryData.length > 0) {
          const defaultCategoryId =
            categoryData[0].categoryId || categoryData[0].category_id;
          setNewRoom((prev) => ({
            ...prev,
            categoryId: String(defaultCategoryId),
          }));
        }
      } catch (err) {
        setError(err.message || "Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const totalAvailableRooms = useMemo(
    () => rooms.filter((room) => room.availability).length,
    [rooms],
  );

  const setTransientMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleHotelSave = async (e) => {
    e.preventDefault();
    setError("");
    setSavingHotel(true);

    try {
      const updated = await api.updateAdminHotel({
        name: hotelForm.name,
        description: hotelForm.description,
        basePrice: Number(hotelForm.basePrice),
        imageUrl: hotelForm.imageUrl,
        contactEmail: hotelForm.contactEmail,
        contactPhone: hotelForm.contactPhone,
      });
      setHotel(updated);
      setTransientMessage("Hotel details updated.");
    } catch (err) {
      setError(err.message || "Unable to update hotel details.");
    } finally {
      setSavingHotel(false);
    }
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenityIds((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      }
      return [...prev, amenityId];
    });
  };

  const handleAmenitiesSave = async () => {
    setError("");
    setSavingAmenities(true);

    try {
      const updated = await api.updateAdminHotelAmenities(selectedAmenityIds);
      setHotel(updated);
      setTransientMessage("Hotel services updated.");
    } catch (err) {
      setError(err.message || "Unable to update services.");
    } finally {
      setSavingAmenities(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!newRoom.roomNumber.trim()) {
      setError("Room number is required.");
      return;
    }

    if (!newRoom.categoryId) {
      setError("Please choose a room category.");
      return;
    }

    setAddingRoom(true);
    try {
      const created = await api.createAdminRoom({
        roomNumber: newRoom.roomNumber.trim(),
        categoryId: Number(newRoom.categoryId),
        availability: !!newRoom.availability,
      });
      setRooms((prev) => [created, ...prev]);
      setNewRoom((prev) => ({
        ...prev,
        roomNumber: "",
        availability: true,
      }));
      setTransientMessage("Room added successfully.");
    } catch (err) {
      setError(err.message || "Unable to add room.");
    } finally {
      setAddingRoom(false);
    }
  };

  const updateRoomLocal = (roomId, field, value) => {
    setRooms((prev) =>
      prev.map((room) => {
        const currentId = room.roomId || room.room_id;
        if (currentId !== roomId) return room;
        return { ...room, [field]: value };
      }),
    );
  };

  const handleRoomSave = async (room) => {
    setError("");
    const roomId = room.roomId || room.room_id;

    try {
      const updated = await api.updateAdminRoom(roomId, {
        roomNumber: room.roomNumber || room.room_number,
        categoryId: Number(room.categoryId || room.category_id),
        availability: !!room.availability,
      });

      setRooms((prev) =>
        prev.map((item) => {
          const id = item.roomId || item.room_id;
          return id === roomId ? updated : item;
        }),
      );
      setTransientMessage("Room updated.");
    } catch (err) {
      setError(err.message || "Unable to update room.");
    }
  };

  const handleRoomDelete = async (roomId) => {
    if (!window.confirm("Delete this room?")) {
      return;
    }

    setError("");
    try {
      await api.deleteAdminRoom(roomId);
      setRooms((prev) =>
        prev.filter((room) => (room.roomId || room.room_id) !== roomId),
      );
      setTransientMessage("Room removed.");
    } catch (err) {
      setError(err.message || "Unable to delete room.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-brand-navy">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your property profile, services, and room inventory.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Managed Hotel</p>
            <p className="text-xl font-bold text-brand-navy mt-1">
              {hotel?.name || "-"}
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Rooms</p>
            <p className="text-xl font-bold text-brand-navy mt-1">
              {rooms.length}
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Available Rooms</p>
            <p className="text-xl font-bold text-brand-navy mt-1">
              {totalAvailableRooms}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Hotel Details
          </h2>
          <form
            onSubmit={handleHotelSave}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={hotelForm.name}
              onChange={(e) =>
                setHotelForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Hotel Name"
              className="px-4 py-2 border border-slate-200 rounded-lg"
              required
            />
            <input
              value={hotelForm.basePrice}
              onChange={(e) =>
                setHotelForm((prev) => ({ ...prev, basePrice: e.target.value }))
              }
              type="number"
              min="1"
              placeholder="Base Price"
              className="px-4 py-2 border border-slate-200 rounded-lg"
            />
            <input
              value={hotelForm.contactEmail}
              onChange={(e) =>
                setHotelForm((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }))
              }
              type="email"
              placeholder="Contact Email"
              className="px-4 py-2 border border-slate-200 rounded-lg"
            />
            <input
              value={hotelForm.contactPhone}
              onChange={(e) =>
                setHotelForm((prev) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }))
              }
              placeholder="Contact Phone"
              className="px-4 py-2 border border-slate-200 rounded-lg"
            />
            <input
              value={hotelForm.imageUrl}
              onChange={(e) =>
                setHotelForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="Image URL"
              className="px-4 py-2 border border-slate-200 rounded-lg md:col-span-2"
            />
            <textarea
              value={hotelForm.description}
              onChange={(e) =>
                setHotelForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description"
              rows={4}
              className="px-4 py-2 border border-slate-200 rounded-lg md:col-span-2"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={savingHotel}
                className="px-5 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-accent disabled:opacity-60"
              >
                {savingHotel ? "Saving..." : "Save Hotel Details"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Hotel Services (Amenities)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {amenities.map((amenity) => {
              const amenityId = amenity.amenityId || amenity.amenity_id;
              return (
                <label
                  key={amenityId}
                  className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenityIds.includes(amenityId)}
                    onChange={() => toggleAmenity(amenityId)}
                  />
                  <span className="text-sm text-slate-700">{amenity.name}</span>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleAmenitiesSave}
            disabled={savingAmenities}
            className="mt-4 px-5 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-accent disabled:opacity-60"
          >
            {savingAmenities ? "Saving..." : "Save Services"}
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Add New Room
          </h2>
          <form
            onSubmit={handleAddRoom}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <input
              value={newRoom.roomNumber}
              onChange={(e) =>
                setNewRoom((prev) => ({ ...prev, roomNumber: e.target.value }))
              }
              placeholder="Room Number"
              className="px-4 py-2 border border-slate-200 rounded-lg"
              required
            />
            <select
              value={newRoom.categoryId}
              onChange={(e) =>
                setNewRoom((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="px-4 py-2 border border-slate-200 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => {
                const categoryId = category.categoryId || category.category_id;
                const basePrice = category.basePrice ?? category.base_price;
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name} - INR {basePrice}
                  </option>
                );
              })}
            </select>
            <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg">
              <input
                type="checkbox"
                checked={newRoom.availability}
                onChange={(e) =>
                  setNewRoom((prev) => ({
                    ...prev,
                    availability: e.target.checked,
                  }))
                }
              />
              Available
            </label>
            <button
              type="submit"
              disabled={addingRoom}
              className="px-5 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-accent disabled:opacity-60"
            >
              {addingRoom ? "Adding..." : "Add Room"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Manage Rooms
          </h2>
          <div className="space-y-3">
            {rooms.length === 0 && (
              <div className="p-4 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm">
                No rooms added yet.
              </div>
            )}

            {rooms.map((room) => {
              const roomId = room.roomId || room.room_id;
              const categoryId = room.categoryId || room.category_id;

              return (
                <div
                  key={roomId}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-4 border border-slate-200 rounded-xl"
                >
                  <input
                    value={room.roomNumber || room.room_number || ""}
                    onChange={(e) =>
                      updateRoomLocal(roomId, "roomNumber", e.target.value)
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg"
                  />

                  <select
                    value={categoryId || ""}
                    onChange={(e) =>
                      updateRoomLocal(
                        roomId,
                        "categoryId",
                        Number(e.target.value),
                      )
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {categories.map((category) => {
                      const id = category.categoryId || category.category_id;
                      return (
                        <option key={id} value={id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>

                  <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={!!room.availability}
                      onChange={(e) =>
                        updateRoomLocal(
                          roomId,
                          "availability",
                          e.target.checked,
                        )
                      }
                    />
                    Available
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRoomSave(room)}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-accent"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoomDelete(roomId)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
