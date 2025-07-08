
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PaymentErrorStateProps {
  error: string;
}

const PaymentErrorState = ({ error }: PaymentErrorStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
          <div>
            <p className="font-medium">Square Configuration Required</p>
            <p className="text-sm mt-1">
              {error.includes('credentials') 
                ? 'Please set up your Square Application ID and Location ID in the project configuration to enable payments.'
                : error
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentErrorState;
