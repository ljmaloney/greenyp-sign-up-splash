
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchCategories } from '@/services/categoryService';
import { CategoryWithIcon } from '@/types/category';
import { mockProvidersByCategory } from '@/utils/categoryProviders';
import CategoryHero from '@/components/category/CategoryHero';
import ProvidersList from '@/components/category/ProvidersList';
import CategoryCTA from '@/components/category/CategoryCTA';
import CategoryLoading from '@/components/category/CategoryLoading';
import CategoryNotFound from '@/components/category/CategoryNotFound';
import { useCategoryPageSEO } from '@/hooks/useCategoryPageSEO';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch all categories using the same service as the CategorySection
  const { data: categories, isLoading, error } = useQuery<CategoryWithIcon[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  // Find the specific category based on the slug
  const category = categories?.find(cat => cat.slug === slug);
  
  // Get the providers for this category
  const providers = slug ? mockProvidersByCategory[slug] || [] : [];
  
  // Handle SEO updates
  useCategoryPageSEO(category);
  
  // Render the icon component
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500" />;
  };
  
  if (isLoading) {
    return <CategoryLoading />;
  }
  
  if (error || !category) {
    return <CategoryNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <CategoryHero category={category} renderIcon={renderIcon} />
        <ProvidersList providers={providers} categoryTitle={category.title} />
        <CategoryCTA categoryTitle={category.title} />
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
