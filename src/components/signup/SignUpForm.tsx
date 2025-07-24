
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

interface SignUpFormProps {
  selectedPlan?: string; // Keep for backward compatibility but don't use
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: categories } = useCategories();
  const { form, loading, onSubmit, error, resetError } = useSignUpForm();

  // Get current subscription selection from form state
  const currentSubscriptionId = form.watch('subscriptionId');
  const selectedSubscription = currentSubscriptionId 
    ? subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId)
    : null;

  console.log('📋 SignUpForm: Current form state:', {
    selectedPlanFromUrl: selectedPlan || 'none provided',
    currentSubscriptionId: currentSubscriptionId || 'none selected',
    selectedSubscription: selectedSubscription ? {
      id: selectedSubscription.subscriptionId,
      name: selectedSubscription.displayName
    } : null,
    totalSubscriptions: subscriptions?.length
  });

  const handleSubmit = (data: any) => {
    console.log('📋 SignUpForm: Form submission triggered');
    console.log('📋 SignUpForm: Subscription ID from form:', data.subscriptionId);
    
    onSubmit(data);
  };

  const handleRetry = () => {
    console.log('🔄 SignUpForm: Retrying form submission');
    resetError();
  };

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
