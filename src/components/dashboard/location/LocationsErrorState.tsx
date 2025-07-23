
import React from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';

interface LocationsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const LocationsErrorState = ({ error, onRetry }: LocationsErrorStateProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-greenyp-600">Locations</h1>
      </div>
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">Error loading locations: {error.message}</p>
          <Button onClick={onRetry} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsErrorState;
