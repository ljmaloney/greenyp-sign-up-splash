
import React from 'react';
import { TreeDeciduous, Shrub, LeafyGreen, Tractor, Shovel, WateringCan } from 'lucide-react';

// Define the categories with icons, titles, and descriptions
const categories = [
  {
    title: "Landscaping",
    description: "Professional landscape design and installation services",
    icon: <Tractor className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
  {
    title: "Lawn Care",
    description: "Regular maintenance, mowing, and lawn treatment specialists",
    icon: <LeafyGreen className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
  {
    title: "Hardscaping",
    description: "Patios, walkways, retaining walls, and outdoor structures",
    icon: <Shovel className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
  {
    title: "Nurseries",
    description: "Plant nurseries offering trees, shrubs, and garden plants",
    icon: <TreeDeciduous className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
  {
    title: "Plant Suppliers",
    description: "Seeds, bulbs, and specialty plant retailers",
    icon: <Shrub className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
  {
    title: "Pond & Water Features",
    description: "Installation and maintenance of ponds, fountains, and irrigation",
    icon: <WateringCan className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />,
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Browse Industry Categories
          </h2>
          <p className="text-xl text-gray-700">
            Find qualified green industry professionals in your area by category
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100"
            >
              {category.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
              <button className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium">
                Find Providers
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
