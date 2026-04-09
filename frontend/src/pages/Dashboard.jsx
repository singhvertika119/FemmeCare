import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/appointments/mine', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          setAppointments(data);
        } catch (error) {
          console.error("Error fetching", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-8 mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-teal mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600">
          This is your highly secure, encrypted portal. We're here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Upcoming Appointments</h2>
          {loading ? (
             <div className="text-center py-6 text-gray-500">Loading schedules...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>You have no scheduled appointments.</p>
              {user.role === 'Patient' && (
                <Link to="/search" className="mt-4 inline-block text-brand-teal font-medium hover:underline">
                  Find a Doctor
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                 <div key={apt._id} className="border border-brand-lavender p-4 rounded-lg bg-brand-roseWhite/30">
                    <p className="font-semibold text-gray-800 text-lg">
                      {user.role === 'Patient' ? (apt.doctor?.name ? `Dr. ${apt.doctor.name}` : 'Unknown Doctor') : (apt.patient?.name || 'Unknown Patient')}
                    </p>
                    <p className="text-brand-teal text-sm mt-1">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</p>
                    <p className="text-gray-500 text-sm mt-2">
                       Status: <span className="font-medium text-gray-700">{apt.status}</span> 
                       <span className="mx-2">&bull;</span>
                       <span className="font-medium text-brand-teal">{apt.appointmentType || 'In-Person'}</span>
                    </p>
                    
                    {apt.appointmentType === 'Video Call' && apt.videoLink && (
                       <div className="mt-4 pt-3 border-t border-brand-lavender">
                         <Link to={`/call/${apt.videoLink.split('/room/')[1]}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-teal text-white px-5 py-2 rounded-lg hover:bg-brand-teal/90 transition text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                            Join Video Call
                         </Link>
                       </div>
                    )}
                 </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Profile Details</h2>
          <div className="space-y-4">
            <div>
               <p className="text-sm text-gray-500">Role</p>
               <p className="font-semibold text-gray-800">{user.role}</p>
            </div>
            <div>
               <p className="text-sm text-gray-500">Email (Securely Encrypted in DB)</p>
               <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
               Privacy Shield Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
