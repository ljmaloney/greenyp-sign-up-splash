
import { SignUpFormSchema } from '@/utils/signUpValidation';

export const createConfirmationParams = (
  responseData: any,
  data: SignUpFormSchema,
  selectedSubscription: any,
  categories: any[]
): URLSearchParams => {
  // Find the selected category name
  const selectedCategory = categories?.find(cat => cat.lineOfBusinessId === data.lineOfBusinessId);
  
  const params = new URLSearchParams({
    businessName: responseData.response.producer.businessName,
    plan: selectedSubscription?.displayName || 'Selected Plan',
    planPrice: selectedSubscription?.formattedMonthlyPrice || '',
    subscriptionType: responseData.response.producer.subscriptionType,
    lineOfBusiness: selectedCategory?.lineOfBusinessName || 'Business Category',
    email: responseData.response.primaryUserCredentials.emailAddress,
    phone: responseData.response.contacts[0]?.phoneNumber || data.phoneNumber,
    location: `${responseData.response.primaryLocation.city}, ${responseData.response.primaryLocation.state}`,
    website: responseData.response.producer.websiteUrl || '',
    producerId: responseData.response.producer.producerId,
    // Additional location data
    locationName: responseData.response.primaryLocation.locationName || '',
    addressLine1: responseData.response.primaryLocation.addressLine1 || '',
    addressLine2: responseData.response.primaryLocation.addressLine2 || '',
    city: responseData.response.primaryLocation.city || '',
    state: responseData.response.primaryLocation.state || '',
    postalCode: responseData.response.primaryLocation.postalCode || '',
    // Additional contact data
    contactName: responseData.response.contacts[0]?.genericContactName || '',
    firstName: responseData.response.contacts[0]?.firstName || '',
    lastName: responseData.response.contacts[0]?.lastName || '',
    title: responseData.response.contacts[0]?.title || '',
    cellPhone: responseData.response.contacts[0]?.cellPhoneNumber || ''
  });
  
  return params;
};
