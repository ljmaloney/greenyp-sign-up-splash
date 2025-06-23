
import { useParams, useSearchParams } from 'react-router-dom';
import { useProducerProfile } from './useProfile';
import { ProfileData } from '@/types/profile';
import { convertProducerProfileToProfileData, createMockProfileFromParams } from '@/utils/profileDataConverters';
import { getMockProfileData, MOCK_PROFILE_IDS } from '@/data/mockProfileData';

export const useProfileData = () => {
  const params = useParams<{ producerId: string }>();
  const [searchParams] = useSearchParams();
  
  // The producerId from the URL is actually the producerLocationId for the API
  const producerLocationId = params.producerId;
  
  // Get the locationId from URL search parameters - do NOT use producerLocationId as fallback
  const locationId = searchParams.get('locationId');
  
  console.log('Profile data params (fixed):', { 
    params,
    producerLocationId,
    locationIdFromParams: searchParams.get('locationId'),
    finalLocationId: locationId,
    searchParams: Object.fromEntries(searchParams) 
  });
  
  // Use the producer profile hook with the producerLocationId
  const { data: producerProfileResponse, isLoading: apiLoading, error: apiError } = useProducerProfile(producerLocationId || '');
  
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
  } else if (producerLocationId) {
    // API failed or returned error, use mock data
    if (MOCK_PROFILE_IDS.includes(producerLocationId)) {
      profile = getMockProfileData(producerLocationId);
      console.log('Using hardcoded mock data');
    } else {
      // Create mock data from URL parameters for unknown location IDs
      profile = createMockProfileFromParams(producerLocationId, searchParams);
      console.log('Using generated mock data from URL params');
    }
    
    // When using mock data, we're not loading and there's no error for the user
    isLoading = false;
    error = null;
  } else {
    // No producerLocationId available
    isLoading = apiLoading;
    error = apiError;
  }

  console.log('Profile data result:', { producerLocationId, locationId, profile, isLoading, error });

  return {
    profile,
    isLoading,
    error
  };
};
