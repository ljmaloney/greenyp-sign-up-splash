
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
