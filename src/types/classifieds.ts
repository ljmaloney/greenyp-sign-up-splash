export interface Classified {
  id: string;
  title: string;
  description: string;
  category: string;
  zipCode: string;
  city?: string;
  state?: string;
  email: string;
  phone: string;
  images: string[];
  pricingTier: string; // Now stores adTypeId
  contactObfuscated: boolean;
  createdAt: string;
  expiresAt: string;
  price?: number;
  perUnitType?: string; // Add perUnitType field
  distance?: number | null; // Add distance field
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
  pricingTier: string; // Now stores adTypeId
  images: File[];
}

// Keep the legacy PRICING_TIERS for backward compatibility, but it's no longer used
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
    description: 'Up to 10 images'
  }
} as const;
