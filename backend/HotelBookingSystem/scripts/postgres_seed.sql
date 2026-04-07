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

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 7, '14 Marina Drive', 'Chennai', 'Tamil Nadu', 'India', '600001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 7);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 8, '202 Tech Valley Road', 'Hyderabad', 'Telangana', 'India', '500081'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 8);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 9, '33 Riverside Lane', 'Kolkata', 'West Bengal', 'India', '700001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 9);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 10, '5 Harbour Front', 'Kochi', 'Kerala', 'India', '682001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 10);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 11, '17 Lake Palace Road', 'Udaipur', 'Rajasthan', 'India', '313001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 11);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 12, '89 Ghat View Street', 'Varanasi', 'Uttar Pradesh', 'India', '221001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 12);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 13, '41 Green Park Avenue', 'Pune', 'Maharashtra', 'India', '411001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 13);

INSERT INTO addresses (address_id, street, city, state, country, zip_code)
SELECT 14, '11 Boulevard Residency', 'Srinagar', 'Jammu and Kashmir', 'India', '190001'
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE address_id = 14);

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

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 7, 'Marina Bay Grand', 'Seafront luxury retreat with rooftop infinity pool and fine dining.', 7, 4.7, 6800,
       'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80',
       'reservations@marinabaygrand.com', '+91-44-4100-7700', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 7);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 8, 'Cyber Pearl Residency', 'Business-friendly stay near IT corridor with smart workspace suites.', 8, 4.4, 4200,
       'https://images.unsplash.com/photo-1501117716987-c8e1ecb210f8?auto=format&fit=crop&w=1600&q=80',
       'stay@cyberpearl.in', '+91-40-5200-8800', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 8);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 9, 'Howrah Heritage Palace', 'Colonial-style boutique property blending heritage and modern comforts.', 9, 4.5, 5100,
       'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1600&q=80',
       'hello@howrahheritage.com', '+91-33-6100-9900', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 9);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 10, 'Cochin Backwater Retreat', 'Tranquil waterfront resort with Ayurveda spa and sunset deck.', 10, 4.6, 5900,
       'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80',
       'book@backwaterretreat.in', '+91-484-4700-6600', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 10);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 11, 'Lakeview Royal Udaipur', 'Elegant palace-inspired suites overlooking serene lakes.', 11, 4.8, 7800,
       'https://images.unsplash.com/photo-1578774204375-826dc5d996ed?auto=format&fit=crop&w=1600&q=80',
       'royal@lakeviewudaipur.com', '+91-294-4300-2200', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 11);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 12, 'Ganges Serenity Inn', 'Spiritual riverside experience with sunrise yoga and vegetarian cuisine.', 12, 4.3, 3400,
       'https://images.unsplash.com/photo-1542314831-c6a4d14d8387?auto=format&fit=crop&w=1600&q=80',
       'namaste@gangesserenity.in', '+91-542-3200-4400', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 12);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 13, 'Deccan Urban Stay', 'Contemporary city hotel with coworking lounge and fitness studio.', 13, 4.2, 3900,
       'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80',
       'contact@deccanurbanstay.com', '+91-20-4500-3000', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 13);

INSERT INTO hotels (hotel_id, name, description, address_id, rating, base_price, image_url, contact_email, contact_phone, created_at)
SELECT 14, 'Kashmir Snowcrest Resort', 'Scenic mountain resort with heated rooms and valley-view balconies.', 14, 4.7, 7200,
       'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=1600&q=80',
       'stay@snowcrestkashmir.com', '+91-194-4100-5500', NOW()
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_id = 14);

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

INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 701, 7, 1, 'M-201', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 701);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 801, 8, 4, 'IT-07', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 801);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 901, 9, 5, 'H-310', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 901);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 1001, 10, 3, 'BW-12', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 1001);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 1101, 11, 5, 'L-501', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 1101);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 1201, 12, 3, 'G-108', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 1201);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 1301, 13, 4, 'D-220', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 1301);
INSERT INTO rooms (room_id, hotel_id, category_id, room_number, availability)
SELECT 1401, 14, 9, 'S-02', TRUE WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_id = 1401);

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

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 7, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 7 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 7, 2 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 7 AND amenity_id = 2);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 7, 5 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 7 AND amenity_id = 5);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 8, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 8 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 8, 3 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 8 AND amenity_id = 3);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 9, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 9 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 9, 5 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 9 AND amenity_id = 5);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 10, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 10 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 10, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 10 AND amenity_id = 4);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 10, 6 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 10 AND amenity_id = 6);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 11, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 11 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 11, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 11 AND amenity_id = 4);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 11, 5 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 11 AND amenity_id = 5);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 12, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 12 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 12, 6 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 12 AND amenity_id = 6);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 13, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 13 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 13, 3 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 13 AND amenity_id = 3);

INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 14, 1 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 14 AND amenity_id = 1);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 14, 2 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 14 AND amenity_id = 2);
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT 14, 4 WHERE NOT EXISTS (SELECT 1 FROM hotel_amenities WHERE hotel_id = 14 AND amenity_id = 4);

-- Keep identity sequences ahead of inserted explicit IDs
SELECT setval(pg_get_serial_sequence('addresses', 'address_id'), COALESCE((SELECT MAX(address_id) FROM addresses), 1), true);
SELECT setval(pg_get_serial_sequence('amenities', 'amenity_id'), COALESCE((SELECT MAX(amenity_id) FROM amenities), 1), true);
SELECT setval(pg_get_serial_sequence('room_categories', 'category_id'), COALESCE((SELECT MAX(category_id) FROM room_categories), 1), true);
SELECT setval(pg_get_serial_sequence('hotels', 'hotel_id'), COALESCE((SELECT MAX(hotel_id) FROM hotels), 1), true);
SELECT setval(pg_get_serial_sequence('rooms', 'room_id'), COALESCE((SELECT MAX(room_id) FROM rooms), 1), true);
