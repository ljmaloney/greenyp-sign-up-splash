
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Edit } from 'lucide-react';

const Payment = () => {
  // Mock payment info
  const paymentInfo = {
    cardType: 'Visa',
    lastFour: '4242',
    expiryDate: '12/25',
    billingAddress: '123 Garden Street, San Francisco, CA 94102'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-greenyp-600" />
                  Payment Method
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Card Type</p>
                <p className="font-medium">{paymentInfo.cardType} ending in {paymentInfo.lastFour}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium">{paymentInfo.expiryDate}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{paymentInfo.billingAddress}</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Edit className="w-4 h-4 mr-2" />
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Basic Listing - Monthly</p>
                  <p className="text-sm text-gray-600">January 1, 2025</p>
                </div>
                <p className="font-medium">$5.00</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Basic Listing - Monthly</p>
                  <p className="text-sm text-gray-600">December 1, 2024</p>
                </div>
                <p className="font-medium">$5.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
