
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const UpgradeEmptyState = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-8">
        <p className="text-gray-600">
          You're already on our highest available plan! Thank you for being a valued subscriber.
        </p>
      </CardContent>
    </Card>
  );
};

export default UpgradeEmptyState;
