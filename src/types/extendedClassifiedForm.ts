
export interface ExtendedClassifiedFormData {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pricingTier: string; // Now stores adTypeId
  images: File[];
}

export type Step = 'basic' | 'images' | 'payment';
