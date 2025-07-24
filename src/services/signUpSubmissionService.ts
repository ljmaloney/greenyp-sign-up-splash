
import { getApiUrl } from '@/config/api';
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { APIResponse } from '@/types/responseBody';

export interface SignUpPayload {
  producerRequest: {
    businessName: string;
    lineOfBusinessId: string;
    subscriptionId: string;
    subscriptionType: string;
    invoiceCycleType: string;
    websiteUrl: string;
    narrative: string;
    signupCode: string;
  };
  primaryContact: {
    producerContactType: string;
    displayContactType: string;
    genericContactName: string;
    firstName: string;
    lastName: string;
    title: string;
    phoneNumber: string;
    cellPhoneNumber: string;
    emailAddress: string;
  };
  primaryLocation: {
    locationName: string;
    locationType: string;
    locationDisplayType: string;
    active: boolean;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    websiteUrl: string;
  };
  masterUserCredentials: {
    firstName: string;
    lastName: string;
    businessPhone: string;
    cellPhone: string;
    emailAddress: string;
    userName: string;
    credentials: string;
  };
}

export const createSignUpPayload = (data: SignUpFormSchema): SignUpPayload => {
  return {
    producerRequest: {
      businessName: data.businessName,
      lineOfBusinessId: data.lineOfBusinessId,
      subscriptionId: data.subscriptionId,
      subscriptionType: "LIVE_UNPAID",
      invoiceCycleType: "MONTHLY",
      websiteUrl: data.websiteUrl || "",
      narrative: data.narrative || "",
      signupCode: data.signupCode || ""
    },
    primaryContact: {
      producerContactType: "PRIMARY",
      displayContactType: data.displayContactType,
      genericContactName: data.genericContactName || `${data.firstName} ${data.lastName}`,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      title: data.title || "",
      phoneNumber: data.phoneNumber,
      cellPhoneNumber: data.cellPhoneNumber,
      emailAddress: data.emailAddress
    },
    primaryLocation: {
      locationName: data.locationName || "",
      locationType: "HOME_OFFICE_PRIMARY",
      locationDisplayType: data.locationDisplayType,
      active: true,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || "",
      addressLine3: "",
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      latitude: "",
      longitude: "",
      websiteUrl: data.websiteUrl || ""
    },
    masterUserCredentials: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      businessPhone: data.phoneNumber,
      cellPhone: data.cellPhoneNumber,
      emailAddress: data.emailAddress,
      userName: data.userName,
      credentials: data.password
    }
  };
};

export const submitSignUpData = async (payload: SignUpPayload): Promise<{ response: Response; status: number }> => {
  console.log('🚀 Submitting sign-up data to POST /account:', payload);

  const response = await fetch(getApiUrl('/account'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  console.log('📡 Response status:', response.status);
  
  return { response, status: response.status };
};

export const fetchAccountData = async (producerId: string): Promise<any> => {
  console.log('📋 Fetching account data for producer:', producerId);
  
  const response = await fetch(getApiUrl(`/account/${producerId}`));
  console.log('📡 Account fetch response status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account data: ${response.status}`);
  }
  
  const accountData = await response.json();
  console.log('✅ Account data fetched successfully:', accountData);
  
  return accountData;
};
