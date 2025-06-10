
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserPageHeader from '@/components/admin/UserPageHeader';
import UserSearch from '@/components/admin/UserSearch';
import UserTable from '@/components/admin/UserTable';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-06-09',
    registeredDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Business Owner',
    status: 'Active',
    lastLogin: '2024-06-08',
    registeredDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Subscriber',
    status: 'Inactive',
    lastLogin: '2024-05-25',
    registeredDate: '2024-03-10'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'Business Owner',
    status: 'Active',
    lastLogin: '2024-06-09',
    registeredDate: '2024-01-08'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'Subscriber',
    status: 'Pending',
    lastLogin: 'Never',
    registeredDate: '2024-06-05'
  }
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <UserPageHeader />
        
        <div className="flex items-center space-x-4">
          <UserSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </div>

        <UserTable users={filteredUsers} />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
