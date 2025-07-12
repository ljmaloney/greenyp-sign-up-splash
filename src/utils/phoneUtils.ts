
export const normalizePhoneForSquare = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, format as +1XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, assume US number and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // Return original if we can't normalize it
  return phone;
};

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
