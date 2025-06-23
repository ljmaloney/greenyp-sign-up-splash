
import { ProducerProfile, ProfileData, LocationHours } from '@/types/profile';

export const convertProducerProfileToProfileData = (producerProfile: ProducerProfile): ProfileData => {
  return {
    producerId: producerProfile.producerId,
    businessName: producerProfile.businessName,
    narrative: producerProfile.businessNarrative,
    locationName: producerProfile.locationName,
    locationType: producerProfile.locationType,
    locationDisplayType: producerProfile.locationDisplayType,
    active: true, // Assuming active if returned by API
    addressLine1: producerProfile.addressLine1,
    addressLine2: producerProfile.addressLine2,
    addressLine3: producerProfile.addressLine3,
    city: producerProfile.city,
    state: producerProfile.state,
    postalCode: producerProfile.postalCode,
    latitude: producerProfile.latitude,
    longitude: producerProfile.longitude,
    websiteUrl: producerProfile.websiteUrl,
    contactName: '', // Not available in producer profile
    phoneNumber: producerProfile.phone,
    cellPhoneNumber: producerProfile.cellPhone,
    locationHours: producerProfile.locationHours,
    subscriptionId: producerProfile.subscriptionIds?.[0], // Use first subscription for backward compatibility
    subscriptionIds: producerProfile.subscriptionIds, // Add the full array
    locationId: producerProfile.locationId,
  };
};

export const createMockProfileFromParams = (producerId: string, searchParams: URLSearchParams): ProfileData => {
  const businessName = searchParams.get('businessName') || 'Business Profile';
  const city = searchParams.get('city') || 'Phoenix';
  const state = searchParams.get('state') || 'AZ';
  const postalCode = searchParams.get('postalCode') || '85001';
  const phone = searchParams.get('phone') || '(602) 555-1234';

  const mockHours: LocationHours[] = [
    {
      locationHoursId: `hours-${producerId}-0`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'MONDAY',
      openTime: '7:00 AM',
      closeTime: '6:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-1`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'TUESDAY',
      openTime: '7:00 AM',
      closeTime: '6:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-2`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'WEDNESDAY',
      openTime: '7:00 AM',
      closeTime: '6:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-3`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'THURSDAY',
      openTime: '7:00 AM',
      closeTime: '6:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-4`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'FRIDAY',
      openTime: '7:00 AM',
      closeTime: '6:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-5`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'SATURDAY',
      openTime: '8:00 AM',
      closeTime: '4:00 PM'
    },
    {
      locationHoursId: `hours-${producerId}-6`,
      createDate: '2023-01-01T00:00:00Z',
      lastUpdateDate: '2023-01-01T00:00:00Z',
      producerId,
      producerLocationId: `location-${producerId}`,
      dayOfWeek: 'SUNDAY',
      openTime: '',
      closeTime: ''
    }
  ];

  return {
    producerId,
    businessName,
    narrative: `Welcome to ${businessName}. We are committed to providing excellent service and quality products to our community. Our experienced team is dedicated to meeting your needs with professional expertise and reliable service.`,
    locationName: 'Main Location',
    locationType: 'OFFICE',
    locationDisplayType: 'BUSINESS_ADDRESS',
    active: true,
    addressLine1: '123 Business Street',
    addressLine2: '',
    addressLine3: '',
    city,
    state,
    postalCode,
    latitude: '33.4484',
    longitude: '-112.0740',
    websiteUrl: '',
    contactName: 'Business Owner',
    phoneNumber: phone,
    cellPhoneNumber: '',
    subscriptionId: 'featured-business-001',
    subscriptionIds: ['featured-business-001'],
    locationId: `location-${producerId}`,
    locationHours: mockHours
  };
};
