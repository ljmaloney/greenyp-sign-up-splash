
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

interface ProfilePageLayoutProps {
  children: React.ReactNode;
}

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePageLayout;
