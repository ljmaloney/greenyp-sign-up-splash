
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

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return `${url.substring(0, maxLength)}...`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Website:</span>
          <div className="text-gray-900">
            {producer.websiteUrl ? (
              <a
                href={producer.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-greenyp-600 hover:text-greenyp-700 underline"
                title={producer.websiteUrl}
              >
                {truncateUrl(producer.websiteUrl)}
              </a>
            ) : (
              <span className="text-gray-400 italic">Not provided</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Building className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Line of Business:</span>
          <span className="text-gray-900">
            {lineOfBusinessName}
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Hash className="h-4 w-4 text-greenyp-600 mt-0.5" />
          <span className="text-gray-600 font-semibold">Keywords:</span>
          <span className="text-gray-900">
            {producer.keywords || ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Invoice Cycle:</span>
          <span className="text-gray-900">
            {getInvoiceCycleTypeDisplay(producer.invoiceCycleType || '')}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Profile Created:</span>
          <span className="text-gray-900">
            {formatDate(producer.createDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Last Updated:</span>
          <span className="text-gray-900">
            {formatDate(producer.lastUpdateDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Last Bill Date:</span>
          <span className="text-gray-900">
            {formatBillingDate(producer.lastBillDate || '')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-greenyp-600" />
          <span className="text-gray-600 font-semibold">Last Bill Paid:</span>
          <span className="text-gray-900">
            {formatBillingDate(producer.lastBillPaidDate || '')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
