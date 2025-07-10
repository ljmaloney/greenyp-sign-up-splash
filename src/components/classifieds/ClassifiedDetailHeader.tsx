
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Classified } from '@/types/classifieds';

interface ClassifiedDetailHeaderProps {
  classified: Classified;
}

const ClassifiedDetailHeader = ({ classified }: ClassifiedDetailHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <Link to="/classifieds">
          <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classifieds
          </Button>
        </Link>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">{classified.title}</h1>
          <Badge variant="secondary" className="ml-4">{classified.category}</Badge>
        </div>

        <div className="flex items-center text-gray-500 space-x-6 mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
            <span>{classified.zipCode}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-greenyp-600" />
            <span>Posted {format(new Date(classified.createdAt), 'MMMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassifiedDetailHeader;
