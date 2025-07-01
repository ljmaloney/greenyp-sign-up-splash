
import React, { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

const CategoryDescriptions = () => {
  const { data: categoriesData, isLoading, error } = useClassifiedCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-8">Loading categories...</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-8 text-red-600">
              Error loading categories. Please try again later.
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  const categories = categoriesData?.response?.filter(cat => cat.active) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to="/classifieds">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classifieds
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Descriptions</h1>
            <p className="text-gray-600">
              Browse our classified categories to find the perfect place for your ad
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.categoryId} className="border-greenyp-200">
                <CardHeader>
                  <CardTitle className="text-xl text-greenyp-700">{category.name}</CardTitle>
                  <p className="text-gray-600">{category.shortDescription}</p>
                </CardHeader>
                {category.description && (
                  <CardContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category.categoryId)}
                      className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto"
                    >
                      {expandedCategories.has(category.categoryId) ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                    {expandedCategories.has(category.categoryId) && (
                      <div className="mt-3 text-gray-700">
                        {category.description}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default CategoryDescriptions;
