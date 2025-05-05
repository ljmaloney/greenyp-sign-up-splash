
import React from 'react';
import { Check, MapPin, Leaf, TreeDeciduous } from 'lucide-react';

const features = [
  {
    title: "Enhanced Business Visibility",
    description: "Stand out in the competitive green industry with premium listings that highlight your sustainable landscaping services.",
    icon: (
      <MapPin className="w-10 h-10 text-greenyp-500" />
    ),
  },
  {
    title: "Specialized Categories",
    description: "Reach customers looking specifically for lawn care, nurseries, landscaping, garden supplies, or sustainable plant options.",
    icon: (
      <TreeDeciduous className="w-10 h-10 text-greenyp-500" />
    ),
  },
  {
    title: "Customer Reviews & Ratings",
    description: "Build your reputation with verified customer reviews and showcase your quality service to potential clients.",
    icon: (
      <svg className="w-10 h-10 text-greenyp-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Eco-Certification Badges",
    description: "Showcase your green credentials with special badges for organic, sustainable, and eco-friendly business practices.",
    icon: (
      <Leaf className="w-10 h-10 text-greenyp-500" />
    ),
  },
];

const FeatureList = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="flex flex-col p-6 bg-white border border-greenyp-100 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-greenyp-200"
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
          
          <ul className="mt-4 space-y-2">
            {index === 0 && (
              <>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Featured in search results
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Enhanced business profile
                  </span>
                </li>
              </>
            )}
            
            {index === 1 && (
              <>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Custom category tagging
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Multiple service listings
                  </span>
                </li>
              </>
            )}
            
            {index === 2 && (
              <>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Review management tools
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Response capabilities
                  </span>
                </li>
              </>
            )}
            
            {index === 3 && (
              <>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Verified eco-credentials
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Sustainability highlights
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Grow Your Green Business with GreenYP
          </h2>
          <p className="text-xl text-gray-700">
            The premier directory connecting eco-conscious customers with lawn care, landscaping, and plant businesses.
          </p>
        </div>
        
        <FeatureList />
      </div>
    </section>
  );
};

export default FeaturesSection;
