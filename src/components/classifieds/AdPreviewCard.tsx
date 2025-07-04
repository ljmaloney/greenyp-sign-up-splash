
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useClassifiedImages } from '@/hooks/useClassifiedImages';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

interface AdPreviewCardProps {
  classifiedId: string;
  classifiedData: any;
  packageData: any;
}

const AdPreviewCard = ({ classifiedId, classifiedData, packageData }: AdPreviewCardProps) => {
  // Fetch categories to get the category name
  const { data: categoriesResponse } = useClassifiedCategories();
  const categories = categoriesResponse?.response || [];
  
  // Find the category name based on categoryId
  const categoryName = useMemo(() => {
    if (!classifiedData?.categoryId || !categories.length) return 'Category';
    const category = categories.find(cat => cat.categoryId === classifiedData.categoryId);
    return category?.name || 'Category';
  }, [classifiedData?.categoryId, categories]);

  // Fetch images if the package supports them
  const shouldFetchImages = packageData?.features?.maxImages > 0;
  const { data: images = [] } = useClassifiedImages(
    classifiedId || '', 
    shouldFetchImages
  );

  // Select a random image to display
  const randomImage = useMemo(() => {
    if (!images || images.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [images]);

  // Truncate description to 200 characters
  const truncatedDescription = useMemo(() => {
    if (!classifiedData?.description) return '';
    if (classifiedData.description.length <= 200) return classifiedData.description;
    return classifiedData.description.substring(0, 200) + '...';
  }, [classifiedData?.description]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Ad Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-md mx-auto">
          <Card className="hover:shadow-md hover:border-yellow-500 transition-all duration-200 border-2">
            <CardContent className="p-4 space-y-3">
              {/* Title and Price - Left justified */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex-1 text-left">
                  {classifiedData?.title}
                  {classifiedData?.price > 0 && (
                    <span className="text-greenyp-600 ml-2">
                      - ${classifiedData.price}
                      {classifiedData.pricePerUnitType && classifiedData.pricePerUnitType !== 'NA' ? ` per ${classifiedData.pricePerUnitType}` : ''}
                    </span>
                  )}
                </h3>
              </div>
              
              {/* Category and Date */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{categoryName}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1 text-greenyp-600" />
                  {format(new Date(), 'MMM dd')}
                </div>
              </div>
              
              {/* Location - Left justified */}
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                {classifiedData?.city}, {classifiedData?.state} {classifiedData?.postalCode}
              </div>

              {/* Random Image - if package supports images */}
              {packageData?.features?.maxImages > 0 && randomImage && (
                <div className="relative h-48 w-full mt-3">
                  <img 
                    src={randomImage.url} 
                    alt={randomImage.description || classifiedData?.title || 'Ad image'}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Failed to load image:', randomImage.url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Truncated Description */}
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

export default AdPreviewCard;
