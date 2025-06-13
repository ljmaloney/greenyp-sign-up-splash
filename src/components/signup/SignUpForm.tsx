
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
    onSubmit(data, selectedSubscription, categories);
  };

  // Show system error page for 500-series errors
  if (isSystemError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <SystemErrorCard />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <SignUpFormHeader selectedSubscription={selectedSubscription} />

      {error && <ErrorMessage message={error} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <BusinessInformationCard control={form.control} />
          <ContactInformationCard control={form.control} />
          <LocationInformationCard control={form.control} />
          <AccountCredentialsCard control={form.control} />

          <SignUpFormSubmitSection loading={loading} />
        </form>
      </Form>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default SignUpForm;
