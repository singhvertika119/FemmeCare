import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchSpecialists = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleBook = async (doctorId, type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
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
          doctorId,
          date: new Date().toISOString(), // Mocking to today
          timeSlot: '10:00 AM',
          reason: 'General Checkup',
          appointmentType: type
        })
      });

      if (response.ok) {
        setBookingMsg('Appointment successfully scheduled!');
        setTimeout(() => setBookingMsg(''), 3000);
      } else {
        const errData = await response.json();
        setErrorMsg(`Error: ${errData.message}`);
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (error) {
      setErrorMsg('Failed to schedule appointment.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
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
        <div className="text-center py-20 text-gray-500">Loading specialists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <DoctorCard key={doctor._id} doctor={doctor} onBook={(type) => handleBook(doctor._id, type)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSpecialists;
