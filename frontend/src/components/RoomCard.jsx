import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room, hotelId }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate('/checkout', { state: { room, hotelId } });
  };

  return (
    <div className="bg-white border text-left border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all gap-4">
      <div>
        <h4 className="text-lg font-bold text-slate-900">{room.category_name || room.roomCategory?.name}</h4>
        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Sleeps {room.capacity || room.roomCategory?.capacity}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {room.availability ? <span className="text-green-600">Available</span> : <span className="text-red-500">Booked</span>}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:items-end w-full sm:w-auto">
        <div className="text-2xl font-bold text-brand-navy mb-2">
          ₹{(room.base_price || room.roomCategory?.basePrice || 0).toLocaleString()}<span className="text-sm text-slate-500 font-normal"> / night</span>
        </div>
        <button 
          onClick={handleBook}
          disabled={!room.availability}
          className="w-full sm:w-auto btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-2 px-6"
        >
          {room.availability ? 'Book Now' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
