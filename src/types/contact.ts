
export interface ContactFormData {
  producerLocationId: string;
  producerContactType: "PRIMARY" | "ACCOUNTS_PAYABLE" | "ADMIN" | "DISABLED" | "SALES";
  displayContactType: "NO_DISPLAY" | "FULL_NAME_PHONE_EMAIL" | "GENERIC_NAME_PHONE_EMAIL" | "PHONE_EMAIL_ONLY";
  genericContactName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  locationId?: string;
  producerLocationId?: string;
  producerContactType?: "PRIMARY" | "ACCOUNTS_PAYABLE" | "ADMIN" | "DISABLED" | "SALES";
  displayContactType?: "NO_DISPLAY" | "FULL_NAME_PHONE_EMAIL" | "GENERIC_NAME_PHONE_EMAIL" | "PHONE_EMAIL_ONLY";
  genericContactName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  cellPhoneNumber?: string;
  emailAddress?: string;
}

export interface Location {
  id: string;
  locationName: string;
}
