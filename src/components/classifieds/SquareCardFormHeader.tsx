
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Copy } from 'lucide-react';

interface SquareCardFormHeaderProps {
  onCopyFromClassified?: () => void;
  classifiedData?: any;
}

const SquareCardFormHeader = ({ onCopyFromClassified, classifiedData }: SquareCardFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
          Secure Payment
        </div>
        {onCopyFromClassified && classifiedData && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyFromClassified}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Ad
          </Button>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default SquareCardFormHeader;
