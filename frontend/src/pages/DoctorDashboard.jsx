import React from 'react';
import Dashboard from './Dashboard';

// Wrapper component to cleanly isolate the Doctor's specific Dashboard route
// while safely reusing the primary secure Dashboard component's internal logic.
const DoctorDashboard = () => {
  return <Dashboard />;
};

export default DoctorDashboard;
