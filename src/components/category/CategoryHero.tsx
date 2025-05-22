
import React from 'react';
import { Button } from "@/components/ui/button";
import { CategoryWithIcon } from '@/types/category';

interface CategoryHeroProps {
  category: CategoryWithIcon;
  renderIcon: (category: CategoryWithIcon) => React.ReactNode;
}

const CategoryHero = ({ category, renderIcon }: CategoryHeroProps) => {
  return (
    <section className="bg-greenyp-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-4">
          {renderIcon(category)}
          <h1 className="text-3xl md:text-4xl font-bold ml-2 text-gray-900">{category.title}</h1>
        </div>
        <p className="text-xl text-gray-700 max-w-3xl">{category.description}</p>
        
        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
            Find by Location
          </Button>
          <Button variant="outline" className="border-greenyp-500 text-greenyp-700">
            Filter Results
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
