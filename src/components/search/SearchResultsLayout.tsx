
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

interface SearchResultsLayoutProps {
  children: React.ReactNode;
}

const SearchResultsLayout = ({ children }: SearchResultsLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow py-8 px-4 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsLayout;
