import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ appointment, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating securely.');
      return;
    }
    
    setLoading(true);
    setError(null);

    // Mongoose Object references require traversing correctly. Since we loaded `doctor` via populate,
    // its physical ObjectId is nested safely at appointment.doctor._id. 
    // Wait! Dashboard.jsx uses nested queries if populated, or plain strings if mocked!
    // Safest fallback:
    const doctorId = appointment.doctor?._id || appointment.doctor;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors/${doctorId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        onSuccess(appointment._id, rating);
        onClose();
      } else {
        const errData = await response.json();
        setError(`Database Error: ${errData.message}`);
      }
    } catch (err) {
      setError('A critical network error terminated the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-teal p-4 text-white flex justify-between items-center">
          <h3 className="font-semibold px-2">Secure Patient Verification Review</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4 text-center">
             Your feedback will be mathematically aggregated onto your provider's public profile securely.
          </p>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">{error}</div>}

          {/* Star Interactive Vector */}
          <div className="flex justify-center flex-row-reverse mb-6 space-x-1 space-x-reverse">
             {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition duration-150 p-1"
                >
                  <Star 
                     size={32} 
                     className={`${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                  />
                </button>
             ))}
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-2">Optional Feedback</label>
             <textarea 
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Briefly detail your specific verified consultation experience."
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition outline-none resize-none"
             ></textarea>
          </div>

          <button 
             disabled={loading}
             onClick={handleSubmit} 
             className="w-full bg-brand-teal text-white py-3 rounded-lg font-medium hover:bg-brand-teal/90 transition shadow disabled:opacity-50"
          >
             {loading ? 'Processing DB Mapping...' : 'Publish Authentic Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
