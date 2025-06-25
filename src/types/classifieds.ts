
export interface Classified {
  id: string;
  title: string;
  description: string;
  category: string;
  zipCode: string;
  email: string;
  phone: string;
  images: string[];
  pricingTier: 'basic' | 'standard' | 'premium';
  contactObfuscated: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface ClassifiedCategory {
  id: string;
  name: string;
}

export interface ClassifiedFilters {
  category?: string;
  zipCode?: string;
  keyword?: string;
  maxMiles?: number;
}

export interface ClassifiedFormData {
  title: string;
  description: string;
  category: string;
  zipCode: string;
  email: string;
  phone: string;
  pricingTier: 'basic' | 'standard' | 'premium';
  images: File[];
}

export const PRICING_TIERS = {
  basic: {
    name: 'Basic',
    price: 10,
    maxImages: 0,
    contactObfuscation: false,
    description: 'No images'
  },
  standard: {
    name: 'Standard',
    price: 20,
    maxImages: 5,
    contactObfuscation: false,
    description: 'Up to 5 images'
  },
  premium: {
    name: 'Premium',
    price: 30,
    maxImages: 10,
    contactObfuscation: true,
    description: 'Up to 10 images + contact obfuscation'
  }
} as const;
