
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
        <p className="text-xl text-gray-700 max-w-3xl text-left">{category.shortDescription}</p>
        <div className="mt-6 p-6 bg-white rounded-lg border border-greenyp-200">
        {category.description && (

            <p className="text-gray-700 text-left">{category.description}</p>

        )}
        {/* Services with green checkmarks */}
        <br/><br/>
        {services && services.length > 0 && !servicesLoading && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-left">Available Services:</h3>
              <ul className="space-y-1 text-gray-700">
                {services.map((service) => (
                    <li key={service.lobServiceId} className="text-sm flex items-start text-left">
                      <Check className="w-4 h-4 text-greenyp-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                            <span className="font-medium">{service.serviceName}</span> - {service.serviceDescription}
                          </span>
                    </li>
                ))}
              </ul>
            </div>
        )}

        {servicesLoading && (
            <div className="text-sm text-gray-600 text-left">Loading services...</div>
        )}

        {servicesError && (
            <div className="text-sm text-red-600 text-left">Error loading services. Please try again later.</div>
        )}
      </div>
      </div>
    </section>
  );
};

export default CategoryHeroSection;
