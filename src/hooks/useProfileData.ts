
import { useParams, useSearchParams } from 'react-router-dom';
import { useProducerProfile } from './useProfile';
import { ProfileData, ProducerProfile, LocationHours } from '@/types/profile';

// Helper function to convert ProducerProfile to ProfileData format
const convertProducerProfileToProfileData = (producerProfile: ProducerProfile, businessName?: string): ProfileData => {
  return {
    producerId: producerProfile.producerId,
    businessName: businessName || 'Business Name', // Use business name from search results or fallback
    narrative: producerProfile.businessNarrative,
    locationName: producerProfile.locationName,
    locationType: producerProfile.locationType,
    locationDisplayType: producerProfile.locationDisplayType,
    active: producerProfile.active,
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
    phoneNumber: '', // Not available in producer profile
    cellPhoneNumber: '', // Not available in producer profile
    locationHours: producerProfile.locationHours,
    locationId: producerProfile.locationId
  };
};

// Helper function to create mock location hours
const createMockLocationHours = (producerId: string, locationId: string): LocationHours[] => {
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

// Mock profile data based on the providers from CategoryPage
const getMockProfileData = (producerId: string): ProfileData => {
  const mockProfiles: Record<string, ProfileData> = {
    'producer-001': {
      producerId: 'producer-001',
      businessName: 'Green Thumb Landscaping',
      narrative: 'We are a family-owned landscaping business with over 15 years of experience in creating beautiful outdoor spaces. Our team specializes in custom landscape design, installation, and maintenance services for both residential and commercial properties. We pride ourselves on using sustainable practices and native plants to create environmentally friendly landscapes that thrive in the Arizona climate.',
      locationName: 'Phoenix Main Office',
      locationType: 'OFFICE',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '1234 Main Street',
      addressLine2: 'Suite 100',
      addressLine3: '',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85001',
      latitude: '33.4484',
      longitude: '-112.0740',
      websiteUrl: 'https://greenthumblandscaping.com',
      contactName: 'John Smith',
      phoneNumber: '(602) 555-1234',
      cellPhoneNumber: '(602) 555-5678',
      subscriptionId: 'featured-business-001',
      locationId: 'location-001',
      locationHours: createMockLocationHours('producer-001', 'location-001')
    },
    'producer-002': {
      producerId: 'producer-002',
      businessName: "Nature's Design",
      narrative: "At Nature's Design, we believe that every outdoor space has the potential to become a personal oasis. Our award-winning design team works closely with clients to create stunning landscapes that reflect their unique style and complement their home's architecture. From drought-resistant gardens to lush entertainment areas, we bring your vision to life.",
      locationName: "Scottsdale Design Center",
      locationType: 'SHOWROOM',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '5678 Desert View Road',
      addressLine2: '',
      addressLine3: '',
      city: 'Scottsdale',
      state: 'AZ',
      postalCode: '85260',
      latitude: '33.5092',
      longitude: '-111.8906',
      websiteUrl: 'https://naturesdesignaz.com',
      contactName: 'Sarah Johnson',
      phoneNumber: '(480) 555-5678',
      cellPhoneNumber: '(480) 555-9012',
      subscriptionId: 'basic-listing-001',
      locationId: 'location-002',
      locationHours: [
        {
          locationHoursId: 'hours-producer-002-0',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'MONDAY',
          openTime: '8:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-1',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'TUESDAY',
          openTime: '8:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-2',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'WEDNESDAY',
          openTime: '8:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-3',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'THURSDAY',
          openTime: '8:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-4',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'FRIDAY',
          openTime: '8:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-5',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'SATURDAY',
          openTime: '9:00 AM',
          closeTime: '3:00 PM'
        },
        {
          locationHoursId: 'hours-producer-002-6',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-002',
          producerLocationId: 'location-002',
          dayOfWeek: 'SUNDAY',
          openTime: '',
          closeTime: ''
        }
      ]
    },
    'producer-003': {
      producerId: 'producer-003',
      businessName: 'Outdoor Creations',
      narrative: 'Outdoor Creations specializes in transforming ordinary backyards into extraordinary outdoor living spaces. Our comprehensive services include landscape design, hardscaping, outdoor kitchens, fire features, and water elements. With a focus on craftsmanship and attention to detail, we create outdoor environments that enhance your lifestyle and increase your property value.',
      locationName: 'Mesa Service Center',
      locationType: 'WAREHOUSE',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '9012 Industrial Blvd',
      addressLine2: 'Building C',
      addressLine3: '',
      city: 'Mesa',
      state: 'AZ',
      postalCode: '85210',
      latitude: '33.4152',
      longitude: '-111.8315',
      websiteUrl: 'https://outdoorcreationsaz.com',
      contactName: 'Mike Rodriguez',
      phoneNumber: '(480) 555-9012',
      cellPhoneNumber: '(480) 555-3456',
      subscriptionId: 'premium-enterprise-001',
      locationId: 'location-003',
      locationHours: [
        {
          locationHoursId: 'hours-producer-003-0',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'MONDAY',
          openTime: '6:00 AM',
          closeTime: '7:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-1',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'TUESDAY',
          openTime: '6:00 AM',
          closeTime: '7:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-2',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'WEDNESDAY',
          openTime: '6:00 AM',
          closeTime: '7:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-3',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'THURSDAY',
          openTime: '6:00 AM',
          closeTime: '7:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-4',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'FRIDAY',
          openTime: '6:00 AM',
          closeTime: '7:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-5',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'SATURDAY',
          openTime: '7:00 AM',
          closeTime: '5:00 PM'
        },
        {
          locationHoursId: 'hours-producer-003-6',
          createDate: '2023-01-01T00:00:00Z',
          lastUpdateDate: '2023-01-01T00:00:00Z',
          producerId: 'producer-003',
          producerLocationId: 'location-003',
          dayOfWeek: 'SUNDAY',
          openTime: '8:00 AM',
          closeTime: '4:00 PM'
        }
      ]
    }
  };

  return mockProfiles[producerId] || mockProfiles['producer-001'];
};

export const useProfileData = () => {
  const { producerId } = useParams<{ producerId: string }>();
  const [searchParams] = useSearchParams();
  
  // Get producer location ID and business name from URL params (passed from search results)
  const producerLocationId = searchParams.get('locationId');
  const businessName = searchParams.get('businessName');
  
  // Use only the producer profile hook
  const { data: producerProfileResponse, isLoading, error } = useProducerProfile(producerLocationId || '');
  
  // Convert producer profile to profile data format if available
  let profile: ProfileData | null = null;
  if (producerLocationId && producerProfileResponse?.response) {
    profile = convertProducerProfileToProfileData(producerProfileResponse.response, businessName || undefined);
  } else {
    // Use mock data as fallback
    profile = getMockProfileData(producerId || 'producer-001');
  }

  return {
    profile,
    isLoading,
    error
  };
};
