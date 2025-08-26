
import React from 'react';

interface BillingToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  onBillingChange: (period: 'monthly' | 'yearly') => void;
}

const BillingToggle = ({ billingPeriod, onBillingChange }: BillingToggleProps) => {
  return (
    <div className="inline-flex p-1 rounded-lg bg-gray-100 mb-8">
      <button
        className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
          billingPeriod === 'monthly' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-700 hover:text-gray-900'
        }`}
        onClick={() => onBillingChange('monthly')}
      >
        Monthly
      </button>
      <button
        className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
          billingPeriod === 'yearly' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-700 hover:text-gray-900'
        }`}
        onClick={() => onBillingChange('yearly')}
      >
          Yearly
        {/*Yearly <span className="text-xs text-greenyp-600 font-normal ml-1">Save up to 20%</span>*/}
      </button>
    </div>
  );
};

export default BillingToggle;
