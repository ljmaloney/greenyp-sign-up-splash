
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from 'lucide-react';
import { useAccountData } from '@/hooks/useAccountData';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import UpgradeConfirmationDialog from '@/components/dashboard/UpgradeConfirmationDialog';
import UpgradeSubscriptionGrid from '@/components/dashboard/UpgradeSubscriptionGrid';
import UpgradeLoadingState from '@/components/dashboard/UpgradeLoadingState';
import UpgradeErrorState from '@/components/dashboard/UpgradeErrorState';
import UpgradeEmptyState from '@/components/dashboard/UpgradeEmptyState';
import { upgradeSubscription } from '@/services/upgradeService';
import { useToast } from '@/hooks/use-toast';

const Subscription = () => {
  const { data: accountData, isLoading: accountLoading, refetch } = useAccountData();
  const { data: subscriptions, isLoading: subscriptionsLoading, error } = useSubscriptions();
  const { toast } = useToast();
  
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    subscriptionId: string;
    subscriptionName: string;
  }>({
    isOpen: false,
    subscriptionId: '',
    subscriptionName: ''
  });
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (accountLoading || subscriptionsLoading) {
    return <UpgradeLoadingState />;
  }

  if (error) {
    return <UpgradeErrorState />;
  }

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details from the subscriptions list
  const currentSubscriptionDetails = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Get the subscription from account data (for billing info)
  const currentAccountSubscription = accountData?.producer?.subscriptions?.[0];

  // Filter out current subscription from available plans
  const availableSubscriptions = subscriptions?.filter(
    subscription => subscription.subscriptionId !== currentSubscriptionId
  ) || [];

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

  const handleUpgradeClick = (subscriptionId: string, subscriptionName: string) => {
    setConfirmationDialog({
      isOpen: true,
      subscriptionId,
      subscriptionName
    });
  };

  const handleConfirmUpgrade = async () => {
    if (!accountData?.producer) {
      toast({
        title: "Error",
        description: "Unable to get account information for upgrade.",
        variant: "destructive",
      });
      return;
    }

    setIsUpgrading(true);
    
    try {
      // Get current subscription data for invoiceCycleType
      const currentSubscription = accountData.producer.subscriptions?.[0];
      
      const upgradePayload = {
        producerId: accountData.producer.producerId,
        producerRequest: {
          producerId: accountData.producer.producerId,
          businessName: accountData.producer.businessName,
          lineOfBusinessId: accountData.producer.lineOfBusinessId,
          subscriptionId: confirmationDialog.subscriptionId,
          subscriptionType: accountData.producer.subscriptionType,
          invoiceCycleType: currentSubscription?.invoiceCycleType || accountData.producer.invoiceCycleType || 'MONTHLY',
          websiteUrl: accountData.producer.websiteUrl || '',
          narrative: accountData.producer.narrative || ''
        }
      };

      console.log('🚀 Upgrade payload with all dynamic values:', upgradePayload);

      await upgradeSubscription(upgradePayload);
      
      toast({
        title: "Upgrade Successful",
        description: `Your subscription has been upgraded to ${confirmationDialog.subscriptionName}.`,
      });

      // Refetch account data to get updated subscription
      await refetch();
      
      setConfirmationDialog({ isOpen: false, subscriptionId: '', subscriptionName: '' });
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelUpgrade = () => {
    setConfirmationDialog({ isOpen: false, subscriptionId: '', subscriptionName: '' });
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
              
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Subscription Plans */}
        {availableSubscriptions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Crown className="h-16 w-16 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Available Subscriptions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our available subscription plans to unlock more features and grow your business.
              </p>
            </div>

            <UpgradeSubscriptionGrid 
              subscriptions={availableSubscriptions}
              onUpgrade={handleUpgradeClick}
            />
          </div>
        )}

        {availableSubscriptions.length === 0 && (
          <UpgradeEmptyState />
        )}
      </div>

      <UpgradeConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCancelUpgrade}
        onConfirm={handleConfirmUpgrade}
        subscriptionName={confirmationDialog.subscriptionName}
        isLoading={isUpgrading}
      />
    </DashboardLayout>
  );
};

export default Subscription;
