
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

  // Conditional validation based on Display Type
  if (formData.displayContactType === 'GENERIC_NAME_PHONE_EMAIL') {
    // When display type is GENERIC_NAME_PHONE_EMAIL, Generic Name is required
    if (!formData.genericContactName.trim()) {
      return {
        isValid: false,
        error: "Generic Contact Name is required when Display Type is 'Generic name, phone, and email'."
      };
    }
    
    // Validate Generic Contact Name format
    if (!validateGenericContactName(formData.genericContactName)) {
      return {
        isValid: false,
        error: "Generic Contact Name must contain only A-Z, a-z, space, and & characters."
      };
    }
  } else {
    // For other display types, First Name and Last Name are required if Generic Name is not provided
    const hasGenericName = formData.genericContactName.trim().length > 0;
    
    if (hasGenericName) {
      // If Generic Contact Name is provided, validate it
      if (!validateGenericContactName(formData.genericContactName)) {
        return {
          isValid: false,
          error: "Generic Contact Name must contain only A-Z, a-z, space, and & characters."
        };
      }
    } else {
      // If Generic Contact Name is not provided, First Name and Last Name are required
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        return {
          isValid: false,
          error: "First Name and Last Name are required when Generic Contact Name is not provided."
        };
      }
    }
  }

  return { isValid: true };
};
