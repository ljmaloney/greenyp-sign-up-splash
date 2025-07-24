
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';

export const useSignUpFormConfig = () => {
  console.log('📋 useSignUpFormConfig: Initializing form configuration');
  
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      lineOfBusinessId: '',
      subscriptionId: '', // Always start empty - user must select from dropdown
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

  // Watch for email address changes and update userName accordingly
  const emailAddress = form.watch('emailAddress');
  const userName = form.watch('userName');
  
  useEffect(() => {
    if (emailAddress && (!userName || userName === '')) {
      form.setValue('userName', emailAddress, { shouldValidate: true });
    }
  }, [emailAddress, userName, form]);

  const currentSubscriptionId = form.watch('subscriptionId');
  console.log('📋 useSignUpFormConfig: Form initialized with subscription ID:', currentSubscriptionId || 'none selected');

  return form;
};
