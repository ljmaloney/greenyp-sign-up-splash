
import { APISubscription, SubscriptionWithFormatting } from '../types/subscription';
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

// Format subscription data for display
export const formatSubscriptionData = (subscriptions: APISubscription[]): SubscriptionWithFormatting[] => {
  return subscriptions.map(subscription => ({
    ...subscription,
    formattedMonthlyPrice: subscription.monthlyAutopayAmount === 0 ? '$0' : `$${subscription.monthlyAutopayAmount}`,
    formattedYearlyPrice: subscription.yearlyAutopayAmount ? `$${subscription.yearlyAutopayAmount}` : undefined
  }));
};

// Mock data for development and fallback
export const mockSubscriptionsResponse = (): SubscriptionWithFormatting[] => {
  const mockData: APISubscription[] = [
    {
      subscriptionId: "basic-listing-001",
      displayName: "Basic Listing",
      shortDescription: "Perfect for small local landscaping or gardening businesses",
      monthlyAutopayAmount: 0,
      features: [
        { id: "1", name: "Basic business listing" },
        { id: "2", name: "Contact information" },
        { id: "3", name: "Business hours" },
        { id: "4", name: "Single category listing" },
        { id: "5", name: "Map location" }
      ],
      comingSoon: false,
      popular: false
    },
    {
      subscriptionId: "featured-business-001",
      displayName: "Featured Business",
      shortDescription: "Ideal for established landscaping and garden businesses",
      monthlyAutopayAmount: 29,
      yearlyAutopayAmount: 290,
      features: [
        { id: "1", name: "Priority placement in searches" },
        { id: "2", name: "Enhanced business profile" },
        { id: "3", name: "Photo gallery (up to 15 images)" },
        { id: "4", name: "Customer reviews & ratings" },
        { id: "5", name: "Multiple category listings" },
        { id: "6", name: "Business verification badge" }
      ],
      comingSoon: false,
      popular: true
    },
    {
      subscriptionId: "premium-partner-001",
      displayName: "Premium Partner",
      shortDescription: "For multi-location nurseries and landscaping companies",
      monthlyAutopayAmount: 79,
      yearlyAutopayAmount: 790,
      features: [
        { id: "1", name: "Top search placement" },
        { id: "2", name: "Multiple location management" },
        { id: "3", name: "Seasonal promotional features" },
        { id: "4", name: "Eco-certification badges" },
        { id: "5", name: "Extended photo gallery (50+ images)" },
        { id: "6", name: "Video showcase option" },
        { id: "7", name: "Featured in 'Recommended' section" }
      ],
      comingSoon: true,
      popular: false
    }
  ];

  return formatSubscriptionData(mockData);
};
