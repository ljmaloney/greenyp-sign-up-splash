
import React from 'react';
import { BarChart } from 'lucide-react';

const AnalyticsPageHeader = () => {
  return (
    <div className="flex items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track subscriber growth and revenue metrics
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
