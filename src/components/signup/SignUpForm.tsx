
import React from 'react';
import { Form } from "@/components/ui/form";
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useCategories } from '@/hooks/useCategories';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import BusinessInformationCard from './BusinessInformationCard';
import ContactInformationCard from './ContactInformationCard';
import LocationInformationCard from './LocationInformationCard';
import AccountCredentialsCard from './AccountCredentialsCard';
import SignUpFormHeader from './SignUpFormHeader';
import SignUpFormSubmitSection from './SignUpFormSubmitSection';
import SignUpErrorHandler from './SignUpErrorHandler';
import { findSubscriptionMatch } from '@/utils/subscriptionMatching';

interface SignUpFormProps {
  selectedPlan: string;
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: categories } = useCategories();
  const { form, loading, onSubmit, error, resetError } = useSignUpForm(selectedPlan);

  // Find the selected subscription using improved matching
  const selectedSubscription = findSubscriptionMatch(subscriptions, selectedPlan);

  console.log('📋 SignUpForm: Subscription matching result:', {
    selectedPlan,
    foundSubscription: selectedSubscription ? {
      id: selectedSubscription.subscriptionId,
      name: selectedSubscription.displayName
    } : null,
    totalSubscriptions: subscriptions?.length
  });

  const handleSubmit = (data: any) => {
    console.log('📋 SignUpForm: Form submission triggered with 4-step process');
    onSubmit(data);
  };

  const handleRetry = () => {
    console.log('🔄 SignUpForm: Retrying form submission');
    resetError();
  };

  // Debug error state
  console.log('🐛 SignUpForm: Error state debug:', {
    hasError: !!error,
    errorMessage: error,
    errorLength: error?.length
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <SignUpFormHeader selectedSubscription={selectedSubscription} />

      {/* Error display */}
      {error && (
        <SignUpErrorHandler 
          error={error}
          isSystemError={false}
          isDuplicateEmail={false}
          onRetry={handleRetry}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <BusinessInformationCard control={form.control} />
          <ContactInformationCard control={form.control} />
          <LocationInformationCard control={form.control} />
          <AccountCredentialsCard control={form.control} />

          <SignUpFormSubmitSection loading={loading} />
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
