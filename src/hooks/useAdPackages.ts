
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { AdPackagesResponse } from '@/types/adPackages';

// Dummy/demo data that matches the expected API response format
const DUMMY_AD_PACKAGES_DATA: AdPackagesResponse = {
  response: [
    {
      adTypeId: "basic-001",
      createDate: "2024-01-01T00:00:00Z",
      active: true,
      adTypeName: "Basic",
      monthlyPrice: 10,
      threeMonthPrice: 25,
      features: {
        features: [
          "Text-only listing",
          "30-day visibility",
          "Email contact form"
        ],
        maxImages: 0,
        protectContact: false
      }
    },
    {
      adTypeId: "standard-002",
      createDate: "2024-01-01T00:00:00Z",
      active: true,
      adTypeName: "Standard",
      monthlyPrice: 20,
      threeMonthPrice: 50,
      features: {
        features: [
          "Text listing with images",
          "Up to 5 high-quality photos",
          "30-day visibility",
          "Email contact form",
          "Featured in category searches"
        ],
        maxImages: 5,
        protectContact: false
      }
    },
    {
      adTypeId: "premium-003",
      createDate: "2024-01-01T00:00:00Z",
      active: true,
      adTypeName: "Premium",
      monthlyPrice: 30,
      threeMonthPrice: 75,
      features: {
        features: [
          "Premium listing with enhanced visibility",
          "Up to 10 high-quality photos",
          "45-day visibility",
          "Protected contact information",
          "Priority placement in search results",
          "Social media promotion"
        ],
        maxImages: 10,
        protectContact: true
      }
    }
  ],
  errorMessageApi: null
};

export const useAdPackages = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['ad-packages'],
    queryFn: async (): Promise<AdPackagesResponse> => {
      console.log('🎯 Fetching ad packages from API...');
      try {
        const response = await apiClient.get('/reference/classified/ad/types');
        console.log('📦 Ad packages response:', response);
        return response;
      } catch (error) {
        console.log('⚠️ API failed, using dummy data for demo purposes:', error);
        // Return dummy data when API fails
        return DUMMY_AD_PACKAGES_DATA;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
  });
};
