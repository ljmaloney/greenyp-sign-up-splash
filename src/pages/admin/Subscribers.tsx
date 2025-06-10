
import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SubscriberPageHeader from '@/components/admin/SubscriberPageHeader';
import SubscriberSearch from '@/components/admin/SubscriberSearch';
import SubscriberTable from '@/components/admin/SubscriberTable';

// Mock subscriber data
const mockSubscribers = [
  {
    id: '1',
    name: 'Green Landscapes Inc.',
    email: 'contact@greenlandscapes.com',
    phone: '(555) 123-4567',
    address: '123 Garden Street, San Francisco, CA 94102',
    subscriptionType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-15',
    lastActivity: '2024-06-09'
  },
  {
    id: '2',
    name: 'Urban Garden Solutions',
    email: 'info@urbangarden.com',
    phone: '(555) 234-5678',
    address: '456 Park Avenue, Oakland, CA 94610',
    subscriptionType: 'Basic',
    status: 'Active',
    joinDate: '2024-02-20',
    lastActivity: '2024-06-08'
  },
  {
    id: '3',
    name: 'Eco Lawn Care',
    email: 'hello@ecolawn.com',
    phone: '(555) 345-6789',
    address: '789 Green Way, Berkeley, CA 94704',
    subscriptionType: 'Enterprise',
    status: 'Inactive',
    joinDate: '2024-03-10',
    lastActivity: '2024-05-25'
  },
  {
    id: '4',
    name: 'Nature Plus Nursery',
    email: 'sales@natureplus.com',
    phone: '(555) 456-7890',
    address: '321 Bloom Street, Palo Alto, CA 94301',
    subscriptionType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-08',
    lastActivity: '2024-06-09'
  },
  {
    id: '5',
    name: 'Garden Masters',
    email: 'contact@gardenmasters.com',
    phone: '(555) 567-8901',
    address: '654 Landscape Blvd, San Jose, CA 95110',
    subscriptionType: 'Basic',
    status: 'Pending',
    joinDate: '2024-06-05',
    lastActivity: 'Never'
  }
];

const AdminSubscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showRecent, setShowRecent] = useState(false);
  const [subscribers] = useState(mockSubscribers);

  const filteredAndSortedSubscribers = useMemo(() => {
    let filtered = subscribers;

    // Apply search filter
    if (searchTerm) {
      filtered = subscribers.filter(subscriber => {
        const term = searchTerm.toLowerCase();
        switch (searchType) {
          case 'name':
            return subscriber.name.toLowerCase().includes(term);
          case 'email':
            return subscriber.email.toLowerCase().includes(term);
          case 'phone':
            return subscriber.phone.toLowerCase().includes(term);
          case 'address':
            return subscriber.address.toLowerCase().includes(term);
          case 'all':
          default:
            return (
              subscriber.name.toLowerCase().includes(term) ||
              subscriber.email.toLowerCase().includes(term) ||
              subscriber.phone.toLowerCase().includes(term) ||
              subscriber.address.toLowerCase().includes(term)
            );
        }
      });
    }

    // Apply recent filter (last 30 days)
    if (showRecent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(subscriber => {
        const joinDate = new Date(subscriber.joinDate);
        return joinDate >= thirtyDaysAgo;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'lastActivity':
          if (a.lastActivity === 'Never') return 1;
          if (b.lastActivity === 'Never') return -1;
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });
  }, [subscribers, searchTerm, searchType, sortBy, showRecent]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <SubscriberPageHeader />

        <SubscriberSearch
          searchTerm={searchTerm}
          searchType={searchType}
          sortBy={sortBy}
          showRecent={showRecent}
          onSearchChange={setSearchTerm}
          onSearchTypeChange={setSearchType}
          onSortByChange={setSortBy}
          onRecentToggle={() => setShowRecent(!showRecent)}
        />

        <SubscriberTable 
          subscribers={filteredAndSortedSubscribers}
          showRecent={showRecent}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;
