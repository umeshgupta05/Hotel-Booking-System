-- PostgreSQL schema and seed data for HotelBookingSystem

CREATE TABLE IF NOT EXISTS addresses (
    address_id BIGSERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    zip_code VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS amenities (
    amenity_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS room_categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    base_price DOUBLE PRECISION,
    capacity INTEGER
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    address_id BIGINT UNIQUE,
    rating DOUBLE PRECISION,
    base_price DOUBLE PRECISION,
    image_url VARCHAR(2048),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    created_at TIMESTAMP,
    CONSTRAINT fk_hotels_address FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id BIGSERIAL PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    room_number VARCHAR(255),
    availability BOOLEAN,
    CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    CONSTRAINT fk_rooms_category FOREIGN KEY (category_id) REFERENCES room_categories(category_id)
);

CREATE TABLE IF NOT EXISTS hotel_amenities (
    hotel_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id),
    CONSTRAINT fk_hotel_amenities_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    CONSTRAINT fk_hotel_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
);

-- Addresses
INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 1, '12 Sapphire Avenue', 'Mumbai', 'Maharashtra', 'India', '400001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 1);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 2, '78 Beach Road', 'Goa', 'Goa', 'India', '403001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 2);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 3, '45 Corporate Park', 'Bengaluru', 'Karnataka', 'India', '560001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 3);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 4, '21 Heritage Lane', 'Jaipur', 'Rajasthan', 'India', '302001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 4);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 5, '88 Skyline Street', 'Delhi', 'Delhi', 'India', '110001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 5);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 6, '9 Pine Trail', 'Manali', 'Himachal Pradesh', 'India', '175131'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 6);

-- Amenities
INSERT INTO amenities (amenity_id, name)
SELECT 1, 'Free WiFi' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 1);
INSERT INTO amenities (amenity_id, name)
SELECT 2, 'Swimming Pool' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 2);
INSERT INTO amenities (amenity_id, name)
SELECT 3, 'Gym' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 3);
INSERT INTO amenities (amenity_id, name)
SELECT 4, 'Spa' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 4);
INSERT INTO amenities (amenity_id, name)
SELECT 5, 'Restaurant' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 5);
INSERT INTO amenities (amenity_id, name)
SELECT 6, 'Room Service' WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE amenity_id = 6);

-- Room Categories
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 1, 'Deluxe King', 4500, 2 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 1);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 2, 'Presidential Suite', 15000, 4 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 2);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 3, 'Ocean View Standard', 3000, 2 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 3);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 4, 'Business Studio', 2500, 1 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 4);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 5, 'Heritage Suite', 8500, 3 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 5);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 6, 'Royal Villa', 22000, 6 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 6);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 7, 'Compact Single', 900, 1 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 7);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 8, 'Double Bunk Room', 1500, 4 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 8);
INSERT INTO room_categories (category_id, name, base_price, capacity)
SELECT 9, 'Alpine Cabana', 5200, 2 WHERE NOT EXISTS (SELECT 1 FROM room_categories WHERE category_id = 9);

-- Hotels (based on frontend mock data + image URLs)
INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 1, 'Luxury Plaza Hotel', 'Experience 5-star comfort right in the heart of the city.', 1, 4.8, 4500,
       'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
       'contact@luxuryplaza.com', '+1-555-0100', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 1);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 2, 'Seaside Resort & Spa', 'Relaxing oceanfront property with premium spa amenities.', 2, 4.6, 3000,
       'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
       'hello@seasideresort.com', '+1-555-0200', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 2);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 3, 'Downtown Business Suites', 'Perfect for the modern core business traveler.', 3, 4.2, 2500,
       'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80',
       'info@downtownsuites.com', '+1-555-0300', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 3);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 4, 'The Royal Orchard Inn', 'Heritage property offering a blend of traditional culture and modern luxury.', 4, 4.9, 8500,
       'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
       'stay@royalorchard.com', '+1-555-0400', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 4);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 5, 'Skyline Budget Stays', 'Affordable, clean, and highly accessible locations for backpackers.', 5, 3.8, 900,
       'https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=1600&q=80',
       'contact@skylinebudget.com', '+1-555-0500', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 5);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 6, 'Mountain View Lodge', 'Breathtaking views of the mountains, with cozy fireplaces in every room.', 6, 4.5, 5200,
       'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80',
       'bookings@mountainview.com', '+1-555-0600', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 6);

-- Rooms
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 101, 1, 1, '201A', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 101);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 102, 1, 2, 'PH-1', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 102);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 201, 2, 3, '101B', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 201);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 301, 3, 4, '505C', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 301);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 401, 4, 5, '110', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 401);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 402, 4, 6, 'V-1', FALSE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 402);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 501, 5, 7, 'B12', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 501);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 502, 5, 8, 'B14', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 502);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 601, 6, 9, 'C-4', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 601);

-- Hotel Amenities
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 1 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 1 AND amenity_id = 2);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 1, 3 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 1 AND amenity_id = 3);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 2, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 2 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 2, 2 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 2 AND amenity_id = 2);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 2, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 2 AND amenity_id = 4);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 3, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 3 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 3, 3 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 3 AND amenity_id = 3);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 4, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 4 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 4, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 4 AND amenity_id = 4);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 4, 5 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 4 AND amenity_id = 5);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 5, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 5 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 5, 6 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 5 AND amenity_id = 6);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 6, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 6 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 6, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 6 AND amenity_id = 4);

-- Keep identity sequences ahead of inserted explicit IDs
SELECT setval(pg_get_serial_sequence('addresses', 'address_id'), COALESCE((SELECT MAX(address_id) FROM addresses), 1), true);
SELECT setval(pg_get_serial_sequence('amenities', 'amenity_id'), COALESCE((SELECT MAX(amenity_id) FROM amenities), 1), true);
SELECT setval(pg_get_serial_sequence('room_categories', 'category_id'), COALESCE((SELECT MAX(category_id) FROM room_categories), 1), true);
SELECT setval(pg_get_serial_sequence('hotels', 'hotel_id'), COALESCE((SELECT MAX(hotel_id) FROM hotels), 1), true);
SELECT setval(pg_get_serial_sequence('rooms', 'room_id'), COALESCE((SELECT MAX(room_id) FROM rooms), 1), true);
