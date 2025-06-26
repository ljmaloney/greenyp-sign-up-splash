
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdSubmitSectionProps {
  price: number;
  onSubmit: () => void;
}

const AdSubmitSection = ({ price, onSubmit }: AdSubmitSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-semibold">Total: ${price}/month</div>
            <div className="text-sm text-gray-600">Ad will run for 30 days</div>
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="bg-greenyp-600 hover:bg-greenyp-700"
            onClick={onSubmit}
          >
            Post Ad - ${price}/month
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSubmitSection;
