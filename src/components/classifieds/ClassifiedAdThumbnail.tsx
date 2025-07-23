
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MapPin } from 'lucide-react';
import { Classified } from '@/types/classifieds';

interface ClassifiedAdThumbnailProps {
  classified: Classified;
}

const ClassifiedAdThumbnail = ({ classified }: ClassifiedAdThumbnailProps) => {
  const locationText = `${classified.city || ''}, ${classified.state || ''} ${classified.zipCode}`.replace(/^,\s*/, '').trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Classified Ad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{classified.title}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{classified.description}</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{locationText}</span>
        </div>
        
        {classified.price && (
          <div className="border-t pt-3">
            <div className="text-lg font-semibold text-greenyp-600">
              ${classified.price} {classified.perUnitType && `per ${classified.perUnitType}`}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          This ad will be published once payment is completed.
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedAdThumbnail;
