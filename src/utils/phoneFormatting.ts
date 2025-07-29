
export const formatPhoneNumber = (phone: string): string => {
  // Handle null, undefined, or empty string
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle 10-digit US numbers (add country code)
  if (cleaned.length === 10) {
    return `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Handle 11-digit US numbers that start with 1 (country code)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // For other cases, return the original value with country code if we can identify the format
  if (cleaned.length >= 10) {
    const digits = cleaned.length > 10 ? cleaned.slice(-10) : cleaned;
    return `+1(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  
  // If we can't format it, return the original
  return phone;
};

export const formatPhoneAsUserTypes = (value: string): string => {
  // Remove all non-digit characters to get clean input
  const cleaned = value.replace(/\D/g, '');
  
  // Handle empty input
  if (cleaned.length === 0) {
    return '';
  }
  
  // Handle different lengths of input
  if (cleaned.length <= 3) {
    return `(${cleaned}`;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If more than 10 digits, truncate to 10
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};
