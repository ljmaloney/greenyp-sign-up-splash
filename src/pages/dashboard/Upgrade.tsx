
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';
import UpgradeConfirmationDialog from '@/components/dashboard/UpgradeConfirmationDialog';
import UpgradeHeader from '@/components/dashboard/UpgradeHeader';
import UpgradeSubscriptionGrid from '@/components/dashboard/UpgradeSubscriptionGrid';
import UpgradeLoadingState from '@/components/dashboard/UpgradeLoadingState';
import UpgradeErrorState from '@/components/dashboard/UpgradeErrorState';
import UpgradeEmptyState from '@/components/dashboard/UpgradeEmptyState';
import { upgradeSubscription } from '@/services/upgradeService';
import { useToast } from '@/hooks/use-toast';

const Upgrade = () => {
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();
  const { data: accountData, isLoading: accountLoading, error: accountError, refetch } = useAccountData();
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

  console.log('🔍 Upgrade page - subscriptions:', subscriptions);
  console.log('🔍 Upgrade page - accountData:', accountData);

  if (subscriptionsLoading || accountLoading) {
    return <UpgradeLoadingState />;
  }

  if (subscriptionsError || accountError) {
    return <UpgradeErrorState />;
  }

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  console.log('🔍 Current subscription ID:', currentSubscriptionId);

  // Filter out current subscription from available plans
  const availableSubscriptions = subscriptions?.filter(
    subscription => subscription.subscriptionId !== currentSubscriptionId
  ) || [];

  console.log('🔍 Available subscriptions for upgrade:', availableSubscriptions);

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
      const upgradePayload = {
        producerId: accountData.producer.producerId,
        producerRequest: {
          producerId: accountData.producer.producerId,
          businessName: accountData.producer.businessName,
          lineOfBusinessId: accountData.producer.lineOfBusinessId,
          subscriptionId: confirmationDialog.subscriptionId,
          subscriptionType: accountData.producer.subscriptionType,
          invoiceCycleType: accountData.producer.invoiceCycleType,
          websiteUrl: accountData.producer.websiteUrl || '',
          narrative: accountData.producer.narrative || ''
        }
      };

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
      <div className="space-y-6 max-w-7xl mx-auto">
        <UpgradeHeader />

        {availableSubscriptions.length === 0 ? (
          <UpgradeEmptyState />
        ) : (
          <UpgradeSubscriptionGrid 
            subscriptions={availableSubscriptions}
            onUpgrade={handleUpgradeClick}
          />
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

export default Upgrade;
