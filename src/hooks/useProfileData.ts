
import { useParams, useSearchParams } from 'react-router-dom';
import { useProducerProfile } from './useProfile';
import { ProfileData } from '@/types/profile';
import { convertProducerProfileToProfileData, createMockProfileFromParams } from '@/utils/profileDataConverters';
import { getMockProfileData, MOCK_PROFILE_IDS } from '@/data/mockProfileData';

export const useProfileData = () => {
  const params = useParams<{ producerId: string }>();
  const [searchParams] = useSearchParams();
  
  // Get the producer ID from URL parameters
  const producerId = params.producerId;
  
  // Get the locationId from URL search parameters, fallback to producerId
  const locationId = searchParams.get('locationId') || producerId;
  
  console.log('Profile data params (fixed):', { 
    params,
    producerId,
    locationIdFromParams: searchParams.get('locationId'),
    finalLocationId: locationId,
    searchParams: Object.fromEntries(searchParams) 
  });
  
  // Use the producer profile hook with the cleaned locationId
  const { data: producerProfileResponse, isLoading: apiLoading, error: apiError } = useProducerProfile(locationId || '');
  
  // Convert producer profile to profile data format if available
  let profile: ProfileData | null = null;
  let isLoading = false;
  let error: Error | null = null;

  if (producerProfileResponse?.response && !producerProfileResponse.errorMessageApi) {
    // API returned valid data
    profile = convertProducerProfileToProfileData(producerProfileResponse.response);
    isLoading = apiLoading;
    error = apiError;
    console.log('Using API response data');
  } else if (locationId) {
    // API failed or returned error, use mock data
    if (MOCK_PROFILE_IDS.includes(locationId)) {
      profile = getMockProfileData(locationId);
      console.log('Using hardcoded mock data');
    } else {
      // Create mock data from URL parameters for unknown location IDs
      profile = createMockProfileFromParams(producerId || locationId, searchParams);
      console.log('Using generated mock data from URL params');
    }
    
    // When using mock data, we're not loading and there's no error for the user
    isLoading = false;
    error = null;
  } else {
    // No locationId available
    isLoading = apiLoading;
    error = apiError;
  }

  console.log('Profile data result:', { producerId, locationId, profile, isLoading, error });

  return {
    profile,
    isLoading,
    error
  };
};
