
import { ProfileData, ProducerProfile, LocationHours } from '@/types/profile';

// Helper function to convert ProducerProfile to ProfileData format
export const convertProducerProfileToProfileData = (producerProfile: ProducerProfile): ProfileData => {
  return {
    producerId: producerProfile.producerId,
    businessName: producerProfile.businessName,
    narrative: producerProfile.businessNarrative,
    locationName: producerProfile.locationName,
    locationType: producerProfile.locationType,
    locationDisplayType: producerProfile.locationDisplayType,
    active: true, // Assume active if we got the profile
    addressLine1: producerProfile.addressLine1,
    addressLine2: producerProfile.addressLine2,
    addressLine3: producerProfile.addressLine3,
    city: producerProfile.city,
    state: producerProfile.state,
    postalCode: producerProfile.postalCode,
    latitude: producerProfile.latitude,
    longitude: producerProfile.longitude,
    websiteUrl: producerProfile.websiteUrl,
    contactName: '', // Not available in the API response
    phoneNumber: producerProfile.phone,
    cellPhoneNumber: producerProfile.cellPhone,
    locationHours: producerProfile.locationHours,
    locationId: producerProfile.locationId
  };
};

// Helper function to create mock location hours
export const createMockLocationHours = (producerId: string, locationId: string): LocationHours[] => {
  const baseHours = [
    { dayOfWeek: 'MONDAY' as const, openTime: '7:00 AM', closeTime: '6:00 PM' },
    { dayOfWeek: 'TUESDAY' as const, openTime: '7:00 AM', closeTime: '6:00 PM' },
    { dayOfWeek: 'WEDNESDAY' as const, openTime: '7:00 AM', closeTime: '6:00 PM' },
    { dayOfWeek: 'THURSDAY' as const, openTime: '7:00 AM', closeTime: '6:00 PM' },
    { dayOfWeek: 'FRIDAY' as const, openTime: '7:00 AM', closeTime: '6:00 PM' },
    { dayOfWeek: 'SATURDAY' as const, openTime: '8:00 AM', closeTime: '4:00 PM' },
    { dayOfWeek: 'SUNDAY' as const, openTime: '', closeTime: '' }
  ];

  return baseHours.map((hours, index) => ({
    locationHoursId: `hours-${producerId}-${index}`,
    createDate: '2023-01-01T00:00:00Z',
    lastUpdateDate: '2023-01-01T00:00:00Z',
    producerId,
    producerLocationId: locationId,
    ...hours
  }));
};

// Create mock profile data from URL parameters when API fails
export const createMockProfileFromParams = (producerId: string, searchParams: URLSearchParams): ProfileData => {
  const businessName = searchParams.get('businessName') || 'Business Profile';
  const locationId = searchParams.get('locationId') || `location-${producerId}`;
  
  return {
    producerId,
    businessName: decodeURIComponent(businessName),
    narrative: `Welcome to ${decodeURIComponent(businessName)}. We are committed to providing excellent service and quality products to our community. Our experienced team is dedicated to meeting your needs with professional expertise and reliable service.`,
    locationName: 'Main Location',
    locationType: 'OFFICE',
    locationDisplayType: 'BUSINESS_ADDRESS',
    active: true,
    addressLine1: '123 Business Street',
    addressLine2: '',
    addressLine3: '',
    city: 'Phoenix',
    state: 'AZ',
    postalCode: '85001',
    latitude: '33.4484',
    longitude: '-112.0740',
    websiteUrl: '',
    contactName: 'Business Owner',
    phoneNumber: '(602) 555-1234',
    cellPhoneNumber: '',
    subscriptionId: 'featured-business-001',
    locationId,
    locationHours: createMockLocationHours(producerId, locationId)
  };
};
