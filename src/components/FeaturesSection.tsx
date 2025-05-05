
import React from 'react';
import { Check } from 'lucide-react';

const features = [
  {
    title: "Streamlined Subscription Management",
    description: "Easily manage all your GreenYP listings, featured placements, and analytics from one simple dashboard.",
    icon: (
      <svg className="w-10 h-10 text-greenyp-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Enhanced Business Visibility",
    description: "Reach eco-conscious customers actively searching for sustainable businesses like yours.",
    icon: (
      <svg className="w-10 h-10 text-greenyp-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 10L12 7L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Detailed Analytics & Reporting",
    description: "Gain insights into how customers interact with your listing and measure your ROI with comprehensive reports.",
    icon: (
      <svg className="w-10 h-10 text-greenyp-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21H4C3.44772 21 3 20.5523 3 20V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 14L11 10L15 14L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Automated Renewal Notifications",
    description: "Never miss a renewal with timely notifications and easy subscription management tools.",
    icon: (
      <svg className="w-10 h-10 text-greenyp-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      </svg>
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
            {[1, 2].map((item) => (
              <li key={item} className="flex items-center">
                <Check className="h-5 w-5 text-greenyp-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Feature benefit {item}
                </span>
              </li>
            ))}
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
            Everything You Need to Grow Your Green Business
          </h2>
          <p className="text-xl text-gray-700">
            Our subscription management portal gives you all the tools to maximize your presence in the sustainable business directory.
          </p>
        </div>
        
        <FeatureList />
      </div>
    </section>
  );
};

export default FeaturesSection;
