
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye } from 'lucide-react';
import { Classified } from '@/types/classifieds';

interface ClassifiedAdThumbnailProps {
  classified: Classified;
}

const ClassifiedAdThumbnail = ({ classified }: ClassifiedAdThumbnailProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Ad Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classified.images && classified.images.length > 0 && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={classified.images[0]}
                alt={classified.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{classified.title}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{classified.city}, {classified.state}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{classified.category}</Badge>
            </div>
            
            <p className="text-sm text-gray-700 line-clamp-3">
              {classified.description}
            </p>
            
            {classified.price && (
              <div className="text-xl font-bold text-greenyp-600">
                ${classified.price}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedAdThumbnail;
