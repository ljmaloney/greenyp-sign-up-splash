
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const SquareCardFormHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center">
        <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
        Secure Payment
      </CardTitle>
    </CardHeader>
  );
};

export default SquareCardFormHeader;
