import React from 'react';
import { Check, MapPin, TreeDeciduous, Settings, Calendar } from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

const features = [
  {
    title: "Enhanced Business Visibility",
    description: "Stand out in the competitive green industry market with premium listings that highlight your landscaping and lawn care services.",
    icon: (
      <MapPin className="w-10 h-10 text-greenyp-500" />
    ),
    items: [
      { text: "Featured in search results", color: "text-greenyp-500" },
      { text: "Enhanced business profile", color: "text-greenyp-500" }
    ]
  },
  {
    title: "Industry-Specific Categories",
    description: "Connect with customers looking for landscaping, lawn care, hardscaping, nurseries, plant suppliers, pond maintenance, and more.",
    icon: (
      <TreeDeciduous className="w-10 h-10 text-greenyp-500" />
    ),
    items: [
      { text: "Custom service categorization", color: "text-greenyp-500" },
      { text: "Multiple service listings", color: "text-greenyp-500" }
    ]
  },
  {
    title: "Business Dashboard",
    description: "Easily manage your business details to keep your listing up to date and appealing to potential customers. Access to features may vary based on your subscription tier.",
    icon: (
      <Settings className="w-10 h-10 text-greenyp-500" />
    ),
    items: [
      { text: "Update business address and contact details", color: "text-greenyp-500" },
      { text: "Make changes to your business profile", color: "text-greenyp-500" },
      { text: "List products and services including prices - Featured Listing", color: "text-yellow-500" },
      { text: "Upload business logo and images - Featured Listing", color: "text-yellow-500" }
    ]
  },
  {
    title: "Future Business Tools",
    description: "This section will grow with your needs—future enhancements will unlock tools tailored to your line of business and subscription tier, helping you maximize your visibility.",
    icon: (
      <Calendar className="w-10 h-10 text-greenyp-500" />
    ),
    items: [
      { text: "Advanced analytics", color: "text-greenyp-500" },
      { text: "Customer management tools", color: "text-greenyp-500" }
    ]
  }
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
            {feature.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-center">
                <Check className={`h-5 w-5 ${item.color} mr-2`} />
                <span className="text-sm text-gray-600">
                  {item.text}
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
            Grow Your Business with GreenYP
          </h2>
          <p className="text-xl text-gray-700">
            The premier directory connecting customers with green industry professionals like you.
              Our platform offers a wide range of services and tools to help you stand out in the market.
          </p>
        </div>

        <FeatureList />

        {/* Link after Features Section */}
        <section className="py-12 bg-greenyp-50">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                Ready to Grow Your Business?
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Start connecting with customers today. Create your business listing and join the leading directory for green industry professionals.
              </p>
              <Button asChild size="lg" className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-10 py-4 text-lg">
                <Link to="/subscribers/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
};

export default FeaturesSection;