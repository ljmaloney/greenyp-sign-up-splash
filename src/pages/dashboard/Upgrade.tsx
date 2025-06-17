
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';

const Upgrade = () => {
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();
  const { data: accountData, isLoading: accountLoading, error: accountError } = useAccountData();

  console.log('🔍 Upgrade page - subscriptions:', subscriptions);
  console.log('🔍 Upgrade page - accountData:', accountData);

  if (subscriptionsLoading || accountLoading) {
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
  }

  if (subscriptionsError || accountError) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-red-600">
            <h1 className="text-2xl font-bold mb-2">Error Loading Data</h1>
            <p>Unable to load subscription plans. Please try again later.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  console.log('🔍 Current subscription ID:', currentSubscriptionId);

  // Filter out current subscription from available plans
  const availableSubscriptions = subscriptions?.filter(
    subscription => subscription.subscriptionId !== currentSubscriptionId
  ) || [];

  console.log('🔍 Available subscriptions for upgrade:', availableSubscriptions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Crown className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our available subscription plans to unlock more features and grow your business.
          </p>
        </div>

        {availableSubscriptions.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-gray-600">
                You're already on our highest available plan! Thank you for being a valued subscriber.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {availableSubscriptions.map((subscription) => (
              <Card key={subscription.subscriptionId} className="relative">
                {subscription.popular && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-greenyp-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-greenyp-600" />
                    {subscription.displayName}
                    {subscription.comingSoon && (
                      <span className="text-yellow-600 text-sm font-normal ml-2">Coming Soon</span>
                    )}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{subscription.shortDescription}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {!subscription.comingSoon && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-greenyp-600">
                        {subscription.monthlyAutopayAmount === 0 
                          ? 'Free' 
                          : formatCurrency(subscription.monthlyAutopayAmount)
                        }
                      </div>
                      <div className="text-gray-500">
                        {subscription.monthlyAutopayAmount === 0 ? 'for first month' : 'per month'}
                      </div>
                      {subscription.annualBillAmount && (
                        <div className="text-sm text-gray-500 mt-1">
                          or {formatCurrency(subscription.annualBillAmount)} annually
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {subscription.formattedFeatures.map((feature) => (
                        <li key={feature.id} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      asChild={!subscription.comingSoon}
                      disabled={subscription.comingSoon}
                      className={`w-full ${
                        subscription.comingSoon
                          ? 'bg-gray-400 cursor-not-allowed'
                          : subscription.popular
                            ? 'bg-greenyp-600 hover:bg-greenyp-700'
                            : 'bg-greenyp-600 hover:bg-greenyp-700'
                      }`}
                    >
                      {subscription.comingSoon ? (
                        'Coming Soon'
                      ) : (
                        <Link to={`/subscriber/subscribe?plan=${subscription.subscriptionId}`}>
                          Upgrade Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Need help choosing? <Link to="/contact" className="text-greenyp-600 hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upgrade;
