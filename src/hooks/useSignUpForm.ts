
import { useSignUpFormConfig } from './useSignUpFormConfig';
import { useCreateAccountSubmission } from './useCreateAccountSubmission';

export const useSignUpForm = (selectedPlan: string) => {
  const form = useSignUpFormConfig(selectedPlan);
  const { loading, error, handleCreateAccount, resetError } = useCreateAccountSubmission();

  const onSubmit = (data: any) => {
    console.log('📋 useSignUpForm: Form submission triggered with 4-step process');
    console.log('📋 useSignUpForm: Selected plan:', selectedPlan);
    console.log('📋 useSignUpForm: Form data subscription ID:', data.subscriptionId);
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
