
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ContactsList from '@/components/dashboard/ContactsList';

const Contacts = () => {
  return (
    <DashboardLayout>
      <ContactsList />
    </DashboardLayout>
  );
};

export default Contacts;
