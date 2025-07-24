
import { APISubscription, SubscriptionWithFormatting, APISubscriptionFeature } from '../types/subscription';
import { APIResponse } from '../types/responseBody';
import { API_CONFIG, getApiUrl } from '../config/api';

// Fetch subscriptions from the real API
export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  try {
    console.log('Fetching subscriptions from API...');
    const url = getApiUrl('/reference/subscription');
    console.log('Subscription API URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: APIResponse<APISubscription[]> = await response.json();
    console.log('Subscription API response:', data);
    
    // Access the response data from the generic container
    const subscriptions = data.response;
    
    return formatSubscriptionData(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    // Fall back to mock data if the API fails
    return mockSubscriptionsResponse();
  }
};

// Sort features by sortOrder ascending, then by featureName ascending
const sortFeatures = (features: APISubscriptionFeature[]): APISubscriptionFeature[] => {
  return features
    .filter(feature => feature.display) // Only show features marked for display
    .sort((a, b) => {
      // First sort by sortOrder ascending
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      // Then sort by featureName ascending as tiebreaker
      return a.featureName.localeCompare(b.featureName);
    });
};

// Format subscription data for display
export const formatSubscriptionData = (subscriptions: APISubscription[]): SubscriptionWithFormatting[] => {
  // Filter out subscriptions with subscriptionType of DATA_IMPORT_NO_DISPLAY
  const displayableSubscriptions = subscriptions.filter(
    subscription => subscription.subscriptionType !== 'DATA_IMPORT_NO_DISPLAY'
  );
  
  const formatted = displayableSubscriptions.map((subscription, index) => ({
    ...subscription,
    formattedMonthlyPrice: subscription.comingSoon ? '' : 
      subscription.monthlyAutopayAmount === 0 ? '$0' : `$${subscription.monthlyAutopayAmount}`,
    formattedYearlyPrice: subscription.comingSoon ? undefined :
      subscription.annualBillAmount ? `$${subscription.annualBillAmount}` : undefined,
    formattedFeatures: sortFeatures(subscription.features).map((feature, featureIndex) => ({
      id: `${subscription.subscriptionId}-feature-${featureIndex}`,
      name: feature.featureName
    })),
    popular: index === 1 && !subscription.comingSoon // Mark the second subscription as popular if not coming soon
  }));
  
  console.log('Formatted subscription data:', formatted);
  return formatted;
};

// Mock data for development and fallback
export const mockSubscriptionsResponse = (): SubscriptionWithFormatting[] => {
  const mockData: APISubscription[] = [
    {
      subscriptionId: "6ece5c9d-ae1b-483f-b0ae-61b4b3d63fed",
      version: 0,
      createDate: "2025-05-29T21:32:40Z",
      lastUpdateDate: "2025-05-29T21:32:40Z",
      displayName: "Basic Listing",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 5,
      quarterlyAutopayAmount: 15,
      annualBillAmount: 60,
      shortDescription: "Perfect for small local landscaping or gardening businesses",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: false,
      sortOrder: 0,
      features: [
        {
          feature: "basic",
          sortOrder: 0,
          display: true,
          featureName: "Basic business listing",
          configMap: null
        },
        {
          feature: "hours",
          sortOrder: 0,
          display: true,
          featureName: "Business Hours",
          configMap: null
        },
        {
          feature: "category",
          sortOrder: 1,
          display: true,
          featureName: "Single category listing",
          configMap: {
            maxCount: 1
          }
        },
        {
          feature: "map",
          sortOrder: 0,
          display: true,
          featureName: "Map Location",
          configMap: null
        },
        {
          feature: "contact",
          sortOrder: 0,
          display: true,
          featureName: "Contact Information",
          configMap: null
        }
      ]
    },
    {
      subscriptionId: "900e7344-0470-46ab-82e0-b85afe11cd81",
      version: 0,
      createDate: "2025-05-29T21:35:47Z",
      lastUpdateDate: "2025-05-29T21:35:47Z",
      displayName: "Featured Business Listing",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 29,
      quarterlyAutopayAmount: 85,
      annualBillAmount: 300,
      shortDescription: "Ideal for established landscaping and garden businesses",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: false,
      sortOrder: 1,
      features: [
        {
          feature: "services",
          sortOrder: 6,
          display: true,
          featureName: "List up to 10 services",
          configMap: {
            maxCount: 10
          }
        },
        {
          feature: "enhanced",
          sortOrder: 0,
          display: true,
          featureName: "Enhanced business profile",
          configMap: null
        },
        {
          feature: "locations",
          sortOrder: 2,
          display: true,
          featureName: "Multiple Location Listings (up to 5)",
          configMap: {
            maxCount: 5
          }
        },
        {
          feature: "category",
          sortOrder: 1,
          display: true,
          featureName: "Listing in up to 3 categories",
          configMap: {
            maxCount: 3
          }
        },
        {
          feature: "priority",
          sortOrder: 0,
          display: true,
          featureName: "Priority placement in searches",
          configMap: null
        },
        {
          feature: "logo",
          sortOrder: 3,
          display: true,
          featureName: "Display a business logo",
          configMap: {
            logo: 1
          }
        },
        {
          feature: "gallery",
          sortOrder: 4,
          display: true,
          featureName: "Photo gallery (up to 15 images)",
          configMap: {
            maxGalleryCount: 15
          }
        },
        {
          feature: "products",
          sortOrder: 5,
          display: true,
          featureName: "List up to 10 products",
          configMap: {
            maxCount: 10
          }
        }
      ]
    },
    {
      subscriptionId: "a62f4251-e1c1-4f8d-a946-4ebf9720f686",
      version: 0,
      createDate: "2025-05-29T21:38:02Z",
      lastUpdateDate: "2025-05-29T21:38:02Z",
      displayName: "Premium Business Listing",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 0,
      quarterlyAutopayAmount: 0,
      annualBillAmount: 0,
      shortDescription: "Enhanced business listing with the most features and functionality",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: true,
      sortOrder: 2,
      features: [
        {
          feature: "topsearch",
          sortOrder: 0,
          display: true,
          featureName: "Top search placement",
          configMap: null
        },
        {
          feature: "recomended",
          sortOrder: 0,
          display: true,
          featureName: "Featured in 'Recommended' section",
          configMap: null
        },
        {
          feature: "locations",
          sortOrder: 2,
          display: true,
          featureName: "Unlimited number of locations",
          configMap: {
            maxCount: 9999
          }
        },
        {
          feature: "category",
          sortOrder: 1,
          display: true,
          featureName: "Listing in up to 6 categories",
          configMap: {
            maxCount: 6
          }
        },
        {
          feature: "cert-badge",
          sortOrder: 0,
          display: true,
          featureName: "Eco-certification badges",
          configMap: null
        },
        {
          feature: "services",
          sortOrder: 6,
          display: true,
          featureName: "List up to 50 services",
          configMap: {
            maxCount: 50
          }
        },
        {
          feature: "logo",
          sortOrder: 3,
          display: false,
          featureName: "Display a business logo",
          configMap: {
            logo: 1
          }
        },
        {
          feature: "gallery",
          sortOrder: 4,
          display: true,
          featureName: "Extended photo gallery (50+ images)",
          configMap: {
            maxGalleryCount: 999
          }
        },
        {
          feature: "seasonal-promo",
          sortOrder: 0,
          display: true,
          featureName: "Seasonal promotional features",
          configMap: null
        },
        {
          feature: "products",
          sortOrder: 5,
          display: true,
          featureName: "List up to 50 products",
          configMap: {
            maxCount: 50
          }
        }
      ]
    }
  ];

  console.log('Using mock subscription data with new feature structure');
  return formatSubscriptionData(mockData);
};
