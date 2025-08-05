
import React from 'react';
import { Globe, Building, CreditCard, Calendar, Hash } from 'lucide-react';
import { Producer } from '@/services/accountService';

interface BusinessDetailsProps {
  producer: Producer;
  lineOfBusinessName: string;
}

const BusinessDetails = ({ producer, lineOfBusinessName }: BusinessDetailsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInvoiceCycleTypeDisplay = (invoiceCycleType: string) => {
    if (!invoiceCycleType || producer.subscriptionType === '-') {
      return '-';
    }
    
    switch (invoiceCycleType) {
      case 'MONTHLY':
        return 'Recurring Monthly';
      case 'QUARTERLY':
        return 'Recurring Quarterly';
      case 'ANNUAL':
        return 'Recurring Annual';
      case 'NONRECURRING_ANNUAL':
        return 'Non-recurring Annual';
      default:
        return invoiceCycleType;
    }
  };

  const formatBillingDate = (dateString: string) => {
    if (!dateString || producer.subscriptionType === '-') {
      return '-';
    }
    return formatDate(dateString);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Website:</span>
          <span className="text-gray-900">
            {producer.websiteUrl || 'Not provided'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Line of Business:</span>
          <span className="text-gray-900">
            {lineOfBusinessName}
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Hash className="h-4 w-4 text-gray-500 mt-0.5" />
          <span className="text-gray-600">Keywords:</span>
          <span className="text-gray-900">
            {producer.keywords || ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Invoice Cycle:</span>
          <span className="text-gray-900">
            {getInvoiceCycleTypeDisplay(producer.invoiceCycleType || '')}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Profile Created:</span>
          <span className="text-gray-900">
            {formatDate(producer.createDate)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Last Updated:</span>
          <span className="text-gray-900">
            {formatDate(producer.lastUpdateDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Last Bill Date:</span>
          <span className="text-gray-900">
            {formatBillingDate(producer.lastBillDate || '')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Last Bill Paid:</span>
          <span className="text-gray-900">
            {formatBillingDate(producer.lastBillPaidDate || '')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
