
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdPackage } from '@/types/adPackages';

interface AdSubmitCardProps {
  selectedPackage: AdPackage | undefined;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const AdSubmitCard = ({ selectedPackage, isSubmitting, onSubmit }: AdSubmitCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            {selectedPackage && selectedPackage.features.maxImages > 0 ? (
              <span className="text-sm text-gray-600">Step 2 - Upload Images</span>
            ) : (
              <span className="text-sm text-gray-600">Proceed to Payment</span>
            )}
          </div>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-greenyp-600 hover:bg-greenyp-700 px-8"
          >
            {isSubmitting ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSubmitCard;
