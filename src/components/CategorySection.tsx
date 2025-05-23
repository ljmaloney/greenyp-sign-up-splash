
import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';

const CategorySection = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithIcon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openCategoryDetails = (category: CategoryWithIcon) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
    
    // Update the URL without page refresh for SEO benefits
    window.history.pushState(
      {}, 
      category.title, 
      `#category/${category.slug}`
    );
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    // Remove the hash from URL when closing
    window.history.pushState({}, '', window.location.pathname);
  };

  if (isLoading) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Supported Industry Categories
            </h2>
            <p className="text-xl text-gray-700">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center transition-all border border-greenyp-100 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Supported Industry Categories
            </h2>
            <p className="text-xl text-red-600">
              Error loading categories. Please try again later.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-greenyp-600 hover:bg-greenyp-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Supported Industry Categories
          </h2>
          <p className="text-xl text-gray-700">
            Find qualified green industry professionals in your area by category
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories?.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100"
            >
              {category.iconComponent}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
              <button 
                onClick={() => openCategoryDetails(category)}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Find ${category.title} Providers`}
              >
                Find Providers
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedCategory?.iconComponent && 
                React.cloneElement(selectedCategory.iconComponent as React.ReactElement, { className: "w-6 h-6" })}
              {selectedCategory?.title}
            </DialogTitle>
            <DialogDescription className="text-base">{selectedCategory?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <p className="text-gray-700 mb-6">{selectedCategory?.details}</p>
            
            <h4 className="font-semibold text-lg mb-3">Top Providers</h4>
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Green Thumb Experts</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (48 reviews)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Nature's Best</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐ (36 reviews)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium">Leaf & Lawn Professional</div>
                <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (29 reviews)</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                onClick={closeDialog}
                variant="outline"
                className="border-gray-300"
              >
                Close
              </Button>
              <Button 
                className="bg-greenyp-600 hover:bg-greenyp-700 text-white"
                onClick={() => {
                  window.location.href = `/categories/${selectedCategory?.slug}`;
                }}
              >
                View All Providers
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CategorySection;
