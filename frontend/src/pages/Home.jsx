import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, MessageCircleHeart } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-roseWhite min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-lavender/30 to-transparent pointer-events-none"></div>
        <div className="z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-gray-900 leading-tight">
            Empathetic healthcare, <br />
            <span className="text-brand-teal">designed for women.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We provide a safe, digital space where women can find professional female medical help without hesitation or judgement. Your comfort is our priority.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="bg-brand-teal text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-brand-teal/90 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center">
              Find a Specialist
            </Link>
            <Link to="/login" className="bg-white text-brand-teal border border-brand-teal px-8 py-3 rounded-full text-lg font-semibold hover:bg-brand-lavender/30 transition text-center">
              Login to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-roseWhite rounded-full flex items-center justify-center text-brand-teal">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">100% Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted. We prioritize your privacy above all else.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-roseWhite rounded-full flex items-center justify-center text-brand-teal">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Seamless Booking</h3>
            <p className="text-gray-600">Connect with female specialists instantly and schedule appointments with ease.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-roseWhite rounded-full flex items-center justify-center text-brand-teal">
              <MessageCircleHeart size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">AI Health Assistant</h3>
            <p className="text-gray-600">Get supportive, non-diagnostic guidance anytime, day or night.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
