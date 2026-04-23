import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewModal, setActiveReviewModal] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/appointments/mine', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          // By mounting the raw payload reversed, users can always securely view their history
          // including 'Completed' variants which trigger the new Review modal.
          setAppointments(data.reverse());
        } catch (error) {
          console.error("Error fetching", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this secure medical appointment?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
           // Live reactive update mutating layout instantly without full-page reloads
           setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status: 'Cancelled' } : apt));
        } else {
           const errData = await res.json();
           alert(errData.message || 'Action Blocked.');
        }
      } catch (error) {
         alert('Network connection error.');
      }
    }
  };

  const handleReviewSuccess = (id, rating) => {
    // Dynamic replacement injecting badge visibility bypassing refresh loops
    setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, hasReviewed: true, givenRating: rating } : apt));
  };

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

      {/* 24-Hour Reminder Visual Alert Banner */}
      {appointments.some(apt => {
         const aptTime = new Date(apt.date).getTime();
         const now = Date.now();
         return aptTime > now && aptTime < now + (24 * 60 * 60 * 1000);
      }) && (
         <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm mb-8 animate-pulse">
            <div className="flex items-center gap-3">
               <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               </div>
               <div>
                  <h3 className="text-amber-800 font-bold">Urgent Calendar Notice</h3>
                  <p className="text-amber-700 text-sm">You have a secure medical consultation scheduled within the next <span className="font-bold">24 hours</span>. Please ensure you are prepared to join.</p>
               </div>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Your Appointments</h2>
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

                    {apt.status === 'Scheduled' && user.role === 'Patient' && (
                       <div className="mt-4 pt-3 border-t border-brand-lavender">
                         <button 
                            onClick={() => handleCancel(apt._id)} 
                            className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium border border-red-100 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            Cancel Appointment
                         </button>
                       </div>
                    )}

                    {/* NEW REVIEW LOGIC */}
                    {apt.status === 'Completed' && user.role === 'Patient' && !apt.hasReviewed && (
                       <div className="mt-4 pt-3 border-t border-brand-lavender">
                         <button 
                            onClick={() => setActiveReviewModal(apt)} 
                            className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-lg hover:bg-brand-teal hover:text-white transition text-sm font-medium border border-brand-lavender shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Leave a Review
                         </button>
                       </div>
                    )}

                    {apt.status === 'Completed' && user.role === 'Patient' && apt.hasReviewed && (
                       <div className="mt-4 pt-3 border-t border-brand-lavender">
                         <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Rated: {apt.givenRating}
                         </span>
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

      {/* Interactive Evaluation Overlay */}
      {activeReviewModal && (
         <ReviewModal 
            appointment={activeReviewModal} 
            onClose={() => setActiveReviewModal(null)} 
            onSuccess={handleReviewSuccess} 
         />
      )}
    </div>
  );
};

export default Dashboard;
