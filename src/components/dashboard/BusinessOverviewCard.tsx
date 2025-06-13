
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Producer } from '@/services/accountService';

interface BusinessOverviewCardProps {
  producer: Producer;
}

const BusinessOverviewCard = ({ producer }: BusinessOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{producer.businessName}</CardTitle>
            <p className="text-gray-600 mt-2">{producer.narrative}</p>
          </div>
          <Badge variant={producer.subscriptionType === 'LIVE_UNPAID' ? 'destructive' : 'default'}>
            {producer.subscriptionType.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

export default BusinessOverviewCard;
