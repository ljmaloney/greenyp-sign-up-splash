
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

const SearchResultsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Link to="/classifieds">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Classifieds
        </Button>
      </Link>
      
      <Link to="/classifieds/create">
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
          <Plus className="w-4 h-4 mr-2" />
          Post my Ad
        </Button>
      </Link>
    </div>
  );
};

export default SearchResultsHeader;
