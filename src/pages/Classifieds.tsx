
import React, { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import ClassifiedsFilters from '@/components/classifieds/ClassifiedsFilters';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import RecentClassifieds from '@/components/classifieds/RecentClassifieds';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClassifiedFilters } from '@/types/classifieds';

const Classifieds = () => {
  const [filters, setFilters] = useState<ClassifiedFilters>({});

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Classifieds</h1>
            <Link to="/classifieds/create">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                <Plus className="w-4 h-4 mr-2" />
                Post an Ad
              </Button>
            </Link>
          </div>

          <ClassifiedsFilters filters={filters} onFiltersChange={setFilters} />
          
          <div className="mb-12">
            <RecentClassifieds />
          </div>

          <ClassifiedsList filters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Classifieds;
