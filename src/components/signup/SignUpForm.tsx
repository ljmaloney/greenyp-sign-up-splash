
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
import ErrorMessage from './ErrorMessage';

interface SignUpFormProps {
  selectedPlan: string;
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: categories } = useCategories();
  const { form, loading, onSubmit, error, isSystemError } = useSignUpForm(selectedPlan);

  // Find the selected subscription to display its name
  const selectedSubscription = subscriptions?.find(sub => sub.subscriptionId === selectedPlan);

  const handleSubmit = (data: any) => {
    console.log('📋 SignUpForm: Form submission triggered');
    console.log('📝 SignUpForm: Form data valid, calling onSubmit');
    onSubmit(data, selectedSubscription, categories);
  };

  // Debug error state
  console.log('🐛 SignUpForm: Error state debug:', {
    hasError: !!error,
    errorMessage: error,
    isSystemError,
    errorLength: error?.length
  });

  // Show system error page for 500-series errors
  if (isSystemError) {
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

      {/* Single error display at the top */}
      {error && (
        <>
          <ErrorMessage message={error} />
          {console.log('⚠️ SignUpForm: Displaying error message:', error)}
        </>
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
