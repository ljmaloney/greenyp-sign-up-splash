
import { useSignUpFormConfig } from './useSignUpFormConfig';
import { useSignUpSubmission } from './useSignUpSubmission';

export const useSignUpForm = (selectedPlan: string) => {
  const form = useSignUpFormConfig(selectedPlan);
  const { loading, error, isSystemError, isDuplicateEmail, handleSubmit, resetError } = useSignUpSubmission();

  const onSubmit = (data: any, selectedSubscription: any, categories: any[]) => {
    handleSubmit(data, selectedSubscription, categories);
  };

  return {
    form,
    loading,
    onSubmit,
    error,
    isSystemError,
    isDuplicateEmail,
    resetError
  };
};
