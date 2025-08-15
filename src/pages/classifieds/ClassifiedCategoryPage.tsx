import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedsFiltersLive from '@/components/classifieds/ClassifiedsFiltersLive';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import { ClassifiedFilters } from '@/types/classifieds';

const ClassifiedCategoryPage = () => {
    const { urlName } = useParams<{ urlName: string }>();
    const navigate = useNavigate();
    const { data: categoriesData } = useClassifiedCategories();
    
    // Find the current category to display its name
    const currentCategory = categoriesData?.response?.find(cat => cat.urlName === urlName);
    
    // Initialize filters state
    const [filters, setFilters] = useState<ClassifiedFilters>({});
    
    // Update filters when categories data loads and currentCategory is found
    useEffect(() => {
        if (currentCategory?.categoryId) {
            console.log('🎯 Setting selectedCategory:', currentCategory.categoryId, 'for category:', currentCategory.name);
            setFilters(prev => ({
                ...prev,
                selectedCategory: currentCategory.categoryId
            }));
        }
    }, [currentCategory?.categoryId]);
    
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
                                --- {currentCategory?.shortDescription || `Browse classifieds in the ${urlName} category`}
                            </span>
                        </h1>
                    </div>

                    <ClassifiedsFiltersLive filters={filters} onFiltersChange={setFilters} />

                    <ClassifiedsList filters={filters} categoryName={currentCategory?.name} />
                </div>
            </main>
            <ClassifiedsFooter />
        </div>
    );
};

export default ClassifiedCategoryPage;