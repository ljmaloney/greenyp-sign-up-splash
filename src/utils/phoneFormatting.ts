
/**
 * Format a phone number as the user is typing it
 * For US phone numbers in format (XXX) XXX-XXXX
 */
export const formatPhoneAsUserTypes = (value: string): string => {
  // Strip all non-numeric characters
  const digits = value.replace(/\D/g, '');
  
  // Return different formats based on the number of digits
  if (digits.length < 4) {
    return digits;
  } else if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};
