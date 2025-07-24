
import { useSignUpFormConfig } from './useSignUpFormConfig';
import { useCreateAccountSubmission } from './useCreateAccountSubmission';

export const useSignUpForm = (selectedPlan?: string) => {
  const form = useSignUpFormConfig(selectedPlan);
  const { loading, error, handleCreateAccount, resetError } = useCreateAccountSubmission();

  const onSubmit = (data: any) => {
    console.log('📋 useSignUpForm: Form submission triggered with data');
    console.log('📋 useSignUpForm: Selected plan from form:', data.subscriptionId);
    
    // Validate that a subscription is selected
    if (!data.subscriptionId) {
      console.error('📋 useSignUpForm: No subscription selected in form data');
      return;
    }
    
    handleCreateAccount(data);
  };

  return {
    form,
    loading,
    onSubmit,
    error,
    resetError
  };
};
