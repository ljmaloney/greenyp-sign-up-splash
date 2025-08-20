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
import SystemErrorCard from './SystemErrorCard';
import SignUpErrorHandler from './SignUpErrorHandler';
import { findSubscriptionMatch } from '@/utils/subscriptionMatching';

interface SignUpFormProps {
  selectedPlan: string;
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: categories } = useCategories();
  const { form, loading, onSubmit, error, isSystemError, isDuplicateEmail, resetError } = useSignUpForm(selectedPlan);

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
    console.log('📋 SignUpForm: Form submission triggered');
    console.log('📝 SignUpForm: Form data processed, calling onSubmit');
    onSubmit(data, selectedSubscription, categories);
  };

  const handleRetry = () => {
    console.log('🔄 SignUpForm: Retrying form submission');
    resetError();
  };

  const handleEmailChange = () => {
    console.log('📧 SignUpForm: User wants to change email');
    resetError();
    // Focus on email field to make it easy to change
    const emailField = document.querySelector('input[name="emailAddress"]') as HTMLInputElement;
    if (emailField) {
      emailField.focus();
      emailField.select();
    }
  };

  // Debug error state
  console.log('🐛 SignUpForm: Error state debug:', {
    hasError: !!error,
    errorMessage: error,
    isSystemError,
    isDuplicateEmail,
    errorLength: error?.length
  });

  // Show system error page for 500-series errors
  if (isSystemError && !error) {
    console.log('🔥 SignUpForm: Showing system error page');
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <SystemErrorCard />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <SignUpFormHeader selectedSubscription={selectedSubscription} />

      {/* Improved error display */}
      {error && (
        <SignUpErrorHandler 
          error={error}
          isSystemError={isSystemError}
          isDuplicateEmail={isDuplicateEmail}
          onRetry={handleRetry}
          onEmailChange={handleEmailChange}
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