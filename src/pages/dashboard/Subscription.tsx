
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAccountData } from '@/hooks/useAccountData';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const Subscription = () => {
  const { data: accountData, isLoading: accountLoading } = useAccountData();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();

  if (accountLoading || subscriptionsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <div className="text-center py-8">Loading subscription information...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details from the subscriptions list
  const currentSubscriptionDetails = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Get the subscription from account data (for billing info)
  const currentAccountSubscription = accountData?.producer?.subscriptions?.[0];

  // Fallback to basic info if subscription details not found
  const displayName = currentSubscriptionDetails?.displayName || 'Basic Listing';
  const shortDescription = currentSubscriptionDetails?.shortDescription || 'Basic business listing';
  const features = currentSubscriptionDetails?.formattedFeatures?.map(f => f.name) || [
    'Business Hours',
    'Basic business listing',
    'Single category listing',
    'Map Location',
    'Contact Information'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDisplayPrice = () => {
    if (!currentAccountSubscription) return '$5/month';
    
    const amount = currentAccountSubscription.subscriptionAmount;
    const cycle = currentAccountSubscription.invoiceCycleType;
    
    if (amount === 0) return 'Free';
    
    switch (cycle) {
      case 'MONTHLY':
        return `${formatCurrency(amount)}/month`;
      case 'QUARTERLY':
        return `${formatCurrency(amount)}/quarter`;
      case 'ANNUAL':
        return `${formatCurrency(amount)}/year`;
      default:
        return `${formatCurrency(amount)}/${cycle?.toLowerCase() || 'month'}`;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-greenyp-600" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{displayName}</h3>
                <p className="text-2xl font-bold text-greenyp-600">{getDisplayPrice()}</p>
                <p className="text-sm text-gray-600 mt-1">{shortDescription}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features included:</h4>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {currentAccountSubscription && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <p className="font-medium">{new Date(currentAccountSubscription.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <p className="font-medium">{new Date(currentAccountSubscription.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need More Features?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Upgrade to unlock additional features like product listings, services catalog, and enhanced visibility.
              </p>
              
              <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 w-full">
                <Link to="/dashboard/upgrade">
                  View Upgrade Options
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
