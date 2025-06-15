
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountData } from '@/hooks/useAccountData';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BusinessOverviewCard from '@/components/dashboard/BusinessOverviewCard';
import ActiveSubscriptionsCard from '@/components/dashboard/ActiveSubscriptionsCard';
import DashboardContactsCard from '@/components/dashboard/DashboardContactsCard';
import PrimaryLocationCard from '@/components/dashboard/PrimaryLocationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DashboardIndex = () => {
  const { user } = useAuth();
  const { data: accountData, isLoading, error } = useAccountData(user?.externalUserRef || null);

  console.log('Dashboard Index - User:', user);
  console.log('Dashboard Index - Account Data:', accountData);
  console.log('Dashboard Index - Loading:', isLoading);
  console.log('Dashboard Index - Error:', error);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading dashboard...</span>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Error loading dashboard data</p>
              <p className="text-sm text-gray-600">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!accountData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No account data available</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BusinessOverviewCard producer={accountData.producer} />
          <ActiveSubscriptionsCard subscriptions={accountData.producer.subscriptions} />
          <DashboardContactsCard contacts={accountData.contacts} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <PrimaryLocationCard primaryLocation={accountData.primaryLocation} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardIndex;
