
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package } from 'lucide-react';
import { Classified } from '@/types/classifieds';
import { AdPackage } from '@/types/adPackages';

interface ClassifiedPaymentSummaryProps {
  classified: Classified;
  adPackage: AdPackage;
}

const ClassifiedPaymentSummary = ({ classified, adPackage }: ClassifiedPaymentSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Selected Package
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{adPackage.adTypeName}</h3>
            <Badge variant="secondary" className="mt-1">
              {adPackage.defaultPackage ? 'Most Popular' : 'Premium Choice'}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-greenyp-600">
              ${adPackage.monthlyPrice}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Package Features:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {adPackage.features.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-greenyp-600 mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xl font-bold">{adPackage.monthlyPrice}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedPaymentSummary;
