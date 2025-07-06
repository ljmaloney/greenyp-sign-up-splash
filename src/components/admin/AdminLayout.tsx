
import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Main content with fixed left margin to account for sidebar */}
        <main className="flex-1 p-6 text-left lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
