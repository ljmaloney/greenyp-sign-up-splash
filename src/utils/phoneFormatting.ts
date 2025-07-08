
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatPhoneAsUserTypes = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    let formatted = cleaned;
    if (cleaned.length >= 6) {
      formatted = `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      formatted = `+1(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      formatted = `+1(${cleaned}`;
    }
    return formatted;
  }
  return value;
};
