
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export interface PlanProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
  onSelect: () => void;
}

const SubscriptionPlan = ({ 
  name,
  price,
  period,
  features,
  cta,
  popular,
  onSelect
}: PlanProps) => {
  return (
    <div 
      className={`relative rounded-lg border ${popular ? 'border-greenyp-500 shadow-lg' : 'border-gray-200'} p-6 flex flex-col`}
    >
      {popular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-greenyp-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500 ml-1">{period}</span>
      </div>
      <ul className="mb-6 flex-grow space-y-3">
        {features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start">
            <span className="bg-greenyp-100 rounded-full p-1 mr-2 flex-shrink-0">
              <CheckIcon className="h-4 w-4 text-greenyp-600" />
            </span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${popular ? 'bg-greenyp-600 hover:bg-greenyp-700 text-white' : 'bg-white border border-greenyp-600 text-greenyp-700 hover:bg-greenyp-50'}`}
        onClick={onSelect}
      >
        {cta}
      </Button>
    </div>
  );
};

export default SubscriptionPlan;
