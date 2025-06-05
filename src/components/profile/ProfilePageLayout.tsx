
import React from 'react';
import Header from '@/components/PublicHeader';
import Footer from '@/components/Footer';

interface ProfilePageLayoutProps {
  children: React.ReactNode;
}

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePageLayout;
