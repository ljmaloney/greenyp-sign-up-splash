
import React from 'react';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const UpgradeLoadingState = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading subscription plans...</span>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpgradeLoadingState;
