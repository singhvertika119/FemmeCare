import { CalendarPlus, Star } from 'lucide-react';

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-lavender p-6 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-brand-lavender rounded-full flex items-center justify-center text-brand-teal font-bold text-xl">
          {doctor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800">Dr. {doctor.name}</h3>
            <div className="flex items-center text-amber-500 text-sm font-medium">
               <Star size={14} className="fill-current mr-1" />
               5.0
            </div>
          </div>
          <p className="text-brand-teal text-sm font-medium mb-2">{doctor.specialty}</p>
          <p className="text-gray-600 text-sm line-clamp-3">
            {doctor.bio || 'Dedicated to providing a safe, comfortable, and comprehensive care experience for all women.'}
          </p>

          <button 
            onClick={onBook}
            className="mt-4 w-full bg-brand-teal/10 text-brand-teal font-medium py-2 rounded-lg hover:bg-brand-teal hover:text-white transition flex items-center justify-center gap-2"
          >
             <CalendarPlus size={18} />
             Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
