
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

interface SquareCardFormActionsProps {
  onTokenizeCard: () => void;
  cardInitialized: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

const SquareCardFormActions = ({ 
  onTokenizeCard, 
  cardInitialized, 
  isLoading, 
  isProcessing, 
  error 
}: SquareCardFormActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="pt-4">
        <Button 
          onClick={onTokenizeCard}
          disabled={!cardInitialized || isLoading || isProcessing || !!error}
          className="w-full bg-greenyp-600 hover:bg-greenyp-700"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Validate Payment Information'}
        </Button>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-500">
        <Lock className="w-3 h-3 mr-1" />
        Secured by Square - PCI DSS Compliant
      </div>
    </div>
  );
};

export default SquareCardFormActions;
