import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import { ClassifiedFilters } from '@/types/classifieds';

const ClassifiedCategoryPage = () => {
    const { urlName } = useParams<{ urlName: string }>();
    const { data: categoriesData } = useClassifiedCategories();
    
    // Find the current category to display its name
    const currentCategory = categoriesData?.response?.find(cat => cat.urlName === urlName);
    
    // Initialize filters state
    const [filters, setFilters] = useState<ClassifiedFilters>({});
    // Simple setup: just set the category ID for the page
    useEffect(() => {
        if (currentCategory?.categoryId && currentCategory?.name) {
            console.log('🎯 Setting category for page:', urlName, 'categoryName:', currentCategory.name);
            setFilters({
                selectedCategory: currentCategory.categoryId,
                category: currentCategory.name // This will preselect the dropdown
                // Leave zipCode, keyword, maxMiles undefined to trigger mostRecent API
            });
            console.log('🎯 Filters set with category:', currentCategory.name);
        }
    }, [currentCategory?.categoryId, currentCategory?.name, urlName]);
    
    console.log('🎯 Category page loaded - urlName:', urlName, 'categoryId:', currentCategory?.categoryId);
    console.log('🎯 Filters state:', filters);
    console.log('🎯 selectedCategory value:', filters.selectedCategory);
    return (
        <div className="min-h-screen flex flex-col">
            <ClassifiedsHeader />
            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {currentCategory?.name || 'Category'}
                            <span className="text-gray-600 text-base font-normal ml-2">
                                - {currentCategory?.shortDescription || `Browse classifieds in the ${urlName} category`}
                            </span>
                        </h1>
                    </div>

                    <ClassifiedsList filters={filters} categoryName={urlName} />
                </div>
            </main>
            <ClassifiedsFooter />
        </div>
    );
};

export default ClassifiedCategoryPage;