
import { ContactFormData, Contact } from "@/types/contact";

export const validateGenericContactName = (name: string): boolean => {
  return /^[A-Za-z\s&]*$/.test(name);
};

export const validateContactForm = (formData: ContactFormData, existingContacts?: Contact[], editingContactId?: string) => {
  if (!formData.producerLocationId) {
    return { isValid: false, error: "Please select a location." };
  }

  // Check for existing PRIMARY contact when creating a new PRIMARY contact
  if (formData.producerContactType === 'PRIMARY' && existingContacts) {
    const existingPrimaryContact = existingContacts.find(contact => 
      contact.isPrimary && 
      contact.locationId === formData.producerLocationId &&
      contact.id !== editingContactId // Exclude the contact being edited
    );
    
    if (existingPrimaryContact) {
      return {
        isValid: false,
        error: "A PRIMARY contact already exists for this location. Please select a different contact type."
      };
    }
  }

  // Validate PRIMARY contact display type
  if (formData.producerContactType === 'PRIMARY') {
    if (!['PHONE_EMAIL_ONLY', 'FULL_NAME_PHONE_EMAIL', 'GENERIC_NAME_PHONE_EMAIL'].includes(formData.displayContactType)) {
      return {
        isValid: false,
        error: "PRIMARY contact must have a display type of PHONE_EMAIL_ONLY, FULL_NAME_PHONE_EMAIL, or GENERIC_NAME_PHONE_EMAIL."
      };
    }
  }

  // Validate Generic Contact Name for GENERIC_NAME_PHONE_EMAIL
  if (formData.displayContactType === 'GENERIC_NAME_PHONE_EMAIL') {
    if (!formData.genericContactName.trim()) {
      return {
        isValid: false,
        error: "Generic Contact Name is required when Display Type is GENERIC_NAME_PHONE_EMAIL."
      };
    }
    if (!validateGenericContactName(formData.genericContactName)) {
      return {
        isValid: false,
        error: "Generic Contact Name must contain only A-Z, a-z, space, and & characters."
      };
    }
  } else {
    // For other display types, FirstName and LastName are required
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return {
        isValid: false,
        error: "First Name and Last Name are required."
      };
    }
  }

  return { isValid: true };
};
