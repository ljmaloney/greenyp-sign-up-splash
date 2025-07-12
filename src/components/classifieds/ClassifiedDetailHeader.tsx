
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Classified } from '@/types/classifieds';

interface ClassifiedDetailHeaderProps {
  classified: Classified;
  categoryName?: string;
  price?: number;
  backUrl?: string;
  backLabel?: string;
}

const ClassifiedDetailHeader = ({ 
  classified, 
  categoryName, 
  price, 
  backUrl = '/classifieds',
  backLabel = 'Back to Classifieds'
}: ClassifiedDetailHeaderProps) => {
  const navigate = useNavigate();
  const locationText = `${classified.city || ''}, ${classified.state || ''} ${classified.zipCode}`.replace(/^,\s*/, '').trim();

  const handleBackClick = () => {
    navigate(backUrl);
  };

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
          onClick={handleBackClick}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 text-left">{classified.title}</h1>
          </div>
          <div className="flex flex-col items-end ml-4 gap-2">
            <Badge variant="secondary">{categoryName || 'General'}</Badge>
            {price !== undefined && (
              <div className="text-2xl font-bold text-greenyp-600">
                ${price.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-500 space-x-6 mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
            <span>{locationText}</span>
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
