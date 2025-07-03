
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { AdPackage } from '@/types/adPackages';

interface AdPackageSelectorProps {
  adPackages: AdPackage[];
  selectedAdType: string;
  onAdTypeChange: (adType: string) => void;
}

const AdPackageSelector = ({ adPackages, selectedAdType, onAdTypeChange }: AdPackageSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Ad Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adPackages.map((pkg) => (
            <div
              key={pkg.adTypeId}
              onClick={() => onAdTypeChange(pkg.adTypeId)}
              className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                selectedAdType === pkg.adTypeId 
                  ? 'bg-yellow-50 border-yellow-500 border-2' 
                  : 'border-greenyp-500 hover:bg-greenyp-50'
              }`}
            >
              <div className="font-semibold text-lg mb-2">{pkg.adTypeName}</div>
              <div className="text-2xl font-bold text-greenyp-600 mb-4">${pkg.monthlyPrice}/month</div>
              <div className="space-y-2">
                {pkg.features.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPackageSelector;
