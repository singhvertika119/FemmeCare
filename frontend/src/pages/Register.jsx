import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient',
    specialty: '',
    phoneNumber: '',
    clinicAddress: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-brand-roseWhite px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-lavender w-full max-w-md">
        <div className="flex justify-center mb-6 text-brand-teal">
          <HeartPulse size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am a...</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'Doctor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                <input 
                  type="text" 
                  name="specialty"
                  required={formData.role === 'Doctor'}
                  value={formData.specialty}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none focus:ring-2 focus:ring-brand-teal/50 transition"
                  placeholder="e.g. OB/GYN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Clinic Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber"
                  required={formData.role === 'Doctor'}
                  minLength={10}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none focus:ring-2 focus:ring-brand-teal/50 transition"
                  placeholder="e.g. 555-102-1928"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Clinic Physical Address</label>
                <input 
                  type="text" 
                  name="clinicAddress"
                  required={formData.role === 'Doctor'}
                  minLength={5}
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-brand-lavender rounded-lg outline-none focus:ring-2 focus:ring-brand-teal/50 transition"
                  placeholder="e.g. 100 Medical Plaza, NY"
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full mt-4 bg-brand-teal text-white py-2.5 rounded-lg font-medium hover:bg-brand-teal/90 transition shadow-sm">
            Create Secure Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-brand-teal font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
