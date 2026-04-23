import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Star, MapPin, ArrowLeft, MessageSquare } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const doctor = state?.doctor; // Lightning fast cache pulling directly off the router navigation event
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${id}/reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed executing remote review aggregation map.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  if (!doctor) {
     return <div className="p-10 text-center text-gray-500">Routing payload detached. Please navigate back to search.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/search" className="inline-flex items-center gap-2 text-brand-teal hover:underline mb-8 font-medium">
        <ArrowLeft size={18} />
        Back to Specialists Directory
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-lavender mb-8">
         <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-brand-lavender rounded-full flex items-center justify-center text-brand-teal font-bold text-3xl shadow-sm">
              {doctor.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Dr. {doctor.name}</h1>
              <p className="text-brand-teal font-semibold text-lg mb-2">{doctor.specialty}</p>

              {doctor.clinicAddress && (
                 <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 mb-4 font-medium">
                    <MapPin size={16} className="text-brand-lavender" />
                    {doctor.clinicAddress}
                 </p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-3 bg-amber-50 inline-flex px-4 py-2 rounded-full border border-amber-100 mb-6">
                 <div className="flex items-center text-amber-500 font-bold">
                    <Star size={16} className="fill-current mr-1.5" />
                    {doctor.averageRating ? doctor.averageRating.toFixed(1) : '5.0'}
                 </div>
                 <div className="w-1 h-1 rounded-full bg-amber-300"></div>
                 <div className="text-amber-700 text-sm font-medium">
                    {doctor.totalReviews || 0} Verified Interactions
                 </div>
              </div>

              <div className="bg-brand-roseWhite/50 p-6 rounded-2xl border border-brand-roseWhite mt-2">
                 <h3 className="font-bold text-gray-800 mb-2">About The Provider</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">
                    {doctor.bio || 'Dedicated to providing a safe, comfortable, and comprehensive care experience strictly protecting your physical boundaries.'}
                 </p>
              </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-lavender">
         <div className="flex items-center gap-3 mb-8 pb-4 border-b border-brand-lavender">
            <div className="bg-brand-teal/10 p-2.5 rounded-xl text-brand-teal">
               <MessageSquare size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 font-serif">Verified Patient Testimonials</h2>
         </div>

         {loading ? (
            <div className="py-12 text-center text-gray-400 animate-pulse font-medium">Synchronizing Secure Database Feedback...</div>
         ) : reviews.length === 0 ? (
            <div className="py-12 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
               <p className="text-gray-500 font-medium">No verified public records available for this specialist yet.</p>
            </div>
         ) : (
            <div className="grid gap-6">
               {reviews.map(review => (
                  <div key={review._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-brand-teal/10 text-brand-teal font-bold flex items-center justify-center text-sm">
                              {review.patientId?.name ? review.patientId.name.charAt(0) : 'A'}
                           </div>
                           <div>
                              <span className="font-bold text-gray-800 block text-sm">{review.patientId?.name || 'Anonymous Patient'}</span>
                              <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-amber-50 flex items-center gap-1.5">
                           <Star size={12} className="fill-amber-400 text-amber-400" />
                           <span className="font-bold text-amber-600 text-sm">{review.rating}.0</span>
                        </div>
                     </div>
                     {review.comment && (
                        <p className="text-gray-600 text-sm leading-relaxed mt-4 bg-white p-4 rounded-xl shadow-sm border border-brand-roseWhite">"{review.comment}"</p>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default DoctorProfile;
