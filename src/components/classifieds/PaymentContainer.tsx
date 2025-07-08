
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import OrderSummaryCard from './OrderSummaryCard';
import AdPreviewCard from './AdPreviewCard';
import PaymentForm from './PaymentForm';

const PaymentContainer = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

  const handlePaymentSuccess = (classifiedId: string) => {
    navigate('/classifieds', { 
      state: { 
        paymentSuccess: true,
        classifiedId: classifiedId 
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Order Summary and Ad Preview */}
      <div className="space-y-6">
        <OrderSummaryCard packageData={packageData} />
        <AdPreviewCard 
          classifiedId={classifiedId || ''} 
          classifiedData={classifiedData} 
          packageData={packageData} 
        />
      </div>

      {/* Right Column - Payment Form */}
      <div className="space-y-6">
        <PaymentForm
          classifiedId={classifiedId || ''}
          classifiedData={classifiedData}
          packageData={packageData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default PaymentContainer;
