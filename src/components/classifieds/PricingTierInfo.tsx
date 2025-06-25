
import React from 'react';
import { PRICING_TIERS } from '@/types/classifieds';

interface PricingTierInfoProps {
  tier: 'basic' | 'standard' | 'premium';
}

const PricingTierInfo = ({ tier }: PricingTierInfoProps) => {
  const selectedPricing = PRICING_TIERS[tier];

  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">{selectedPricing.name} Tier Features</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>• Price: ${selectedPricing.price}/month</li>
        <li>• Maximum Images: {selectedPricing.maxImages}</li>
        <li>• Contact Privacy: {selectedPricing.contactObfuscation ? 'Yes' : 'No'}</li>
        <li>• {selectedPricing.description}</li>
      </ul>
    </div>
  );
};

export default PricingTierInfo;
