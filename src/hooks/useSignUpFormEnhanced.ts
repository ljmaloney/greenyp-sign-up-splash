
import { useSignUpFormConfig } from './useSignUpFormConfig';
import { useSignUpSubmission } from './useSignUpSubmission';
import { useNavigationDebugger } from './useNavigationDebugger';
import { useBrowserExtensionDetector } from './useBrowserExtensionDetector';

export const useSignUpFormEnhanced = (selectedPlan: string) => {
  const form = useSignUpFormConfig(selectedPlan);
  const { loading, error, isSystemError, isDuplicateEmail, handleSubmit, resetError } = useSignUpSubmission();
  const { safeNavigate } = useNavigationDebugger();
  const extensionDetection = useBrowserExtensionDetector();

  const onSubmit = (data: any, selectedSubscription: any, categories: any[]) => {
    console.log('🚀 Enhanced form submission starting...');
    
    // Log extension interference if detected
    if (extensionDetection.hasInterference) {
      console.warn('⚠️ Browser extension interference detected during submission:', extensionDetection);
    }
    
    handleSubmit(data, selectedSubscription, categories);
  };

  return {
    form,
    loading,
    onSubmit,
    error,
    isSystemError,
    isDuplicateEmail,
    resetError,
    safeNavigate,
    extensionDetection
  };
};
