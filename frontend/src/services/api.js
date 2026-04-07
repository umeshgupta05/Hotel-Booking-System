const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8086/api";

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const normalizeUser = (user) => ({
  user_id: user?.user_id ?? user?.id,
  id: user?.id ?? user?.user_id,
  name: user?.name,
  email: user?.email,
  role: user?.role,
});

const normalizeHotel = (hotel) => ({
  hotel_id: hotel?.hotel_id ?? hotel?.hotelId ?? hotel?.id,
  hotelId: hotel?.hotelId ?? hotel?.hotel_id ?? hotel?.id,
  name: hotel?.name,
  description: hotel?.description,
  rating: hotel?.rating,
  image_url: hotel?.image_url ?? hotel?.imageUrl,
  imageUrl: hotel?.imageUrl ?? hotel?.image_url,
  base_price: hotel?.base_price ?? hotel?.basePrice ?? hotel?.price,
  basePrice: hotel?.basePrice ?? hotel?.base_price ?? hotel?.price,
  contact_email: hotel?.contact_email ?? hotel?.contactEmail,
  contactEmail: hotel?.contactEmail ?? hotel?.contact_email,
  contact_phone: hotel?.contact_phone ?? hotel?.contactPhone,
  contactPhone: hotel?.contactPhone ?? hotel?.contact_phone,
  created_at: hotel?.created_at ?? hotel?.createdAt,
  createdAt: hotel?.createdAt ?? hotel?.created_at,
});

const normalizeRoom = (room, hotelId) => ({
  room_id: room?.room_id ?? room?.roomId,
  roomId: room?.roomId ?? room?.room_id,
  hotel_id: room?.hotel_id ?? room?.hotelId ?? hotelId,
  hotelId: room?.hotelId ?? room?.hotel_id ?? hotelId,
  category_id:
    room?.category_id ?? room?.categoryId ?? room?.roomCategory?.categoryId,
  categoryId:
    room?.categoryId ?? room?.category_id ?? room?.roomCategory?.categoryId,
  category_name:
    room?.category_name ?? room?.categoryName ?? room?.roomCategory?.name,
  categoryName:
    room?.categoryName ?? room?.category_name ?? room?.roomCategory?.name,
  base_price:
    room?.base_price ?? room?.basePrice ?? room?.roomCategory?.basePrice,
  basePrice:
    room?.basePrice ?? room?.base_price ?? room?.roomCategory?.basePrice,
  capacity: room?.capacity ?? room?.roomCategory?.capacity,
  room_number: room?.room_number ?? room?.roomNumber,
  roomNumber: room?.roomNumber ?? room?.room_number,
  availability: room?.availability,
});

const normalizeBooking = (booking) => ({
  booking_id: booking?.booking_id ?? booking?.bookingId,
  bookingId: booking?.bookingId ?? booking?.booking_id,
  hotel_id: booking?.hotel_id ?? booking?.hotelId ?? booking?.hotel?.hotelId,
  hotelId: booking?.hotelId ?? booking?.hotel_id ?? booking?.hotel?.hotelId,
  room_id: booking?.room_id ?? booking?.roomId ?? booking?.room?.roomId,
  roomId: booking?.roomId ?? booking?.room_id ?? booking?.room?.roomId,
  check_in: booking?.check_in ?? booking?.checkIn,
  checkIn: booking?.checkIn ?? booking?.check_in,
  check_out: booking?.check_out ?? booking?.checkOut,
  checkOut: booking?.checkOut ?? booking?.check_out,
  total_amount: booking?.total_amount ?? booking?.totalAmount,
  totalAmount: booking?.totalAmount ?? booking?.total_amount,
  status: booking?.status,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("hotel_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = "API Request Failed";

    try {
      const bodyText = await response.text();
      if (bodyText) {
        try {
          const parsed = JSON.parse(bodyText);
          errorMsg = parsed.message || parsed.error || bodyText;
        } catch {
          errorMsg = bodyText;
        }
      }
    } catch {
      errorMsg = "API Request Failed";
    }

    if (response.status === 401) {
      localStorage.removeItem("hotel_user");
      localStorage.removeItem("hotel_token");
      throw new Error("Session expired. Please log in again.");
    }

    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  // Auth
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await handleResponse(response);
    return {
      token: data.token,
      user: normalizeUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }),
    };
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    });

    return await handleResponse(response);
  },

  // Hotels
  getHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(normalizeHotel) : [];
  },

  getHotelById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return normalizeHotel(data);
  },

  // Rooms
  getRoomsByHotel: async (hotelId, checkIn, checkOut) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const inDate = checkIn || toIsoDate(today);
    const outDate = checkOut || toIsoDate(tomorrow);
    const params = new URLSearchParams({ checkIn: inDate, checkOut: outDate });

    const response = await fetch(
      `${API_BASE_URL}/hotels/${hotelId}/rooms?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const data = await handleResponse(response);
    return Array.isArray(data)
      ? data.map((room) => normalizeRoom(room, Number(hotelId)))
      : [];
  },

  // Razorpay
  createRazorpayOrder: async (orderRequest) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderRequest),
    });
    return await handleResponse(response);
  },

  verifyPaymentSignature: async (verifyRequest) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify-signature`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(verifyRequest),
    });
    return await handleResponse(response);
  },

  // Bookings
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        hotelId: bookingData.hotelId ?? bookingData.hotel_id,
        roomId: bookingData.roomId ?? bookingData.room_id,
        checkIn: bookingData.checkIn ?? bookingData.check_in,
        checkOut: bookingData.checkOut ?? bookingData.check_out,
      }),
    });

    const data = await handleResponse(response);
    return normalizeBooking(data);
  },

  processPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        bookingId: paymentData.bookingId ?? paymentData.booking_id,
        amount: paymentData.amount ?? paymentData.total_amount,
        method:
          paymentData.method ?? paymentData.payment_method ?? "PAY_AT_HOTEL",
      }),
    });

    return await handleResponse(response);
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-history`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(normalizeBooking) : [];
  },

  cancelBooking: async (bookingId) => {
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      },
    );

    const data = await handleResponse(response);
    return normalizeBooking(data);
  },
};
