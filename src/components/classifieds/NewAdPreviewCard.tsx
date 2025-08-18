
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useClassifiedImages } from '@/hooks/classifieds/useClassifiedImages';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
}

interface NewAdPreviewCardProps {
  classified: ClassifiedData;
}

const NewAdPreviewCard = ({ classified }: NewAdPreviewCardProps) => {
  const { data: images = [], isLoading: imagesLoading } = useClassifiedImages(
    classified.classifiedId,
    !!classified.classifiedId
  );

  const truncatedDescription = classified.description.length > 200 
    ? classified.description.substring(0, 200) + '...'
    : classified.description;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Ad Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-md mx-auto">
          <Card className="hover:shadow-md hover:border-yellow-500 transition-all duration-200 border-2">
            <CardContent className="p-4 space-y-3">
              {/* Title and Price */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex-1 text-left">
                  {classified.title}
                  {classified.price > 0 && (
                    <span className="text-greenyp-600 ml-2">
                      - ${classified.price}
                      {classified.perUnitType && classified.perUnitType !== 'NA' ? ` per ${classified.perUnitType}` : ''}
                    </span>
                  )}
                </h3>
              </div>
              
              {/* Category and Date */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Classified</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1 text-greenyp-600" />
                  {format(new Date(classified.createDate), 'MMM dd')}
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                {classified.city}, {classified.state} {classified.postalCode}
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Images ({images.length})</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.description || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(`Preview image failed to load: ${image.url}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {images.length > 4 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{images.length - 4} more images
                    </p>
                  )}
                </div>
              )}

              {imagesLoading && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Loading images...</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-700 text-sm text-left leading-relaxed">
                {truncatedDescription}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAdPreviewCard;
