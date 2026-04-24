import React, { useState, useEffect, useContext } from 'react';
import { Users, FileText, Search, X, Calendar, Video, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PatientRecords = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchPatients = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/doctors/my-patients', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          setPatients(data);
        } catch (error) {
          console.error("Error fetching patient records natively.", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPatients();
    }
  }, [user]);

  if (!user || user.role !== 'Doctor') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-brand-teal flex items-center gap-3">
              <Users size={28} className="text-brand-teal" />
              Patient Records Directory
           </h1>
           <p className="text-gray-600 mt-2">
             Securely traverse your encrypted patient histories and interaction logs.
           </p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition outline-none"
              disabled
           />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-brand-roseWhite/60 text-gray-700 border-b border-brand-lavender">
                     <th className="p-4 font-semibold text-sm">Patient ID / Email</th>
                     <th className="p-4 font-semibold text-sm">Full Name</th>
                     <th className="p-4 font-semibold text-sm">Last Consultation</th>
                     <th className="p-4 font-semibold text-sm">Account Status</th>
                     <th className="p-4 font-semibold text-sm text-right">Interactions</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500 animate-pulse font-medium">
                        Decrypting Protected Patient Matrix...
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                        No active patient logs extracted into your workspace.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                       <tr key={patient._id} className="border-b border-brand-lavender/50 last:border-none hover:bg-gray-50/50 transition">
                          <td className="p-4 text-sm text-gray-500 font-mono">{patient.email || patient._id}</td>
                          <td className="p-4 font-medium text-gray-800">{patient.name}</td>
                          <td className="p-4 text-brand-teal text-sm font-bold">
                             {patient.appointments.length > 0 ? new Date(patient.appointments[0].date).toLocaleDateString() : 'Unknown Phase'}
                          </td>
                          <td className="p-4">
                             <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                          </td>
                          <td className="p-4 text-right">
                             <button 
                                onClick={() => setActivePatient(patient)}
                                className="text-brand-teal text-sm font-bold hover:underline flex items-center justify-end gap-1.5 ml-auto"
                             >
                                <FileText size={14} /> View Appointments
                             </button>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Embedded Scheduling View Modal */}
      {activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
            <div className="bg-brand-teal p-5 text-white flex justify-between items-center shrink-0">
              <div>
                 <h3 className="font-semibold text-lg">{activePatient.name}'s History</h3>
                 <p className="text-white/80 text-sm mt-0.5">{activePatient.email}</p>
              </div>
              <button onClick={() => setActivePatient(null)} className="text-white/80 hover:text-white transition"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto grow">
               <div className="space-y-4">
                  {activePatient.appointments.map(apt => (
                     <div key={apt._id} className="border border-brand-lavender rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 hover:bg-white transition shadow-sm">
                        <div>
                           <div className="flex items-center gap-2 mb-1.5">
                              <Calendar size={16} className="text-brand-teal" />
                              <span className="font-bold text-gray-800 text-lg">{new Date(apt.date).toLocaleDateString()}</span>
                              <span className="text-gray-500 font-medium text-sm">at {apt.timeSlot}</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm mt-2">
                              <span className="flex items-center gap-1.5 text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                 {apt.appointmentType === 'Video Call' ? <Video size={14} className="text-brand-teal" /> : <MapPin size={14} className="text-brand-teal" />}
                                 {apt.appointmentType || 'In-Person'}
                              </span>
                              <span className="mx-0.5 text-gray-300">|</span>
                              <span className={`font-bold flex items-center gap-1.5 ${apt.status === 'Completed' ? 'text-green-600' : apt.status === 'Cancelled' ? 'text-red-500' : 'text-blue-600'}`}>
                                 <div className={`w-2 h-2 rounded-full ${apt.status === 'Completed' ? 'bg-green-500' : apt.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
                                 {apt.status}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
