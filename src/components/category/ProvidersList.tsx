
import React from 'react';
import ProviderCard, { Provider } from './ProviderCard';

interface ProvidersListProps {
  providers: Provider[];
  categoryTitle: string;
}

const ProvidersList = ({ providers, categoryTitle }: ProvidersListProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Top {categoryTitle} Providers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <ProviderCard key={index} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvidersList;
