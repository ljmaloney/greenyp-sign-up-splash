
export const normalizePhoneForSquare = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if missing
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  return `+${digits}`;
};

export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Check if already in AAA-XXX-NNNN format and convert to (AAA) XXX-NNNN
  const dashFormat = /^(\d{3})-(\d{3})-(\d{4})$/;
  const dashMatch = phone.match(dashFormat);
  if (dashMatch) {
    return `(${dashMatch[1]}) ${dashMatch[2]}-${dashMatch[3]}`;
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // For other lengths, return the original input
  return phone;
};

// New function specifically for Square API - clean digits only with +1 prefix
export const formatPhoneForSquareAPI = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Ensure we have exactly 10 digits for US numbers
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If not a valid US number format, return empty string
  return '';
};
