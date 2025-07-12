export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10-digit US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +1 (XXX) XXX-XXXX for 11-digit numbers starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    const remaining = digits.slice(1);
    return `+1 (${remaining.slice(0, 3)}) ${remaining.slice(3, 6)}-${remaining.slice(6)}`;
  }
  
  // Return original if we can't normalize it
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
