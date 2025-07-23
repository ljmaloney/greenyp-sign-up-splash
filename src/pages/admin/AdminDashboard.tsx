
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Admin: {user?.email}</p>
        <p className="text-gray-600">Admin dashboard content coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
