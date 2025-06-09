
import React from 'react';
import { CategoryService } from '@/types/category';

interface CategoryServicesSectionProps {
  services: CategoryService[] | undefined;
  servicesLoading: boolean;
  servicesError: Error | null;
}

const CategoryServicesSection = ({ services, servicesLoading, servicesError }: CategoryServicesSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Services</h2>
        {servicesLoading ? (
          <div className="text-center">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">{service.serviceName}</h3>
                <p className="text-gray-600 text-sm">{service.serviceDescription}</p>
              </div>
            ))}
          </div>
        )}
        {servicesError && (
          <div className="text-center text-red-600">Error loading services. Please try again later.</div>
        )}
      </div>
    </section>
  );
};

export default CategoryServicesSection;
