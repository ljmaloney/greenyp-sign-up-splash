
export const validateName = (name: string): boolean => {
  return /^[A-Za-z\s]+$/.test(name);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSubject = (subject: string): boolean => {
  return /^[A-Za-z\s]+$/.test(subject);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Optional field
  return /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);
};

export const validateCompanyName = (companyName: string): boolean => {
  return /^[A-Za-z\s]+$/.test(companyName);
};
