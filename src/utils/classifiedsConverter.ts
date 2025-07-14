
import { Classified } from '@/types/classifieds';
import { RecentClassifiedResponse } from '@/types/api';

// Convert API response to our existing Classified interface
export const convertToClassified = (item: RecentClassifiedResponse): Classified => ({
  id: item.classifiedId,
  title: item.title,
  description: item.description,
  category: item.categoryName,
  zipCode: item.postalCode,
  city: item.city,
  state: item.state,
  email: item.emailAddress,
  phone: item.phoneNumber,
  images: item.url ? [item.url] : [],
  pricingTier: item.adTypeId,
  contactObfuscated: item.obscureContactInfo,
  createdAt: item.activeDate + 'T00:00:00Z',
  expiresAt: item.lastActiveDate + 'T00:00:00Z',
  price: item.price,
  perUnitType: item.perUnitType,
  distance: item.distance
});
