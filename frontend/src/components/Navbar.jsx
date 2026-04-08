import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-brand-lavender sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <HeartPulse className="text-brand-teal" size={28} />
            <span className="font-serif text-xl font-bold text-gray-800">FemmeCare</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-gray-600 hover:text-brand-teal font-medium transition">
              Find a Doctor
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-brand-lavender">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-brand-teal transition">
                  <UserCircle size={20} />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm border border-brand-teal text-brand-teal px-4 py-1.5 rounded-full hover:bg-brand-teal hover:text-white transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-brand-lavender">
                <Link to="/login" className="text-gray-600 hover:text-brand-teal font-medium transition">
                  Sign in
                </Link>
                <Link to="/register" className="bg-brand-teal text-white px-5 py-2 rounded-full font-medium hover:bg-brand-teal/90 transition shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
