export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  let normalizedDigits = digits;
  
  // If it starts with 1 and has 11 digits, remove the leading 1
  if (digits.length === 11 && digits.startsWith('1')) {
    normalizedDigits = digits.slice(1);
  }
  
  // If we have exactly 10 digits, format as (123) 123-1234
  if (normalizedDigits.length === 10) {
    return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6)}`;
  }
  
  // If we don't have 10 digits, return the original input
  return phone;
};

export const normalizePhoneForSquare = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  let normalizedDigits = digits;
  
  // If it starts with 1 and has 11 digits, use as is
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If we have exactly 10 digits, add US country code
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If we have other lengths, try to format appropriately
  if (digits.length >= 9 && digits.length <= 16) {
    // If doesn't start with country code, assume US
    if (!digits.startsWith('1') && digits.length === 10) {
      return `+1${digits}`;
    }
    // Otherwise, add + if not present
    return `+${digits}`;
  }
  
  // Fallback: return original with + prefix if it looks like a valid number
  const cleanDigits = phone.replace(/[^\d]/g, '');
  if (cleanDigits.length >= 9 && cleanDigits.length <= 16) {
    return `+1${cleanDigits.length === 10 ? cleanDigits : cleanDigits}`;
  }
  
  return phone;
};
