import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { api } from '../services/api';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, roomsData] = await Promise.all([
          api.getHotelById(id),
          api.getRoomsByHotel(id)
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32 bg-slate-50 min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="py-20 text-center text-xl">Hotel not found</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Image */}
      <div className="h-[400px] bg-slate-800 relative">
        <img 
          src={`https://picsum.photos/seed/${(hotel.hotelId || hotel.hotel_id) * 10}/1600/900`} 
          alt={hotel.name} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Link to="/hotels" className="text-white hover:text-brand-accent text-sm mb-4 inline-flex items-center">
              &larr; Back to Hotels
            </Link>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{hotel.name}</h1>
                <div className="flex items-center text-slate-200 space-x-4">
                  <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {hotel.rating} Rating
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About this property</h2>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {hotel.description}
                <br/><br/>
                Experience the luxury of LuxeStay with our premium properties. Enjoy round-the-clock service, elegant dining options, and prime locations that capture the essence of the city. 
              </p>
            </div>

            <div className="bg-white text-left rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.length > 0 ? (
                  rooms.map(room => (
                    <RoomCard key={room.roomId || room.room_id} room={room} hotelId={hotel.hotelId || hotel.hotel_id} />
                  ))
                ) : (
                  <p className="text-slate-500">No rooms available for this property at the moment.</p>
                )}
              </div>
            </div>
          </div>

          {/* Map/Contact Sidebar */}
          <div className="space-y-6 mt-8 lg:mt-0">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-brand-navy mb-4">Property Info</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-brand-accent mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>123 Luxury Avenue,<br/>Metropolis City, 10001</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-brand-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{hotel.contact_phone}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-brand-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span>{hotel.contact_email}</span>
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-brand-navy mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'].map(am => (
                    <span key={am} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {am}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
