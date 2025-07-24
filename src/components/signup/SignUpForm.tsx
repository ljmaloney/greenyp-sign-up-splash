
import React from 'react';
import { Form } from "@/components/ui/form";
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useCategories } from '@/hooks/useCategories';
import { useSignUpFormEnhanced } from '@/hooks/useSignUpFormEnhanced';
import BusinessInformationCard from './BusinessInformationCard';
import ContactInformationCard from './ContactInformationCard';
import LocationInformationCard from './LocationInformationCard';
import AccountCredentialsCard from './AccountCredentialsCard';
import SignUpFormHeader from './SignUpFormHeader';
import SignUpFormSubmitSection from './SignUpFormSubmitSection';
import SystemErrorCard from './SystemErrorCard';
import SignUpErrorHandler from './SignUpErrorHandler';
import { findSubscriptionMatch } from '@/utils/subscriptionMatching';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SignUpFormProps {
  selectedPlan: string;
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const { data: subscriptions, error: subscriptionsError, isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: categories, error: categoriesError } = useCategories();
  const { 
    form, 
    loading, 
    onSubmit, 
    error, 
    isSystemError, 
    isDuplicateEmail, 
    resetError,
    safeNavigate,
    extensionDetection
  } = useSignUpFormEnhanced(selectedPlan);

  // Find the selected subscription using improved matching
  const selectedSubscription = findSubscriptionMatch(subscriptions, selectedPlan);

  console.log('📋 SignUpForm: Enhanced initialization with debugging:', {
    selectedPlan,
    foundSubscription: selectedSubscription ? {
      id: selectedSubscription.subscriptionId,
      name: selectedSubscription.displayName
    } : null,
    totalSubscriptions: subscriptions?.length,
    subscriptionsLoading,
    hasSubscriptionsError: !!subscriptionsError,
    hasCategoriesError: !!categoriesError,
    extensionInterference: extensionDetection.hasInterference
  });

  // Handle missing plan scenario
  if (!selectedPlan || selectedPlan.trim() === '') {
    console.warn('⚠️ No plan selected, showing plan selection prompt');
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Select a Plan</h2>
            <p className="text-gray-600">
              Please select a subscription plan to continue with your signup.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => safeNavigate('/subscribers/pricing')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                View Pricing Plans
              </Button>
              <Button 
                variant="outline"
                onClick={() => safeNavigate('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where plan is provided but subscription not found
  if (!subscriptionsLoading && subscriptions && !selectedSubscription) {
    console.warn('⚠️ Plan provided but subscription not found, showing fallback');
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Plan Not Found</h2>
            <p className="text-gray-600">
              The selected plan "{selectedPlan}" is not available. Please choose from our current plans.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => safeNavigate('/subscribers/pricing')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                View Available Plans
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Try with a default plan
                  const defaultPlan = subscriptions?.[0]?.subscriptionId;
                  if (defaultPlan) {
                    safeNavigate(`/subscribers/signup?plan=${defaultPlan}`);
                  } else {
                    safeNavigate('/subscribers/pricing');
                  }
                }}
                className="w-full"
              >
                Use Default Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (data: any) => {
    console.log('📋 SignUpForm: Enhanced form submission with debugging');
    console.log('📝 Form data summary:', {
      businessName: data.businessName,
      email: data.emailAddress,
      selectedPlan,
      selectedSubscriptionId: selectedSubscription?.subscriptionId,
      extensionInterference: extensionDetection.hasInterference
    });
    
    // Enhanced validation - proceed even if categories failed to load
    if (categoriesError) {
      console.warn('⚠️ Categories failed to load, but proceeding with submission');
    }
    
    // Use empty array as fallback for categories if they failed to load
    const categoriesToUse = categories || [];
    
    console.log('📝 SignUpForm: Calling enhanced onSubmit with validated data');
    onSubmit(data, selectedSubscription, categoriesToUse);
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

  // Show system error page for 500-series errors
  if (isSystemError && !error) {
    console.log('🔥 SignUpForm: Showing system error page');
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <SystemErrorCard />
      </div>
    );
  }

  // Show warning for external API failures but still allow form submission
  const hasExternalErrors = subscriptionsError || categoriesError;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <SignUpFormHeader selectedSubscription={selectedSubscription} />

      {/* Show extension interference warning */}
      {extensionDetection.hasInterference && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Browser Extension Detected
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Some browser extensions may interfere with form submission.</p>
                <p className="mt-1">Recommendations: {extensionDetection.recommendations.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show warning for external API failures but still allow form submission */}
      {hasExternalErrors && !error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Some features may be limited
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>We're having trouble loading some data, but you can still complete your signup.</p>
                {subscriptionsError && <p>• Subscription plans: {subscriptionsError.message}</p>}
                {categoriesError && <p>• Business categories: {categoriesError.message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main error display */}
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
