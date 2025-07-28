
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, AlertTriangle } from 'lucide-react';
import { useAccountData } from '@/hooks/useAccountData';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';
import { useReactSquarePaymentDialog } from '@/hooks/useReactSquarePaymentDialog';
import UpdatePaymentMethodDialog from './UpdatePaymentMethodDialog';

const PaymentMethodCard = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;
  
  // Prevent queries if we don't have a producerId
  const enabled = !!producerId && producerId !== '';
  
  // Only run the query if we have a valid producerId to prevent 404 retry loops
  const { data: paymentMethod, isLoading, error } = usePaymentMethod(
    enabled ? producerId || '' : ''
  );
  const { isDialogOpen, openDialog, closeDialog } = useReactSquarePaymentDialog();
  
  // Log producerId availability for debugging
  console.log('PaymentMethodCard - producerId:', producerId || 'NOT_AVAILABLE');
  
  // Only open dialog if we have a valid producer ID
  const handleOpenDialog = () => {
    if (!producerId) {
      console.error('Cannot open payment dialog: Missing producerId');
      return;
    }
    console.log('Opening payment dialog with producerId:', producerId);
    openDialog();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasPaymentMethod = paymentMethod && !error;
  const lastFourDigits = paymentMethod?.lastFourDigits || paymentMethod?.last4 || '****';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPaymentMethod ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">Payment Method Active</div>
                  <div className="text-sm text-green-600">
                    Card ending in {lastFourDigits}
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              
              <Button onClick={handleOpenDialog} variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-800">No Payment Method</div>
                  <div className="text-sm text-amber-600">
                    Add a payment method to enable automatic billing
                  </div>
                </div>
              </div>
              
              <Button onClick={handleOpenDialog} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdatePaymentMethodDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        producerId={producerId || ''}
      />
    </>
  );
};

export default PaymentMethodCard;
