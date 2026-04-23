import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchSpecialists from './pages/SearchSpecialists';
import VideoCall from './pages/VideoCall';
import ManageTimeSlots from './pages/ManageTimeSlots';
import PatientRecords from './pages/PatientRecords';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import DoctorRoute from './components/DoctorRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Main layout wrapper injecting the Nav and AI helper
const MainLayout = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-brand-roseWhite font-sans">
      <Navbar />
      <Outlet />
      {user?.role !== 'Doctor' && <AIAssistant />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes wrapped with Navbar & AI */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchSpecialists />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            
            {/* Protected strictly for Doctor Role natively via Wrapper */}
            <Route element={<DoctorRoute />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/slots" element={<ManageTimeSlots />} />
              <Route path="/doctor/patients" element={<PatientRecords />} />
            </Route>
          </Route>

          {/* Fullscreen Route separated entirely from UI shells */}
          <Route path="/call/:roomId" element={<VideoCall />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
