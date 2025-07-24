
import React from 'react';
import { useCategories } from './providers/CategoriesProvider';

const CategorySection = () => {
  const { categories } = useCategories();

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 mt-2">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
