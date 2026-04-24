import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ManageTimeSlots = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' }); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.workingHours) {
          setFormData({
            startTime: data.workingHours.start || '09:00',
            endTime: data.workingHours.end || '17:00',
            slotDuration: data.workingHours.slotDuration || 30
          });
        }
      } catch (err) {
         console.error('Network load blocked', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
     setFormData({
        ...formData,
        [e.target.name]: e.target.value
     });
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('http://localhost:5000/api/doctors/working-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
           startTime: formData.startTime,
           endTime: formData.endTime,
           slotDuration: Number(formData.slotDuration)
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Operational boundaries securely synchronized within master DB.' });
      } else {
        setMessage({ type: 'error', text: 'Failed adjusting timeline configurations natively.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network transport decoupled internally during synchronization.' });
    }
  };

  // Generate generic 24 hour array structures statically
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });

  if (!user || user.role !== 'Doctor') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-teal mb-4 flex items-center justify-center gap-3">
           <Settings size={28} className="text-brand-teal" />
           Manage Your Working Hours
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure your daily availability, update slot durations, and tightly control physically exactly when patients can interact with your schedule.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-8 max-w-2xl mx-auto">
         <div className="mb-6 pb-4 border-b border-brand-lavender flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <Calendar size={20} className="text-brand-teal" />
               Current Calendar Availability
            </h2>
            <button 
               onClick={handleSave}
               className="bg-brand-teal text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition text-sm flex items-center justify-center gap-2"
            >
               <Save size={16} />
               Save Layout
            </button>
         </div>

         {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-2 mb-6 text-sm font-medium border shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
               {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
               {message.text}
            </div>
         )}

         {loading ? (
            <div className="py-12 text-center text-gray-400 animate-pulse font-medium">Extracting Secure Parameter Settings...</div>
         ) : (
            <div className="grid gap-6">
               <div className="bg-brand-roseWhite/40 border border-brand-lavender p-6 rounded-2xl space-y-5">
                  
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-brand-teal" />
                        Shift Start Time
                     </label>
                     <select 
                        name="startTime" 
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition bg-white"
                     >
                        {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        Shift End Time
                     </label>
                     <select 
                        name="endTime" 
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition bg-white"
                     >
                        {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                     </select>
                  </div>

               </div>

               <div className="bg-brand-roseWhite/40 border border-brand-lavender p-6 rounded-2xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Slot Duration Granularity</label>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                     This variable mathematically defines the precision matrices generated on your public calendar interface safely restricting appointment overlaps dynamically.
                  </p>
                  
                  <select 
                     name="slotDuration" 
                     value={formData.slotDuration}
                     onChange={handleChange}
                     className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition bg-white"
                  >
                     <option value="15">15 Minutes</option>
                     <option value="30">30 Minutes</option>
                     <option value="60">60 Minutes</option>
                  </select>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default ManageTimeSlots;
