import React from 'react';
import { Users, FileText, Search } from 'lucide-react';

const PatientRecords = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-brand-teal flex items-center gap-3">
              <Users size={28} className="text-brand-teal" />
              Patient Records Directory
           </h1>
           <p className="text-gray-600 mt-2">
             Securely traverse your encrypted patient histories and medical forms.
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
         {/* Placeholder UI for Patient Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-brand-roseWhite/60 text-gray-700 border-b border-brand-lavender">
                     <th className="p-4 font-semibold text-sm">Patient ID</th>
                     <th className="p-4 font-semibold text-sm">Full Name</th>
                     <th className="p-4 font-semibold text-sm">Last Consultation</th>
                     <th className="p-4 font-semibold text-sm">Status</th>
                     <th className="p-4 font-semibold text-sm text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {/* Mock empty states */}
                  {[1, 2, 3].map((row) => (
                     <tr key={row} className="border-b border-brand-lavender/50 last:border-none hover:bg-gray-50/50 transition">
                        <td className="p-4 text-sm text-gray-500 font-mono">FC-XX00{row}</td>
                        <td className="p-4">
                           <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="p-4">
                           <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="p-4">
                           <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium opacity-50">Active</span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="text-brand-teal text-sm font-medium hover:underline opacity-50 cursor-not-allowed flex items-center justify-end gap-1 ml-auto">
                              <FileText size={14} /> Open File
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 text-center border-t border-brand-lavender text-sm text-gray-500">
            End of secured index. Database fetching coming soon.
         </div>
      </div>
    </div>
  );
};

export default PatientRecords;
