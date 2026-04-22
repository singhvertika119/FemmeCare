import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';
import { useNavigate } from 'react-router-dom';

const SearchSpecialists = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal tracking state
  const [activeModal, setActiveModal] = useState(null); // { doctorId, doctorName, bookingType }
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const openModal = (doctor, type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveModal({ doctorId: doctor._id, doctorName: doctor.name, bookingType: type });
  };

  const handleConfirmBooking = async (date, timeSlot) => {
    setErrorMsg('');
    setBookingMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          doctorId: activeModal.doctorId,
          date, 
          timeSlot,
          reason: 'General Checkup',
          appointmentType: activeModal.bookingType
        })
      });

      if (response.ok) {
        setBookingMsg('Appointment successfully scheduled!');
        setActiveModal(null);
        setTimeout(() => setBookingMsg(''), 3000);
      } else {
        const errData = await response.json();
        setErrorMsg(`Action Blocked: ${errData.message}`);
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (error) {
      setErrorMsg('Network error. Failed to schedule appointment.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-teal mb-4">Find a Specialist</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our highly qualified, verified female professionals.
        </p>
      </div>

      {bookingMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center shadow-sm border border-green-200">
          {bookingMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-center shadow-sm border border-red-200">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">Loading verified specialists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <DoctorCard 
              key={doctor._id} 
              doctor={doctor} 
              onBook={(type) => openModal(doctor, type)} 
            />
          ))}
        </div>
      )}

      {/* Booking Overlay Modal Injection */}
      {activeModal && (
        <BookingModal 
          doctorId={activeModal.doctorId}
          doctorName={activeModal.doctorName}
          bookingType={activeModal.bookingType}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default SearchSpecialists;
