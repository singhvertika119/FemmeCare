import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorRoute = () => {
    const { user } = useContext(AuthContext);
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.role !== 'Doctor') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
};

export default DoctorRoute;
