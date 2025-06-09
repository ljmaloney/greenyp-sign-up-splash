
import React from 'react';
import { Check } from 'lucide-react';
import { CategoryWithIcon, CategoryService } from '@/types/category';

interface CategoryHeroSectionProps {
  category: CategoryWithIcon;
  services: CategoryService[] | undefined;
  servicesLoading: boolean;
  servicesError: Error | null;
}

const CategoryHeroSection = ({ category, services, servicesLoading, servicesError }: CategoryHeroSectionProps) => {
  // Render the icon component
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500" />;
  };

  return (
    <section className="bg-greenyp-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-4">
          {renderIcon(category)}
          <h1 className="text-3xl md:text-4xl font-bold ml-2 text-gray-900">{category.lineOfBusinessName}</h1>
        </div>
        <p className="text-xl text-gray-700 max-w-3xl">{category.shortDescription}</p>
        
        {category.description && (
          <div className="mt-6 p-6 bg-white rounded-lg border border-greenyp-200">
            <p className="text-gray-700">{category.description}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryHeroSection;
