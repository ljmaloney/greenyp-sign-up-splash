
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Check } from 'lucide-react';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

const CategoryDescriptionsDialog = () => {
  const { data: categoriesData, isLoading, error } = useClassifiedCategories();

  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto">
          <Info className="w-4 h-4 mr-1" />
          View descriptions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-greenyp-700">Category Descriptions</DialogTitle>
          <DialogDescription>
            Browse through all available classified categories and their descriptions to help you choose the right category for your ad.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-600">Loading categories...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            Error loading categories. Please try again later.
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {sortedCategories.map((category) => (
              <div key={category.categoryId} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-greenyp-700">{category.name}</span>
                  <span className="text-gray-600"> - {category.shortDescription}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDescriptionsDialog;
