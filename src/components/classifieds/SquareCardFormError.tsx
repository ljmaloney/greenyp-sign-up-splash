
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SquareCardFormErrorProps {
  error: string;
}

const SquareCardFormError = ({ error }: SquareCardFormErrorProps) => {
  return (
    <div className="flex items-center p-4 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
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
  );
};

export default SquareCardFormError;
