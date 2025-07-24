
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';

export const useSignUpFormConfig = (selectedPlan?: string) => {
  console.log('📋 useSignUpFormConfig: Initializing with plan:', selectedPlan);
  
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      lineOfBusinessId: '',
      subscriptionId: selectedPlan || '',
      websiteUrl: '',
      narrative: '',
      signupCode: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cellPhoneNumber: '',
      emailAddress: '',
      genericContactName: '',
      title: '',
      displayContactType: 'FULL_NAME_PHONE_EMAIL',
      locationName: '',
      locationDisplayType: 'CITY_STATE_ZIP',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      userName: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Update subscription ID when selectedPlan changes (but only if it's provided)
  useEffect(() => {
    if (selectedPlan && selectedPlan !== form.getValues('subscriptionId')) {
      console.log('📋 useSignUpFormConfig: Updating subscription ID to:', selectedPlan);
      form.setValue('subscriptionId', selectedPlan, { shouldValidate: true });
    }
  }, [selectedPlan, form]);

  // Watch for email address changes and update userName accordingly
  const emailAddress = form.watch('emailAddress');
  const userName = form.watch('userName');
  
  useEffect(() => {
    if (emailAddress && (!userName || userName === '')) {
      form.setValue('userName', emailAddress, { shouldValidate: true });
    }
  }, [emailAddress, userName, form]);

  console.log('📋 useSignUpFormConfig: Current form subscription ID:', form.getValues('subscriptionId'));

  return form;
};
