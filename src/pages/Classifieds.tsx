
import React, { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedsFiltersLive from '@/components/classifieds/ClassifiedsFiltersLive';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
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
            <div className="flex space-x-3">
              <Link to="/classifieds/samples">
                <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Ad Types
                </Button>
              </Link>
              <Link to="/classifieds/create">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post an Ad
                </Button>
              </Link>
            </div>
          </div>

          <ClassifiedsFiltersLive filters={filters} onFiltersChange={setFilters} />
          
          <ClassifiedsList filters={filters} />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Classifieds;
