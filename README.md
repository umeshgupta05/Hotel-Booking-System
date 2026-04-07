# Hotel Booking System (LuxeStay)

Full-stack hotel booking platform with:

- React + Vite frontend
- Spring Boot backend (JWT auth, role-based access)
- PostgreSQL persistence
- Razorpay integration for online payments
- Email notifications for booking confirmation and OTP password reset

The project supports both customer and admin workflows:

- Users can search hotels, check room availability, book/cancel stays, and pay online or at hotel.
- Admins can manage exactly one assigned hotel (details, amenities/services, and rooms).

## 1. Tech Stack

### Frontend

- React 19
- React Router
- Vite
- Tailwind CSS

### Backend

- Java 21
- Spring Boot 3.2.4
- Spring Security + JWT
- Spring Data JPA + Hibernate
- Resilience4j (rate limiting on auth APIs)
- Spring Mail
- Springdoc OpenAPI (Swagger UI)

### Database and Integrations

- PostgreSQL
- Razorpay Java SDK

## 2. Monorepo Structure

```text
HotelBookingSystem/
	README.md
	backend/
		HotelBookingSystem/
			pom.xml
			src/main/java/com/example/HotelBookingSystem/
			src/main/resources/application.yml
			scripts/postgres_seed.sql
	frontend/
		package.json
		src/
```

## 3. Core Features

### Customer Features

- Signup and login with JWT auth
- Forgot password via OTP email
- Hotel search by free-text keyword (`q`) and filters
- Hotel details with available room listing by date range
- Booking creation and cancellation
- Booking history separated into active and cancelled sections
- Payment methods:
  - Razorpay checkout
  - Pay at hotel
- Booking confirmation email

### Admin Features

- Separate admin signup/login mode in UI
- Admin account linked to a managed hotel
- One admin per hotel (enforced at signup)
- Admin dashboard to:
  - Update hotel profile (name, description, base price, image, contact)
  - Update hotel amenities/services
  - Create/update/delete rooms
  - Assign room categories and availability

### Security and Access Control

- JWT-based stateless authentication
- Role-aware access (`ROLE_USER`, `ROLE_ADMIN`)
- Admin APIs protected with `hasRole('ADMIN')`
- Auth endpoints rate-limited through Resilience4j

## 4. Prerequisites

Install before running:

- Java 21
- Maven (or use provided Maven Wrapper)
- Node.js 18+
- PostgreSQL 14+

## 5. Backend Configuration

Main config file:

- `backend/HotelBookingSystem/src/main/resources/application.yml`

Update these values for your environment before running:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `app.jwt.secret`
- `razorpay.key.id`
- `razorpay.key.secret`
- `spring.mail.username`
- `spring.mail.password`

Notes:

- Backend runs on port `8086` by default.
- JWT expiration is controlled by `app.jwt.expirationMs`.
- Swagger UI is available at `/swagger-ui.html`.

## 6. Frontend Configuration

The frontend API layer uses:

- `VITE_API_BASE_URL` (default: `http://localhost:8086/api`)
- `VITE_RAZORPAY_KEY_ID` (default test key used if not provided)

Create `frontend/.env` if you want explicit values:

```env
VITE_API_BASE_URL=http://localhost:8086/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 7. Database Setup and Seed Data

Create the database:

```sql
CREATE DATABASE hotel_booking_system;
```

Seed script path:

- `backend/HotelBookingSystem/scripts/postgres_seed.sql`

Run seed script (PowerShell example):

```powershell
psql -U postgres -d hotel_booking_system -f "backend/HotelBookingSystem/scripts/postgres_seed.sql"
```

Seed currently includes:

- 14 hotels across India
- addresses, amenities, room categories
- starter rooms and hotel-amenity mappings

## 8. Run the Project

### Step A: Run Backend

```powershell
cd backend/HotelBookingSystem
./mvnw.cmd spring-boot:run
```

Backend base URL:

- `http://localhost:8086`

Swagger UI:

- `http://localhost:8086/swagger-ui.html`

### Step B: Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## 9. Important API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Signup payload (user):

```json
{
  "name": "A User",
  "email": "user@example.com",
  "password": "password123",
  "role": "ROLE_USER"
}
```

Signup payload (admin):

```json
{
  "name": "Hotel Admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ROLE_ADMIN",
  "hotelId": 1
}
```

Reset password payload:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

### Hotels and Discovery

- `GET /api/hotels?q=&city=&rating=&amenityId=`
- `GET /api/hotels/{id}`
- `GET /api/hotels/{id}/rooms?checkIn=yyyy-MM-dd&checkOut=yyyy-MM-dd`
- `GET /api/amenities`

### Bookings and Payments (Authenticated)

- `POST /api/bookings`
- `GET /api/bookings/my-history`
- `PUT /api/bookings/{id}/cancel`
- `POST /api/payments/process`
- `POST /api/payments/create-order`
- `POST /api/payments/verify-signature`

### Admin (ROLE_ADMIN)

- `GET /api/admin/hotel`
- `PUT /api/admin/hotel`
- `PUT /api/admin/hotel/amenities`
- `GET /api/admin/hotel/rooms`
- `POST /api/admin/hotel/rooms`
- `PUT /api/admin/hotel/rooms/{roomId}`
- `DELETE /api/admin/hotel/rooms/{roomId}`
- `GET /api/admin/amenities`
- `GET /api/admin/room-categories`

## 10. Frontend Routes

Public:

- `/`
- `/hotels`
- `/hotels/:id`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Authenticated user:

- `/checkout`
- `/dashboard`

Authenticated admin:

- `/admin/dashboard`

## 11. Development Commands

Backend:

```powershell
cd backend/HotelBookingSystem
./mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

## 12. Suggested Test Flow

1. Seed database using `postgres_seed.sql`.
2. Start backend and frontend.
3. Register a normal user and an admin user (admin must select a hotel).
4. Login as user and complete booking flow with Razorpay or pay-at-hotel.
5. Verify booking appears in dashboard and can be cancelled.
6. Trigger forgot password and reset using OTP.
7. Login as admin and verify hotel/room/service management from admin dashboard.

## 13. Security and Production Notes

- Do not commit real DB credentials, SMTP app passwords, JWT secrets, or Razorpay secrets.
- Use environment-specific config for production (profiles or env vars).
- Restrict CORS origins to trusted frontend domains in production.
- Disable test/payment sandbox keys before production rollout.

## 14. Known Defaults in Current Code

- Backend port: `8086`
- Frontend dev server: `5173`
- Frontend API default: `http://localhost:8086/api`
- Swagger: `http://localhost:8086/swagger-ui.html`

---

If you want, this can be further split into dedicated docs:

- `docs/SETUP.md` (installation + env)
- `docs/API.md` (endpoint contracts)
- `docs/ADMIN_GUIDE.md` (admin onboarding and hotel assignment rules)
