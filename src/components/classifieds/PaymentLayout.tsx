
import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import NewPaymentInformationCard from './NewPaymentInformationCard';

interface ClassifiedData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentLayoutProps {
  classified: ClassifiedData;
  customer: CustomerData;
}

const PaymentLayout = ({ classified, customer }: PaymentLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <NewOrderSummaryCard classified={classified} />
        <NewAdPreviewCard classified={classified} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <NewPaymentInformationCard 
          classified={classified}
          customer={customer}
        />
      </div>
    </div>
  );
};

export default PaymentLayout;
