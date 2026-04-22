import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

const BookingModal = ({ doctorId, doctorName, bookingType, onClose, onConfirm }) => {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (date) {
      const fetchSlots = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/appointments/doctors/${doctorId}/slots?date=${date}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          setSlots(data);
          setSelectedSlot('');
        } catch (error) {
          console.error("Error fetching slots", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, [date, doctorId, user.token]);

  const handleSubmit = () => {
    if (date && selectedSlot) {
      onConfirm(date, selectedSlot);
    }
  };

  // Restrict picking dates in the past (Min date is locally 'today')
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-teal p-4 text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">Book with Dr. {doctorName}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm font-medium text-brand-teal bg-brand-teal/10 inline-block px-3 py-1 rounded-full">{bookingType} Consultation</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CalendarIcon size={16} className="text-brand-teal" /> Select Date
            </label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} className="text-brand-teal" /> Available Times
            </label>
            {!date ? (
               <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center border border-gray-100">Please select a calendar date to view slots.</div>
            ) : loading ? (
               <div className="text-sm text-brand-teal text-center py-4 animate-pulse">Checking synchronized availability...</div>
            ) : slots.length === 0 ? (
               <div className="text-sm text-red-500 text-center py-4">No slots are publicly available for this date.</div>
            ) : (
               <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {slots.map(slot => (
                   <button
                     key={slot.time}
                     disabled={slot.isBooked}
                     onClick={() => setSelectedSlot(slot.time)}
                     className={`py-2 px-1 text-sm rounded-lg transition-all border ${
                       slot.isBooked ? 'bg-gray-100 border-gray-200 text-red-400 cursor-not-allowed opacity-70 line-through' 
                       : selectedSlot === slot.time ? 'bg-brand-teal border-brand-teal text-white shadow-md' 
                       : 'bg-white border-brand-lavender text-gray-700 hover:border-brand-teal hover:bg-brand-teal/5'
                     }`}
                   >
                     {slot.isBooked ? 'Booked' : slot.time}
                   </button>
                 ))}
               </div>
            )}
          </div>

          <button 
             disabled={!date || !selectedSlot}
             onClick={handleSubmit} 
             className="w-full py-3 bg-brand-teal text-white font-medium rounded-lg hover:bg-brand-teal/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
             Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
