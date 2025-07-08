
import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import NewPaymentInformationCard from './NewPaymentInformationCard';
import SquarePaymentCard from './SquarePaymentCard';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
  adTypeId: string;
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
  const [billingInfo, setBillingInfo] = React.useState({
    contact: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: customer?.phoneNumber || ''
    },
    address: {
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    }
  });

  const handlePaymentProcessed = (result: any) => {
    console.log('Payment processed successfully:', result);
    // Handle successful payment here
  };

  const handleBillingInfoUpdate = React.useCallback((contact: any, address: any) => {
    setBillingInfo({ contact, address });
  }, []);

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
          onBillingInfoChange={handleBillingInfoUpdate}
        />
        <SquarePaymentCard
          billingContact={billingInfo.contact}
          billingAddress={billingInfo.address}
          onPaymentProcessed={handlePaymentProcessed}
        />
      </div>
    </div>
  );
};

export default PaymentLayout;
