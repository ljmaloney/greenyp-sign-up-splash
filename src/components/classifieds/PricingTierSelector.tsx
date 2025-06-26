
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { PRICING_TIERS } from '@/types/classifieds';

interface PricingTierSelectorProps {
  selectedTier: 'basic' | 'standard' | 'premium';
  onTierChange: (tier: 'basic' | 'standard' | 'premium') => void;
}

const PricingTierSelector = ({ selectedTier, onTierChange }: PricingTierSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Ad Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              onClick={() => onTierChange(key as 'basic' | 'standard' | 'premium')}
              className={`h-full p-4 flex flex-col items-start text-left space-y-2 ${
                selectedTier === key 
                  ? 'bg-gray-100 border-yellow-500 border-2' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg">{tier.name}</div>
              <div className="text-2xl font-bold text-greenyp-600">${tier.price}/month</div>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="bg-green-100 rounded-full p-1 mr-2 flex-shrink-0">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </span>
                {tier.description}
              </div>
              
              {tier.contactObfuscation && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-green-100 rounded-full p-1 mr-2 flex-shrink-0">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </span>
                  Contact Privacy
                </div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingTierSelector;
